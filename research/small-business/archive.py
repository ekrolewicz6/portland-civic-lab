#!/usr/bin/env python3
"""Archive public source-register URLs without replacing prior evidence.

The registry is discovery metadata; crawl-log.json records actual fetch results.
Raw files stay in ignored runtime-data/small-business/web. No login or retry on
access rejection. Run: python research/small-business/archive.py [--check].
"""
import argparse
import csv
import hashlib
import json
import mimetypes
import urllib.error
import urllib.request
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
HERE=Path(__file__).resolve().parent
DEST=ROOT/"runtime-data/small-business/web"
LOG=HERE/"crawl-log.json"
MAX_BYTES=10*1024*1024

def read_sources():
 with (HERE/"sources.tsv").open(newline="") as f:
  rows=list(csv.DictReader(f,delimiter="\t"))
 if any(not x["id"] or not x["url"] for x in rows): raise ValueError("Incomplete source")
 if len({x["id"] for x in rows})!=len(rows): raise ValueError("Duplicate source ID")
 return rows

def fetch(source):
 name=source["id"]
 if source["status"] in ("archived-reviewed","queued"):
  return {"id":name,"status":"prior-archive" if source["status"]=="archived-reviewed" else "queued","url":source["url"]}
 req=urllib.request.Request(source["url"],headers={"User-Agent":"PortlandCivicLabResearch/1.0 (public source archive; contact via portlandciviclab.org)"})
 try:
  with urllib.request.urlopen(req,timeout=25) as response:
   content_type=response.headers.get("Content-Type","").split(";")[0].strip().lower()
   if content_type not in ("text/html","text/plain","application/pdf","application/json","application/zip","application/octet-stream"):
    return {"id":name,"status":"unsupported-type","content_type":content_type,"url":source["url"]}
   chunks=[]; size=0
   while True:
    block=response.read(min(1<<20,MAX_BYTES+1-size))
    if not block: break
    chunks.append(block); size+=len(block)
    if size>MAX_BYTES:
     return {"id":name,"status":"oversized","bytes_lower_bound":size,"url":source["url"]}
   data=b"".join(chunks)
   ext={"text/html":".html","text/plain":".txt","application/pdf":".pdf","application/json":".json","application/zip":".zip"}.get(content_type) or Path(urlparse(source["url"]).path).suffix or ".bin"
   path=DEST/(name+ext)
   new_hash=hashlib.sha256(data).hexdigest()
   if path.exists():
    old_hash=hashlib.sha256(path.read_bytes()).hexdigest()
    if old_hash!=new_hash:
     candidate=DEST/(name+"-"+new_hash[:12]+ext)
     candidate.write_bytes(data)
     return {"id":name,"status":"changed-candidate","sha256":new_hash,"bytes":len(data),"file":str(candidate.relative_to(ROOT)),"url":source["url"]}
    return {"id":name,"status":"unchanged","sha256":old_hash,"bytes":len(data),"file":str(path.relative_to(ROOT)),"url":source["url"]}
   path.write_bytes(data)
   return {"id":name,"status":"archived","sha256":new_hash,"bytes":len(data),"file":str(path.relative_to(ROOT)),"url":source["url"]}
 except urllib.error.HTTPError as e:
  return {"id":name,"status":"http-error","code":e.code,"url":source["url"]}
 except Exception as e:
  return {"id":name,"status":"fetch-error","error":str(e)[:200],"url":source["url"]}

def main():
 parser=argparse.ArgumentParser()
 parser.add_argument("--check",action="store_true")
 args=parser.parse_args()
 rows=read_sources()
 if args.check:
  record=json.loads(LOG.read_text())
  ids={s["id"] for s in rows}
  if ids!={r["id"] for r in record["results"]}: raise ValueError("Crawl log and registry differ")
  urls={s["id"]:s["url"] for s in rows}
  if any(r["url"]!=urls[r["id"]] for r in record["results"]): raise ValueError("Crawl log URLs differ from registry")
  for r in record["results"]:
   if "file" in r:
    if hashlib.sha256((ROOT/r["file"]).read_bytes()).hexdigest()!=r["sha256"]: raise ValueError("Changed archive: "+r["id"])
  print(json.dumps({"sources":len(rows),"archived_records":sum("file" in r for r in record["results"])}))
  return
 DEST.mkdir(parents=True,exist_ok=True)
 prior={}
 if LOG.exists():
  urls={r["id"]:r["url"] for r in rows}
  prior={r["id"]:r for r in json.loads(LOG.read_text()).get("results",[]) if urls.get(r["id"])==r["url"]}
 results=[prior[r["id"]] for r in rows if r["id"] in prior]
 missing=[r for r in rows if r["id"] not in prior]
 with ThreadPoolExecutor(max_workers=4) as pool:
  futures=[pool.submit(fetch,row) for row in missing]
  for future in as_completed(futures): results.append(future.result())
 results.sort(key=lambda r:r["id"])
 record={"run_at_utc":datetime.now(timezone.utc).isoformat(),"max_bytes_per_source":MAX_BYTES,"results":results}
 LOG.write_text(json.dumps(record,indent=2,ensure_ascii=False)+"\n")
 counts={x:sum(r["status"]==x for r in results) for x in sorted({r["status"] for r in results})}
 print(json.dumps({"sources":len(rows),"status_counts":counts,"failed":[r["id"] for r in results if r["status"] in ("http-error","fetch-error","unsupported-type","oversized")]},indent=2))

if __name__=="__main__": main()
