#!/bin/bash
echo "Generating the map..."
cd maps
npx ts-node mapgen.ts
cd -
cd client_src
gulp
cd -
npx ts-node index_test.js