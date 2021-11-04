# Ruby Subgraphs

# Install

1. `yarn`

## Graph node

First we need to start up the graph node, in a separate terminal:

- `yarn run-graph-node`

## Deployment

#### 1. DexCandles

- `cd subgraphs/dexcandles`
- `yarn prepare:skaleTestnet`
- `yarn codegen`
- `yarn build`
- `yarn create-local` # this is the right command as the urls are local to the server (when run from the server)
- `yarn deploy-local` # this is the right command as the urls are local to the server (when run from the server)


#### 2. Exchange

- `cd subgraphs/exchange`
- `yarn prepare:skaleTestnet`
- `yarn codegen`
- `yarn build`
- `yarn create-local` # this is the right command as the urls are local to the server (when run from the server)
- `yarn deploy-local` # this is the right command as the urls are local to the server (when run from the server)


#### 3. RubyMasterChef
- `cd subgraphs/rubymasterchef`
- `yarn prepare:skaleTestnet`
- `yarn codegen`
- `yarn build`
- `yarn create-local` # this is the right command as the urls are local to the server (when run from the server)
- `yarn deploy-local` # this is the right command as the urls are local to the server (when run from the server)

## Notes

- All of the necessary contracts are deployed correctly to the Skale testchain and all of the addresses are set under `config/skaleTestnet.json`
- All of the constants are prepared for the Skale testnet deployment, so you don't need to run anything additionally
- If you stumble across an error that some of the subgraphs is already created, then skip the `yarn create-local` command, or run `yarn remove-local` and then `yarn create-local`.
