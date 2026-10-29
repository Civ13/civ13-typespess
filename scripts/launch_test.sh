#!/bin/sh
set -eu

# Resolve the checkout independently of the caller's working directory.
cd "$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
compiler="$PWD/node_modules/typescript/bin/tsc"

# The compiler and type declarations are required to build, including in CI.
# Disable lifecycle scripts; do not install distro Node over the runtime
# selected by actions/setup-node or relax native-package script approvals.
npm ci --include=dev --ignore-scripts

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
