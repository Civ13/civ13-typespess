@echo off
title Typespess Installation
echo Installing packages...
cd..
call npm install
call npm install -g typescript
call npm install -g ts-node
call npm install -g pouchdb-server
echo Packages installed.
cd client_src
echo Generating the preload list...
call ts-node preload_assets.ts
echo Browserifying client...
call ts-node compile.ts
echo Generating the map...
cd..
cd maps
call ts-node mapgen.ts
echo Everything is done.
pause