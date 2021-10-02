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

export const MASTER_CHEF_START_BLOCK = BigInt.fromI32(10750000)

export const UNISWAP_RUBY_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromI32(10750005)

export const ACC_RUBY_PRECISION = BigInt.fromString('1000000000000')

export const BENTOBOX_DEPOSIT = 'deposit'

export const BENTOBOX_TRANSFER = 'transfer'

export const BENTOBOX_WITHDRAW = 'withdraw'

export const KASHI_PAIR_MEDIUM_RISK_TYPE = 'medium'

export const PAIR_ADD_COLLATERAL = 'addCollateral'

export const PAIR_REMOVE_COLLATERAL = 'removeCollateral'

export const PAIR_ADD_ASSET = 'addAsset'

export const PAIR_REMOVE_ASSET = 'removeAsset'

export const PAIR_BORROW = 'borrow'

export const PAIR_REPAY = 'repay'

export const FACTORY_ADDRESS = Address.fromString(
  '0xc35dadb65012ec5796536bd9864ed8773abc74c4'
)

export const RUBY_MASTER_CHEF_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)


export const RUBY_MINE_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const RUBY_DIGGER_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const RUBY_TOKEN_ADDRESS = Address.fromString(
  '0x39cf1bd5f15fb22ec3d9ff86b0727afc203427cc'
)

export const RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const XRUBY_USDC_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const XRUBY_WETH_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const RUBY_DISTRIBUTOR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const USDC_WETH_PAIR =
  '0x4ed65dab34d5fd4b1eb384432027ce47e90e1185'

export const DAI_WETH_PAIR =
  '0x55cf10bfbc6a9deaeb3c7ec0dd96d3c1179cb948'

export const USDT_WETH_PAIR =
  '0x09657b445df5bf0141e3ef0f5276a329fc01de01'

export const RUBY_USDT_PAIR =
  '0x0000000000000000000000000000000000000000'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString(
  '3000'
)

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('50')

export const WETH_ADDRESS = Address.fromString(
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab'
)

export const RUBY_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const USDT_ADDRESS = Address.fromString(
  '0xc7198437980c041c805a1edcba50c1ce5db95118'
)

export const UNISWAP_FACTORY_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_RUBY_ETH_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const UNISWAP_RUBY_USDT_PAIR_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)



export const NATIVE = Address.fromString(
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7'
)

export const USDC = '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664'

export const USDT = '0xc7198437980c041c805a1edcba50c1ce5db95118'

export const DAI = '0xd586e7f844cea2f87f50152665bcbc2c279d8d70'

export const WHITELIST: string[] = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7,0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab,0x50b7545627a5162f82a992c33b87adc75187b218,0xc7198437980c041c805a1edcba50c1ce5db95118,0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664,0xd586e7f844cea2f87f50152665bcbc2c279d8d70,0x37b608519f91f70f2eeb0e5ed9af4061722e4f76,0xb54f16fb19478766a268f172c9480f8da1a7c9c3,0x130966628846bfd36ff31a822705796e8cb8c18d'.split(',')

// export const WHITELIST: string[] = [
//   "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a",
//   "0x6983d1e6def3690c4d616b13597a09e6193ea013",
//   "0x3095c7557bcb296ccc6e363de01b760ba031f2d9",
//   "0x985458e523db3d53125813ed68c274899e9dfab4",
//   "0x3c2b8be99c50593081eaa2a724f0b8285f5aba8f",
//   "0xe176ebe47d621b984a73036b9da5d834411ef734",
// ]

// export const WHITELIST: string[] = [
//   "0x471ece3750da237f93b8e339c536989b8978a438",
//   "0xd629eb00deced2a080b7ec630ef6ac117e614f1b",
//   "0x765de816845861e75a25fca122bb6898b8b1282a",
//   "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73"
// ];

const CUSTOM_BASES = new Map<string, string>()
