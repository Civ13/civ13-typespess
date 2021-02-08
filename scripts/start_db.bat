@echo off
echo Launching Database... Address: 127.0.0.1:5984
cd..
md pouchdb
cd pouchdb
call npx pouchdb-server --port 5984
pause
@echo on