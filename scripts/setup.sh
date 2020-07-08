#!/bin/bash
cd -
npm install
npm install -g typescript
npm install -g ts-node
cd client_src
ts-node compile.ts
cd -
cd maps
ts-node mapgen.ts
