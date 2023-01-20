call npx tsc -p tsconfig.json
call node compile.js
xcopy "./client.js" "./../resources/" /y /i /f
cd..
call "./quick_launch.bat"
pause