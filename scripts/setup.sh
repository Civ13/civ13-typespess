#!/bin/bash
cd -
apt install nodejs npm
npm install
echo Cloning typespess-client into client_src...
git clone https://github.com/civ13/typespess-client client_src
cd client_src
npm install
cd -
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
