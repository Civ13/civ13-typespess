#!/bin/bash
cd -
cd maps
echo ts-node mapgen.ts
cd -
cd client_src
echo ts-node preload_assets.ts
echo ts-node compile.ts
cd -
ts-node index.js test

