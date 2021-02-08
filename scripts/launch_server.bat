@echo off

title Typespess Server

cd..
echo Transpiling Server...
call npx tsc -p tsconfig.json
cd client_src
echo Generating the preload list...
call node preload_assets.js
echo Browserifying Client...
call node compile.js
cd..
echo Launching Server...
call node index.js
pause