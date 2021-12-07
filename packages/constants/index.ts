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
  '0x622311A7E32f3dD209C86f5Fe522BcEdbbAbFB8c'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '882170'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0xF97048222D434e7A1a83e57462a3B0aaB626313d'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '1074294'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0xfedf2A1FA757EdD14642Bf3EB186d35e8B44bf52'
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

export const RUBY_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x2b7cd677ccb6e5d03179f582737b8d0ab743615f'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x1a3A8d08E6aB39Fe76B0b24741f619264B8Acb89'
)

export const RUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0xdfe344a7650da6007933d472d1639250ece58594'
)


export const WETH_ADDRESS = Address.fromString(
  '0xD2Aaa00700000000000000000000000000000000'
)

export const USDT_ADDRESS = Address.fromString(
  '0x6d90ab0bb745b9a6cf8a7989f9fb38bb7efc464d'
)


export const USDC_ADDRESS = Address.fromString(
  '0x95bded8476bce6de791224d2663fb9259778c80c'
)


export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = '0x13c4398bb59f7ce12fd58a2ae307e8ca08fb51d5,0x82d747306cfbec02989aa608bf5fe7145dcf2e47,0xa443b6204946b929147cebf79482c8a1d6b01117'.split(',')
export const WHITELIST: string[] = '0xD2Aaa00700000000000000000000000000000000,0x6d90ab0bb745b9a6cf8a7989f9fb38bb7efc464d,0x95bded8476bce6de791224d2663fb9259778c80c,0xda5e2ee40de7b265c28b2028e6e1e568fa4cf66e'.split(',')


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

