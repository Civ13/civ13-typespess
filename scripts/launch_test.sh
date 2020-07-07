#!/bin/bash
cd -
cd maps
npx ts-node mapgen.ts
cd -
cd client_src
echo npx ts-node compile.ts
cd -
npx ts-node index.ts test