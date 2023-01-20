#!/bin/bash
cd -
echo Transpiling Server...
npx tsc -p tsconfig.json
cd client_src
echo Browserifying Client...
npx tsc -p tsconfig.json
node compile.js "./../resources/"
cd -
echo Launching Server...
node index.js
