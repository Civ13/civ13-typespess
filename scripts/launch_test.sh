#!/bin/bash
cd -
apt install nodejs npm
npm install
echo Transpiling to JavaScript...
npx tsc -p tsconfig.json
cd client_src
echo Generating the preload list...
node preload_assets.js
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
