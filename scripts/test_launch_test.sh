#!/bin/sh
# Exercise the actual launcher with isolated commands, never a real server.
set -eu
checkout=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT HUP INT TERM
mkdir -p "$fixture/repo/scripts" "$fixture/repo/client_src" "$fixture/repo/maps" "$fixture/bin"
cp "$checkout/scripts/launch_test.sh" "$fixture/repo/scripts/launch_test.sh"

cat > "$fixture/bin/npm" <<'MOCK'
#!/bin/sh
set -eu
[ "$*" = 'ci --include=dev' ] || exit 90
echo install >> "$STAGE_LOG"
if [ "$FAIL_STAGE" = install ]; then exit 41; fi
MOCK
cat > "$fixture/bin/node" <<'MOCK'
#!/bin/sh
set -eu
case "$1" in
    */node_modules/typescript/bin/tsc)
        [ "$2 $3 $4" = '-p tsconfig.json --noEmitOnError' ] || exit 91
        if [ "${PWD##*/}" = client_src ]; then stage=client; else stage=server; fi
        ;;
    compile.js) stage=bundle; [ "${PWD##*/}" = client_src ] || exit 92 ;;
    mapgen.js) stage=map; [ "${PWD##*/}" = maps ] || exit 93 ;;
    index.js) stage=start; [ "$2" = test ] || exit 94 ;;
    *) exit 95 ;;
esac
echo "$stage" >> "$STAGE_LOG"
if [ "$FAIL_STAGE" = "$stage" ]; then
    echo "injected $stage failure" >&2
    exit 42
fi
MOCK
chmod +x "$fixture/bin/npm" "$fixture/bin/node"
export PATH="$fixture/bin:$PATH"
STAGE_LOG="$fixture/stages"
export STAGE_LOG FAIL_STAGE

expected=''
for stage in install server client bundle map start; do
    expected="${expected}${stage}
"
    FAIL_STAGE=$stage
    : > "$STAGE_LOG"
    status=0
    # Run from outside the checkout to cover the original cd- bug too.
    (cd "$fixture" && sh repo/scripts/launch_test.sh) > "$fixture/output" 2>&1 || status=$?
    wanted=42
    if [ "$stage" = install ]; then wanted=41; fi
    [ "$status" -eq "$wanted" ] || { cat "$fixture/output"; echo "wrong status for $stage: $status"; exit 1; }
    [ "$(cat "$STAGE_LOG")" = "$(printf '%s' "$expected")" ] || { echo "continued after $stage failure"; exit 1; }
    if grep -q 'All done.' "$fixture/output"; then echo "false success after $stage failure"; exit 1; fi
    echo "PASS: $stage failure propagates and stops subsequent stages"
done
FAIL_STAGE=none
: > "$STAGE_LOG"
(cd "$fixture" && sh repo/scripts/launch_test.sh) > "$fixture/output" 2>&1
[ "$(cat "$STAGE_LOG")" = "$(printf '%s' "$expected")" ]
grep -q 'All done.' "$fixture/output"
echo 'PASS: successful pipeline completes every stage'
