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
  '0x13f323840a96A7541B868E6F7093E7643b1aa29A'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '33670'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x83B38f79cFFB47CF74f7eC8a5F8D7DD69349fBf7'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '33794'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0xf5E880E1066DDc90471B9BAE6f183D5344fd289F'
)


// MAKER
export const RUBY_MAKER_ADDRESS = Address.fromString(
  '0xa388F9783d8E5B0502548061c3b06bf4300Fc0E1'
)

// PRICING

export const RUBY_WETH_USDP_PAIR_ADDRESS = Address.fromString(
  '0x29a4f9d3503b7ba5fb8b073e7adf1e9e62a7555c'
)


export const RUBY_USDP_PAIR_ADDRESS = Address.fromString(
  '0xc1d7e1043ddca3d46c67d84238560dd98bae89ca'
)


export const WETH_ADDRESS = Address.fromString(
  '0xD2Aaa00700000000000000000000000000000000'
)

export const USDT_ADDRESS = Address.fromString(
  '0x6fafe9419e37d20a402a6bb942808a20a5a19972'
)


export const USDC_ADDRESS = Address.fromString(
  '0x2fc800cf8c219dd07866f883f8f25a346f92d07b'
)

export const USDP_ADDRESS = Address.fromString(
  '0x76a3ef01506eb19d6b34c4bdcf3cdcde14f6b11e'
)

export const DAI_ADDRESS = Address.fromString(
  '0x4c45a6f9bb79977ef655b4147c14f9f40424ef00'
)
export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = ['0x29a4f9d3503b7ba5fb8b073e7adf1e9e62a7555c']
export const WHITELIST: string[] = ['0xD2Aaa00700000000000000000000000000000000', '0x6fafe9419e37d20a402a6bb942808a20a5a19972' ,'0x2fc800cf8c219dd07866f883f8f25a346f92d07b' ,'0x76a3ef01506eb19d6b34c4bdcf3cdcde14f6b11e', '0x4c45a6f9bb79977ef655b4147c14f9f40424ef00']


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

