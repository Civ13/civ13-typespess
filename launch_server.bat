@echo off

title Typespess Server

echo Generating the map...
cd maps
call npx ts-node mapgen.ts
cd..
cd client_src
echo Running Gulp...
call gulp
cd..
call npx ts-node index.js

pause