#!/bin/bash
cd -
cd maps
echo ts-node mapgen.js
cd -
cd client_src
echo ts-node preload_assets.js
echo ts-node compile.js
cd -
ts-node index.js test

