@echo off

title Typespess Server

cd..
cd client_src
echo Generating the preload list...
call ts-node preload_assets.ts
echo Browserifying Client...
call ts-node compile.ts
cd..
echo Launching Server...
call ts-node index.js
pause