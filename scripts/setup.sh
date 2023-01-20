#!/bin/bash
cd -
apt install nodejs npm
npm install
echo Transpiling to JavaScript...
npx tsc -p tsconfig.json
cd client_src
echo Browserifying client...
npx tsc -p tsconfig.json
node compile.js "./../resources/"
cd -
cd maps
echo Generating the map...
node mapgen.js
cd -
echo Everything is done.
