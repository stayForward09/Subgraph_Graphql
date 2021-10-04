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
  '1000'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '1'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
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
  '0x1Bb0cb8447B7482CDB1682cBb28A0Ceaf71fd865'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x159345F18cD4C9B6534a3BA4Df462fDc69d1F920'
)

export const RUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0xcD94A26c2173bB5D3fd425550CC75d729B70A06a'
)


export const WETH_ADDRESS = Address.fromString(
  '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
)

export const USDT_ADDRESS = Address.fromString(
  '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'
)


export const USDC_ADDRESS = Address.fromString(
  '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
)


export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const WETH_STABLE_PAIRS: string[] = '0x1Bb0cb8447B7482CDB1682cBb28A0Ceaf71fd865,0xf2863c6589b79C099D1174406f4b93C157565c39'.split(',')
export const WHITELIST: string[] = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512,0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9,0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'.split(',')


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

