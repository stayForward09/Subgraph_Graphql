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
  '0x616A779E70D4FbD1b53f60eB12c5377a5b451A9a'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '632886'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x2D76E3E55bB9E573af26043fb0c76cbbfAC95a2c'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '632915'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x2090EbdE28485c67D4Fe69c47740d91144A14203'
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
  '0x3ea1892c000B9932AfCDa2c584061B6811e98576'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x1a3A8d08E6aB39Fe76B0b24741f619264B8Acb89'
)

export const RUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0x98a211F97e7D99017C50b343CaeF7aa3AA49cFCC'
)


export const WETH_ADDRESS = Address.fromString(
  '0xf6dFABa1C203f403D6e1116d246e3139654C315E'
)

export const USDT_ADDRESS = Address.fromString(
  '0x88A4cAD35B4d8acf8c5FdFA082079592E5d24eb2'
)


export const USDC_ADDRESS = Address.fromString(
  '0xD4Ff3876DaBEA93Eef3Dffb5660E746Ac7f3bDBf'
)


export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = ['0x44343e87c42b55a99f866d971eb47736fb7cbb18', '0x3ea1892c000b9932afcda2c584061b6811e98576']
export const WHITELIST: string[] = ['0xf6dfaba1c203f403d6e1116d246e3139654c315e', '0xd4ff3876dabea93eef3dffb5660e746ac7f3bdbf', '0x88a4cad35b4d8acf8c5fdfa082079592e5d24eb2']


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

