#!/bin/bash
set -e

read -p "This script updates from git and re-deploys subgraphs. It should only be executed on our AWS thegraph node. Continue? Y/N " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi

cd ~/subgraphs

#git clean -dfx
git pull --ff-only

yarn

cd subgraphs/dexcandles
yarn prepare:skaleTestnet
yarn codegen
yarn build

cd ~/subgraphs

