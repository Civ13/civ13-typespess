#!/bin/bash
cd -
cd client_src
echo Generating the preload list...
ts-node preload_assets.js
echo Browserifying Client...
ts-node compile.js
cd -
echo Launching Server...
ts-node index.js
