#!/bin/bash
cd maps
ts-node mapgen.ts
cd -
cd client_src
echo ts-node compile.ts
cd -
node index.js