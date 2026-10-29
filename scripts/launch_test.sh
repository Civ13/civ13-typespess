#!/bin/sh
set -eu

# Resolve the checkout independently of the caller's working directory.
cd "$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
compiler="$PWD/node_modules/typescript/bin/tsc"

# The compiler and type declarations are required to build, including in CI.
# Keep npm's lifecycle-script policy intact; do not install distro Node over
# the runtime selected by actions/setup-node.
npm ci --include=dev

echo Transpiling to JavaScript...
node "$compiler" -p tsconfig.json --noEmitOnError
(
    cd client_src
    echo Browserifying client...
    node "$compiler" -p tsconfig.json --noEmitOnError
    node compile.js "./../resources/"
)
(
    cd maps
    echo Generating the map...
    node mapgen.js
)
echo Launching server...
node index.js test
echo All done.
