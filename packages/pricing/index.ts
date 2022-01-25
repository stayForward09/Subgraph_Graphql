import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  FACTORY_ADDRESS,
  RUBY_USDP_PAIR_ADDRESS,
  RUBY_WETH_USDP_PAIR_ADDRESS,
  USDP_ADDRESS,
  WETH_ADDRESS,
  RUBY_EXCHANGE_START_BLOCK
  
} from "const";
import {
  Address,
  BigDecimal,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import { Factory as FactoryContract } from "exchange/generated/Factory/Factory";
import { Pair as PairContract } from "exchange/generated/Factory/Pair";

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {

  if(token == USDP_ADDRESS) {
      return BIG_DECIMAL_ONE
  }

  // TODO: We should use different price oracle for the USD rates before RUBY launch, otherwise the subgraph
  // should not be reliable for data before RUBY launch
  if(block.number.le(RUBY_EXCHANGE_START_BLOCK)) {
    return BIG_DECIMAL_ZERO
  }

  let address = RUBY_WETH_USDP_PAIR_ADDRESS

  const tokenPriceETH = getEthRate(token, block)
  log.info("Token price eth, token: {}, tokenPriceETH: {}", [token.toHex(), tokenPriceETH.toString()])

  const pair = PairContract.bind(address)

  const reservesResult = pair.try_getReserves()
  if (reservesResult.reverted) {
    log.info('[getUSDRate] getReserves reverted', [])
    return BIG_DECIMAL_ZERO
  }
  const reserves = reservesResult.value

  const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)

  const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

  const ethPriceUSD = reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)

  log.info("Eth price USD: {}", [ethPriceUSD.toString()])


  return ethPriceUSD.times(tokenPriceETH)
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  if (token == WETH_ADDRESS) {
    return BIG_DECIMAL_ONE
  }

  // TODO: add fallback oracle, for before ruby start
  if (block.number.le(RUBY_EXCHANGE_START_BLOCK)) {
    return BIG_DECIMAL_ZERO
  }
  const factory = FactoryContract.bind(FACTORY_ADDRESS)

  const address = factory.getPair(token, WETH_ADDRESS)

  if (address == ADDRESS_ZERO) {
    log.info('Address ZERO...', [])
    return BIG_DECIMAL_ZERO
  }

  const pair = PairContract.bind(address)

  const reservesResult = pair.try_getReserves()
  if (reservesResult.reverted) {
    log.info('[getEthRate] getReserves reverted', [])
    return BIG_DECIMAL_ZERO
  }
  const reserves = reservesResult.value

  // avoid div by 0
  if (reserves.value0.equals(BIG_INT_ZERO) || reserves.value1.equals(BIG_INT_ZERO)) {
    return BIG_DECIMAL_ZERO
  }

  let eth =
    pair.token0() == WETH_ADDRESS
      ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
      : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

  return eth.div(BIG_DECIMAL_1E18)
}

export function getRubyPrice(block: ethereum.Block): BigDecimal {
  if (block.number.lt(RUBY_EXCHANGE_START_BLOCK)) {
    return BIG_DECIMAL_ZERO
  }

  const pair = PairContract.bind(RUBY_USDP_PAIR_ADDRESS)

  const reservesResult = pair.try_getReserves()
  if (reservesResult.reverted) {
    log.info('[getRubyPrice] getReserves reverted', [])
    return BIG_DECIMAL_ZERO
  }
  const reserves = reservesResult.value
  if (reserves.value0.toBigDecimal().equals(BigDecimal.fromString('0'))) {
    log.error('[getRubyPrice] usdp reserve 0', [])
    return BIG_DECIMAL_ZERO
  }
  const result = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)


  log.info("Ruby Price: {}", [result.toString()])

  return result
}
