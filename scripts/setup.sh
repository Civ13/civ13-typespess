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
echo Everything is done.
