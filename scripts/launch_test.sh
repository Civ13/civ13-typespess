#!/bin/bash
cd -
apt install nodejs npm
npm install --production
echo Transpiling to JavaScript...
npx tsc -p tsconfig.json
cd client_src
echo Browserifying client...
node compile.js
cd -
cd maps
echo Generating the map...
node mapgen.js
cd -
echo Launching server...
node index.js test
echo All done.
