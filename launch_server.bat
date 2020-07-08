@echo off

title Typespess Server

echo Generating the map...
cd maps
call ts-node mapgen.ts
cd..
cd client_src
echo Browserifying Client...
call ts-node compile.ts
cd..
call ts-node index.js

pause