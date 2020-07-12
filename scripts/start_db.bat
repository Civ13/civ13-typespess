@echo off
echo Launching Database...
cd..
cd pouchdb
pouchdb-server --port 5984
pause
@echo on