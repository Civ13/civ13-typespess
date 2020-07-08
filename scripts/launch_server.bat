@echo off

title Typespess Server

cd..
call pouchdb-server --port 5984
cd client_src
echo Browserifying Client...
call ts-node compile.ts
cd..
call ts-node index.js

pause