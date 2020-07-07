@echo off

title Typespess Installation

echo Installing packages...

echo.
call npm install

echo.
echo Packages installed.

cd client_src
echo Browserifying client...

echo.
call npm install -g typescript
call npm install -g ts-node
call npx ts-node compile.ts

echo.
echo Done.

echo.
echo Everything is done.

echo.
