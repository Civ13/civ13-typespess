#!/bin/bash
cd -
apt install nodejs npm
npm install
npm install -g typescript
npm install -g ts-node
npm install -g pouchdb-server
cd client_src
echo Browserifying client...
ts-node compile.ts
cd -
cd maps
echo Generating the map...
ts-node mapgen.ts
cd -
cd client_src
echo Generating the preload list...
echo ts-node compile.ts
echo Everything is done.
