#!/bin/bash
cd -
cd client_src
echo Generating the preload list...
ts-node preload_assets.ts
echo Browserifying Client...
ts-node compile.ts
cd -
echo Launching Server...
ts-node index.ts
