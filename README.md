# Ruby Subgraphs

# Prerequisites

## Install

1. `yarn`

## Graph node

First we need to start up the graph node, in a separate terminal:

- `yarn run-graph-node`

Or read the docker instructions in `graph-node` directory

# Deployment From Scratch

## Build

From the top level directory

* `yarn prepare:NETWORK`
  * (testnet): `yarn prepare:rubyNewSchain`
  * (mainnet): `yarn prepare:europa`
* `yarn codegen`
* `yarn build`

## Deployment

Then, for each of the following

- `cd subgraphs/dexcandles`
- `cd subgraphs/exchange`
- `cd subgraphs/rubymasterchef`
- `cd subgraphs/rubyrouter`
- `cd subgraphs/lottery`
- `cd subgraphs/rubystaker`

You can execute the following to deploy to localhost (or when run
on the graph server)

- `yarn create-local` # this is the right command as the urls are local to the server (when run from the server)
- `yarn deploy-local` # this is the right command as the urls are local to the server (when run from the server)

### Cleaning Everything

* in a local test environment (e.g. using docker) you can clean everything and start from
  the beginning again by
  * stopping docker
    * (testnet):  
    `$ cd graph-node; docker-compose -f docker-compose.rubyNewSchain.yml down; cd -`
    * (mainnet):  
    `$ cd graph-node; docker-compose -f docker-compose.europa.yml down; cd -`
  * deleting docker data `$ cd graph-node; rm -rf ./data; cd -`
  * cleaning the repo of all built files `$ git clean -dfx`
  * rebuilding everything `$ yarn; yarn prepare:NETWORK; yarn codegen; yarn build`
    * (testnet):  
    `$ yarn; yarn prepare:rubyNewSchain; yarn codegen; yarn build`
    * (mainnet):  
    `$ yarn; yarn prepare:europa; yarn codegen; yarn build`
  * start docker locally
    * (testnet):  
    `$ cd graph-node; docker-compose -f docker-compose.rubyNewSchain.yml up -d; cd -`
    * (mainnet):  
    `$ cd graph-node; docker-compose -f docker-compose.europa.yml up -d; cd -`
  * redeploy everything
    * as above
    * for each dir, `yarn create-local` and `yarn deploy-local`)

# Deployment of a New Subgraph

If a new feature is developed, and a new sugraph is written in directory 'foo', you can rebuild an
deploy only that subgraph, not affecting any other deployed sugraph

* `cd subgraphs/foo`
* `yarn prepare:europa`
* `yarn codegen`
* `yarn build`
* `yarn create-local`
* `yarn deploy-local --version-label "v0.0.1"`

# Dev Notes

- All of the necessary contracts are deployed correctly to the Skale testchain and all of the addresses are set under `config/rubyNewSchain.json`
- All of the constants are prepared for the Skale testnet deployment, so you don't need to run anything additionally
- If you stumble across an error that some of the subgraphs is already created, then skip the `yarn create-local` command, or run `yarn remove-local` and then `yarn create-local`.

# Instance Notes

deployed on AWS

```
ubuntu@ip-10-1-13-250:~$ yarn --version
1.22.15
ubuntu@ip-10-1-13-250:~$ nodejs --version
v10.19.0
ubuntu@ip-10-1-13-250:~$ lsb_release -a
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 20.04.2 LTS
Release:	20.04
Codename:	focal
ubuntu@ip-10-1-13-250:~$ uname -a
Linux ip-10-1-13-250 5.4.0-1045-aws #47-Ubuntu SMP Tue Apr 13 07:02:25 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
ubuntu@ip-10-1-13-250:~$ 
```
