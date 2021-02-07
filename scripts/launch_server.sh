#!/bin/bash
cd -
cd client_src
echo Generating the preload list...
ts-node preload_assets.ts
echo Browserifying Client...
ts-node compile.ts
cd -
echo Transpiling Server...
tsc -p tsconfig.json
echo Launching Server...
node index.js
