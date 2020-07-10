@echo off

title Typespess Installation

echo Installing packages...

echo.
cd..
call npm install
call npm install -g typescript
call npm install -g ts-node
call npm install -g pouchdb-server
echo.
echo Packages installed.
cd client_src
echo Browserifying client...
echo.
call ts-node compile.ts
echo.
echo Done.
echo.
echo Generating the map...
cd..
cd maps
call ts-node mapgen.ts
echo .
echo Everything is done.
echo.
pause