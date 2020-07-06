#!/bin/bash

npm install
npm install -g ts-node
cd client
npx ts-node compile.ts
