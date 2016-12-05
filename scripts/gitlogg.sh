#!/usr/bin/env bash

# Magical incantation mimics node's __dirname
__dirname="$(cd "$(
    dirname "$(
        node -e 'var out=process.argv[1];try {out=require("path").resolve(out, "..", require("fs").readlinkSync(out))} catch(e) {} finally {console.log(out)}' "${BASH_SOURCE[0]}"
    )"
)" && pwd)"

source "$__dirname/gitlogg-generate-log.sh"
