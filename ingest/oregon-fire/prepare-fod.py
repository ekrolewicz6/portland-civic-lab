"""Offline format conversion only. Authoritative ingestion is fod.ts.

Download the pinned seventh-edition archive to runtime-data/oregon-fire, verify
its publisher checksum, and convert Oregon rows to JSONL with stdlib sqlite3.
This avoids loading a national SQLite database in a serverless function.
"""
import hashlib
import json
import sqlite3
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / 'runtime-data' / 'oregon-fire'
ROOT.mkdir(parents=True, exist_ok=True)
URL = 'https://www.fs.usda.gov/rds/archive/products/RDS-2013-0009.7/RDS-2013-0009.7_Data_Format4_SQLITE.zip'
CHECKSUM = 'a5d691bdbcf5a3de6a7e0d94380df311dd2c552645395312e55510424a7483fb'
archive = ROOT / 'RDS-2013-0009.7_Data_Format4_SQLITE.zip'
if not archive.exists():
    with urllib.request.urlopen(URL, timeout=120) as response, archive.open('wb') as out:
        while chunk := response.read(1024 * 1024):
            out.write(chunk)
digest = hashlib.file_digest(archive.open('rb'), 'sha256').hexdigest()
if digest != CHECKSUM:
    raise RuntimeError('FOD archive checksum mismatch; no records prepared')
with zipfile.ZipFile(archive) as bundle:
    member = next(n for n in bundle.namelist() if n.lower().endswith('.sqlite'))
    database = ROOT / 'FPA_FOD_20260615.sqlite'
    if not database.exists():
        with bundle.open(member) as source, database.open('wb') as out:
            while chunk := source.read(1024 * 1024):
                out.write(chunk)
connection = sqlite3.connect(f'file:{database}?mode=ro', uri=True)
connection.row_factory = sqlite3.Row
fields = {r[1] for r in connection.execute('PRAGMA table_info(Fires)')}
allowed = ['FOD_ID','FIRE_NAME','FIRE_YEAR','DISCOVERY_DOY','FIRE_SIZE','LATITUDE','LONGITUDE','STATE','COUNTY','IRWINID','IRWIN_ID','SOURCE_REPORTING_UNIT_NAME']
selected = [name for name in allowed if name in fields]
if not {'FOD_ID','FIRE_YEAR','LATITUDE','LONGITUDE','STATE'} <= fields:
    raise RuntimeError('Unexpected seventh-edition schema')
count = 0
with (ROOT / 'fod-oregon.jsonl').open('w') as out:
    for row in connection.execute('SELECT '+','.join(selected)+' FROM Fires WHERE STATE = ? ORDER BY FOD_ID', ('OR',)):
        data = dict(row)
        out.write(json.dumps({'type':'Feature','properties':data,'geometry':{'type':'Point','coordinates':[data['LONGITUDE'],data['LATITUDE']]}})+'\n')
        count += 1
(ROOT / 'fod-manifest.json').write_text(json.dumps({'edition':7,'archiveUrl':URL,'sha256':digest,'rows':count,'filter':"STATE='OR'"}, indent=2))
print(f'Prepared {count} Oregon records from verified FPA FOD edition 7')
