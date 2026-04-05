#!/usr/bin/env bash
set -euo pipefail

GIT_ROOT=$(git rev-parse --show-toplevel)
HOOKS_SRC="$GIT_ROOT/.hooks"
HOOKS_DST="$GIT_ROOT/.git/hooks"

for hook in "$HOOKS_SRC"/*; do
    name=$(basename "$hook")
    target="$HOOKS_DST/$name"
    ln -sf "$hook" "$target"
    chmod +x "$hook"
    echo "linked $name -> $target"
done
