@echo off

title Typespess Server

cd..
echo Transpiling Server...
call npx tsc -p tsconfig.json
cd client_src
echo Browserifying Client...
call npx tsc -p tsconfig.json
call node compile.js "./../resources/"
cd..
echo Launching Server...
call node index.js
pause