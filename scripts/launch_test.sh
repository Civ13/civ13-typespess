#!/bin/bash
cd -
echo npx tsc -p tsconfig.json
cd maps
echo node mapgen.js
cd -
cd client_src
echo node preload_assets.js
echo node compile.js
cd -
echo node index.js test

