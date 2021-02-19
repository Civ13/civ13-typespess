@echo off
title Typespess Installation
echo Installing packages...
cd..
call npm install
echo Transpiling to JavaScript...
call npx tsc -p tsconfig.json
cd client_src
echo Browserifying client...
call node compile.js
echo Generating the map...
cd..
cd maps
call node mapgen.js
echo Everything is done.
pause