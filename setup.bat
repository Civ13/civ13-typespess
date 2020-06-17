@echo off

title Typespess Installation

echo Installing packages...

echo.
call npm install

echo.
echo Packages installed.

cd client_src
echo Running gulp...

echo.
call gulp

echo.
echo Done.

echo.
echo Everything is done.

echo.
