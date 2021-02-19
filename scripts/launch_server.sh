#!/bin/bash
cd -
echo Transpiling Server...
npx tsc -p tsconfig.json
cd client_src
echo Browserifying Client...
node compile.js
cd -
echo Launching Server...
node index.js
