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
  '{{ ruby_exchange_start_block }}'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '{{ ruby_token_address }}{{^ruby_token_address}}0x0000000000000000000000000000000000000000{{/ruby_token_address}}'
)

// MASTER CHEF
export const RUBY_MASTER_CHEF_START_BLOCK = BigInt.fromString(
  '{{ ruby_master_chef_start_block }}'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '{{ ruby_master_chef_address }}{{^ruby_master_chef_address}}0x0000000000000000000000000000000000000000{{/ruby_master_chef_address}}'
)


// MAKER
export const RUBY_MAKER_ADDRESS = Address.fromString(
  '{{ ruby_maker_address }}{{^ruby_maker_address}}0x0000000000000000000000000000000000000000{{/ruby_maker_address}}'
)

// PRICING

export const RUBY_WETH_USDP_PAIR_ADDRESS = Address.fromString(
  '{{ ruby_weth_usdp_pair_address }}{{^ruby_weth_usdp_pair_address}}0x0000000000000000000000000000000000000000{{/ruby_weth_usdp_pair_address}}'
)


export const RUBY_USDP_PAIR_ADDRESS = Address.fromString(
  '{{ ruby_usdp_pair_address }}{{^ruby_usdp_pair_address}}0x0000000000000000000000000000000000000000{{/ruby_usdp_pair_address}}'
)


export const WETH_ADDRESS = Address.fromString(
  '{{ weth_address }}{{^weth_address}}0x0000000000000000000000000000000000000000{{/weth_address}}'
)

export const USDT_ADDRESS = Address.fromString(
  '{{ usdt_address }}{{^usdt_address}}0x0000000000000000000000000000000000000000{{/usdt_address}}'
)


export const USDC_ADDRESS = Address.fromString(
  '{{ usdc_address }}{{^usdc_address}}0x0000000000000000000000000000000000000000{{/usdc_address}}'
)

export const USDP_ADDRESS = Address.fromString(
  '{{ usdp_address }}{{^usdp_address}}0x0000000000000000000000000000000000000000{{/usdp_address}}'
)

export const DAI_ADDRESS = Address.fromString(
  '{{ dai_address }}{{^dai_address}}0x0000000000000000000000000000000000000000{{/dai_address}}'
)
export const WBTC_ADDRESS = Address.fromString(
  '{{ wbtc_address }}{{^wbtc_address}}0x0000000000000000000000000000000000000000{{/wbtc_address}}'
)

// IMPORTANT NOTE: Addresses are set to lowercase and stripped because they are compared as strings and not as entities of type Address in the indexing files
export const WETH_STABLE_PAIRS: string[] = [{{#weth_stable_pairs}}'{{.}}',{{/weth_stable_pairs}}]
export const WHITELIST: string[] = [{{#whitelist}}'{{.}}',{{/whitelist}}]


//MISC

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '{{ minimum_usd_threshold_new_pairs }}{{^minimum_usd_threshold_new_pairs}}0{{/minimum_usd_threshold_new_pairs}}'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('{{ minimum_liquidity_threshold_eth }}')


export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')
