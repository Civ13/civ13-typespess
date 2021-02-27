@echo off
title Typespess Installation
echo Installing packages...
cd..
call npm install
echo Cloning typespess-client into client_src...
call git clone https://github.com/civ13/typespess-client client_src
cd client_src
call npm install
cd..
echo Transpiling to JavaScript...
call npx tsc -p tsconfig.json
cd client_src
echo Browserifying client...
call npx tsc -p tsconfig.json
call node compile.js "./../resources/"
echo Generating the map...
cd..
cd maps
call node mapgen.js
echo Everything is done.
pause