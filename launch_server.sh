#!/bin/bash
cd maps
npx ts-node mapgen.ts
cd -
cd client_src
npx ts-node compile.ts
cd -
npx ts-node index.ts