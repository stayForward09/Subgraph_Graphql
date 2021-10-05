import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_TWO = BigInt.fromI32(2)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29)

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)


// EXCHANGE
export const FACTORY_ADDRESS = Address.fromString(
  '0x5FbDB2315678afecb367f032d93F642f64180aa3'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '1'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '1'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE'
)

// MINE (BAR)
export const RUBY_MINE_ADDRESS = Address.fromString(
  '0x1be211d8da40bc0ae8719c6663307bfc987b1d6c'
)

// DIGGER (MAKER)
export const RUBY_DIGGER_ADDRESS = Address.fromString(
  '0x1b9d177ccdea3c79b6c8f40761fc8dc9d0500eaa'
)

// PRICING

export const RUBY_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0xf2863c6589b79c099d1174406f4b93c157565c39'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0xcD94A26c2173bB5D3fd425550CC75d729B70A06a'
)

export const RUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0x159345F18cD4C9B6534a3BA4Df462fDc69d1F920'
)


export const WETH_ADDRESS = Address.fromString(
  '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
)

export const USDT_ADDRESS = Address.fromString(
  '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9'
)


export const USDC_ADDRESS = Address.fromString(
  '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9'
)


export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = '0x1bb0cb8447b7482cdb1682cbb28a0ceaf71fd865,0xf2863c6589b79c099d1174406f4b93c157565c39'.split(',')
export const WHITELIST: string[] = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512,0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9,0xdc64a140aa3e981100a9beca4e685f962f0cf6c9'.split(',')


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

