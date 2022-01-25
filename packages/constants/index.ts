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
  '0x16094F5E00e8bcA67e6a015A426c618ecCa5109d'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '1466893'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x58F2b35dde559F49B9870Ec101c3b1B8433C644d'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '1467863'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x89b120E52e52C9Ea4dA4598D0473ba1135e59c81'
)


// MAKER
export const RUBY_MAKER_ADDRESS = Address.fromString(
  '0x0fb5fB07A05C69a88926E25f285c41eDf8d694D5'
)

// PRICING
export const RUBY_WETH_USDP_PAIR_ADDRESS = Address.fromString(
  '0xa72e33579b87850e62f04e5d10b9c3a10b25f4df'
)


export const RUBY_USDP_PAIR_ADDRESS = Address.fromString(
  '0xd126dd75740e3b191541d27348f75fd9407ef956'
)


export const WETH_ADDRESS = Address.fromString(
  '0xD2Aaa00700000000000000000000000000000000'
)

export const USDT_ADDRESS = Address.fromString(
  '0x9dbfccd94c26cd219b60754215abcc32c26f41c2'
)


export const USDC_ADDRESS = Address.fromString(
  '0x788c12145e5e15717020095172d3471fd6c0569f'
)

export const USDP_ADDRESS = Address.fromString(
  '0x0eb4a542fccbe6c985eaa08e7a5de0f27cb50938'
)

export const DAI_ADDRESS = Address.fromString(
  '0x059fc87c315c659bc11b0f7f524d20413a4a0fac'
)
export const WBTC_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

// IMPORTANT NOTE: Always make sure this addresses are set to lowercase in the config files. They are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = ['0xa72e33579b87850e62f04e5d10b9c3a10b25f4df']
export const WHITELIST: string[] = ['0xD2Aaa00700000000000000000000000000000000', '0x9dbfccd94c26cd219b60754215abcc32c26f41c2', '0x788c12145e5e15717020095172d3471fd6c0569f', '0x0eb4a542fccbe6c985eaa08e7a5de0f27cb50938', '0x059fc87c315c659bc11b0f7f524d20413a4a0fac']


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('1000')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

