#!/bin/bash

reldir="$( dirname -- "$0"; )";
cd "$reldir";
directory="$( pwd; )";

subgraphs=${1:-rubystaker exchange dexcandles rubyrouter rubymasterchef lottery}

for d in ${subgraphs}
do
  cd ${directory}/subgraphs/${d}
  pwd
  yarn create-local
  yarn deploy-local --version-label "v0.0.1"
done

