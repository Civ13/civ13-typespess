@echo off

title Typespess Server

echo Generating the map...
cd maps
call npx ts-node mapgen.ts
cd..
cd client_src
echo Browserifying Client...
call npx ts-node compile.ts
cd..
call npx ts-node index.js

pause