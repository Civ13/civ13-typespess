#!/bin/bash
echo "Generating the map..."
cd maps
npx ts-node mapgen.ts
cd -
cd client_src
echo "Running Gulp..."
gulp
cd -
node index.js