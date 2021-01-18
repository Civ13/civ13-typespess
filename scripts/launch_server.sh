#!/bin/bash
cd -
cd client_src
echo Browserifying Client...
ts-node compile.ts
cd -
echo Launching Server...
ts-node index.js
