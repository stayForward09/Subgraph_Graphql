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
  '{{ factory_address }}{{^factory_address}}0x0000000000000000000000000000000000000000{{/factory_address}}'
)

export const RUBY_EXCHANGE_START_BLOCK = BigInt.fromString(
  '{{ minimum_liquidity_threshold_eth }}'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '{{ ruby_address }}{{^ruby_address}}0x0000000000000000000000000000000000000000{{/ruby_address}}'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '{{ ruby_master_chef_start_block }}'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '{{ ruby_master_chef_address }}{{^ruby_master_chef_address}}0x0000000000000000000000000000000000000000{{/ruby_master_chef_address}}'
)

// MINE (BAR)
export const RUBY_MINE_ADDRESS = Address.fromString(
  '{{ ruby_mine_address }}{{^ruby_mine_address}}0x0000000000000000000000000000000000000000{{/ruby_mine_address}}'
)

// DIGGER (MAKER)
export const RUBY_DIGGER_ADDRESS = Address.fromString(
  '{{ ruby_digger_address }}{{^ruby_digger_address}}0x0000000000000000000000000000000000000000{{/ruby_digger_address}}'
)

// PRICING

export const RUBY_CETH_USDT_PAIR_ADDRESS = Address.fromString(
  '{{ ruby_ceth_usdt_pair_address }}{{^ruby_ceth_usdt_pair_address}}0x0000000000000000000000000000000000000000{{/ruby_ceth_usdt_pair_address}}'
)


export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '{{ ruby_usdt_pair_address }}{{^ruby_usdt_pair_address}}0x0000000000000000000000000000000000000000{{/ruby_usdt_pair_address}}'
)

export const CETH_ADDRESS = Address.fromString(
  '{{ ceth_address }}{{^weth_address}}0x0000000000000000000000000000000000000000{{/ceth_address}}'
)

export const USDT_ADDRESS = Address.fromString(
  '{{ usdt_address }}{{^usdt_address}}0x0000000000000000000000000000000000000000{{/usdt_address}}'
)


export const USDC_ADDRESS = Address.fromString(
  '{{ usdc_address }}{{^usdc_address}}0x0000000000000000000000000000000000000000{{/usdc_address}}'
)


export const WBTC_ADDRESS = Address.fromString(
  '{{ wbtc_address }}{{^wbtc_address}}0x0000000000000000000000000000000000000000{{/wbtc_address}}'
)

export const CETH_STABLE_PAIRS: string[] = '{{ ceth_stable_pairs }}'.split(',')
export const WHITELIST: string[] = '{{ whitelist }}'.split(',')


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '{{ minimum_usd_threshold_new_pairs }}{{^minimum_usd_threshold_new_pairs}}0{{/minimum_usd_threshold_new_pairs}}'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('{{ minimum_liquidity_threshold_eth }}')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

