#!/bin/bash
cd -
cd maps
ts-node mapgen.ts
cd -
cd client_src
echo ts-node compile.ts
cd -
ts-node index.js test

