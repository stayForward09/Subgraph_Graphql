# Ruby Subgraphs

# Install

1. `yarn`

## Graph node

First we need to start up the graph node, in a separate terminal:

- `yarn run-graph-node`

Or read the docker instructions in `graph-node` directory

## Build

You can check the build of everything at once using

- `yarn prepare:rubyNewSchain`
- `yarn codegen`
- `yarn build`

either from the top level directory, or in every subgraph
directory

## Deployment

For each of the following you 

- `cd subgraphs/dexcandles`
- `cd subgraphs/exchange`
- `cd subgraphs/rubymasterchef`

You can execute the following to deploy to localhost (or when run
on the graph server)

- `yarn create-local` # this is the right command as the urls are local to the server (when run from the server)
- `yarn deploy-local` # this is the right command as the urls are local to the server (when run from the server)

### Cleaning Everything

* in a local test environment (e.g. using docker) you can clean everything and start from
  the beginning again by
  * stopping docker `$ cd graph-node; docker-compose down; cd -`
  * deleting docker data `$ cd graph-node; rm -rf ./data; cd -`
  * cleaning the repo of all built files `$ git clean -dfx`
  * rebuilding everything `$ yarn; yarn prepare:rubyNewSchain; yarn codegen; yarn build`
  * start docker locally `$ cd graph-node; docker-compose up -d; cd -`
  * redeploy everything
    * as above
    * for each dir, `yarn create-local` and `yarn deploy-local`)

## Notes

- The following subgraphs are not deployed in production yet, and need to be completed
  - user
  - maker
  - lockup
- All of the necessary contracts are deployed correctly to the Skale testchain and all of the addresses are set under `config/rubyNewSchain.json`
- All of the constants are prepared for the Skale testnet deployment, so you don't need to run anything additionally
- If you stumble across an error that some of the subgraphs is already created, then skip the `yarn create-local` command, or run `yarn remove-local` and then `yarn create-local`.
