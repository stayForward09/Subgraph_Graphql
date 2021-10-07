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
  '0x605C0c28e61d027314791Bbdc8F7A0A2FaaA66e4'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '602693'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x24EbCCc52300e19bf99575840CA4aD3f64Cfd219'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '602693'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x1b1Bd64d00b7e54e90Eb96D8233B32DD6eF690a1'
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
  '0x485E45ACd41f9764EAf4Df7e2D7DC00f0667B068'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0D400c840c2F85f91847EF518f9F9a02f16d8DF1'
)

export const RUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0x96f6C3CBA18c27907071062aA9Cb6438a21Cf83d'
)


export const WETH_ADDRESS = Address.fromString(
  '0x2f5c0B8DF7f15dbEF9dEbeb20cf2916Cbff022Bf'
)

export const USDT_ADDRESS = Address.fromString(
  '0xC30cE3E3616e90dA0459Fc2e84636A6e2974aE31'
)


export const USDC_ADDRESS = Address.fromString(
  '0x370eFEEa88927fe4532C6cC16193f41c9917fb20'
)


export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = '0x485e45acd41f9764eaf4df7e2d7dc00f0667b068,0x6816475f9ddc982d5f84e9aaec725c167617e2fe'.split(',')
export const WHITELIST: string[] = '0x2f5c0b8df7f15dbef9debeb20cf2916cbff022bf,0xc30ce3e3616e90da0459fc2e84636a6e2974ae31,0x370efeea88927fe4532c6cc16193f41c9917fb20'.split(',')


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

