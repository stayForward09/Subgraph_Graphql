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
  '0xc35dadb65012ec5796536bd9864ed8773abc74c4'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromI32(1)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x39cf1bd5f15fb22ec3d9ff86b0727afc203427cc'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromI32(1)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)


// MINE (BAR)
export const RUBY_MINE_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// DIGGER (MAKER)
export const RUBY_DIGGER_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// PRICING
export const RUBY_CETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)
export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const CETH_ADDRESS = Address.fromString(
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab'
)
export const USDT_ADDRESS = Address.fromString(
  '0xc7198437980c041c805a1edcba50c1ce5db95118'
)

export const USDC_ADDRESS = Address.fromString(
  '0xc7198437980c041c805a1edcba50c1ce5db95118'
)

export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const CETH_STABLE_PAIRS: string[] = [
  '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256', // CETH-USDT
  '0x87dee1cc9ffd464b79e058ba20387c1984aed86a',  // CETH-USDC
]

export const WHITELIST: string[] = [
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // CETH
  '0x50b7545627a5162f82a992c33b87adc75187b218', // WBTC
  '0xc7198437980c041c805a1edcba50c1ce5db95118', // USDT
  '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI
  '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // USDC
]

// MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '0'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')
