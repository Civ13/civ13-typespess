#!/bin/bash

npm install
npm install -g typescript
npm install -g ts-node
npm install -g typescript
cd client_src
npx ts-node compile.ts
