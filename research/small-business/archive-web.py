#!/usr/bin/env python3
"""Archive the four additional public evidence pages; retain failures without bypass."""
import json,hashlib,urllib.request,datetime
from pathlib import Path
root=Path(__file__).resolve().parents[2];here=Path(__file__).resolve().parent
out=root/'runtime-data/small-business/web';sources=json.loads((here/'web-sources.json').read_text());logs=[]
for s in sources:
 p=out/(s['id']+'.html')
 try:
  if not p.exists():
   request=urllib.request.Request(s['url'],headers={'User-Agent':'Mozilla/5.0 (compatible; research archive)'})
   with urllib.request.urlopen(request,timeout=30) as response:
    content=response.read();content_type=response.headers.get('Content-Type','');status=response.status
   p.write_bytes(content)
  else:content=p.read_bytes();content_type='text/html';status='cached'
  logs.append(dict(id=s['id'],url=s['url'],accessed_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),path=str(p.relative_to(root)),sha256=hashlib.sha256(content).hexdigest(),bytes=len(content),content_type=content_type,status=status))
 except Exception as e:logs.append(dict(id=s['id'],url=s['url'],status='inaccessible',error=str(e)))
(here/'web-archive.json').write_text(json.dumps(logs,indent=2)+'\n');print(json.dumps([{k:v for k,v in x.items() if k in ['id','status','bytes','error']} for x in logs],indent=2))
