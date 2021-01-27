#!/bin/bash
echo Launching Database... Address: 127.0.0.1:5984
cd -
mkdir -p pouchdb
cd pouchdb
pouchdb-server --port 5984