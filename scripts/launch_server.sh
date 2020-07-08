#!/bin/bash
cd -
echo pouchdb-server --port 5984
cd client_src
echo ts-node compile.ts
cd -
echo ts-node index.js

