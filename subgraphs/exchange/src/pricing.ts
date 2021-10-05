import {
  ADDRESS_ZERO,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  WHITELIST,
  RUBY_USDT_PAIR_ADDRESS,
  WETH_STABLE_PAIRS,
  WETH_ADDRESS,
  USDT_ADDRESS,
  RUBY_TOKEN_ADDRESS,
  RUBY_EXCHANGE_START_BLOCK,
} from 'const'
import { Address, BigDecimal, ethereum, log } from '@graphprotocol/graph-ts'
import { Pair, Token } from '../generated/schema'

import { Factory as FactoryContract } from '../generated/Factory/Factory'

export const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)

/*
 * Base RUBY price using RUBY/WETH * WETH. 
 */
export function getRubyPrice(block: ethereum.Block = null): BigDecimal {
  const eth_rate = getEthRate(RUBY_TOKEN_ADDRESS)
  const eth_price = getEthPrice()
  const price = eth_rate.times(eth_price)
  return price
}

/*
 * RUBY price is the weighted average of RUBY/ETH * ETH and RUBY/USDT.
 *
 */
export function getWavgRubyPrice(block: ethereum.Block = null): BigDecimal {
  // get RUBY/USDT
  const usdt_pair = Pair.load(RUBY_USDT_PAIR_ADDRESS.toString())
  const usdt_price = usdt_pair
    ? usdt_pair.token0 == RUBY_TOKEN_ADDRESS.toHexString()
      ? usdt_pair.token1Price
      : usdt_pair.token0Price
    : BIG_DECIMAL_ZERO
  const usdt_weight = usdt_pair
    ? usdt_pair.token0 == RUBY_TOKEN_ADDRESS.toHexString()
      ? usdt_pair.reserve0
      : usdt_pair.reserve1
    : BIG_DECIMAL_ZERO

  // get RUBY/ETH
  const ruby_weth_address = factoryContract.getPair(RUBY_TOKEN_ADDRESS, WETH_ADDRESS)
  const eth_pair = Pair.load(ruby_weth_address.toString())
  const eth_rate = eth_pair
    ? eth_pair.token0 == RUBY_TOKEN_ADDRESS.toHexString()
      ? eth_pair.token1Price
      : eth_pair.token0Price
    : BIG_DECIMAL_ZERO
  const eth_weight = eth_pair
    ? eth_pair.token0 == RUBY_TOKEN_ADDRESS.toHexString()
      ? eth_pair.reserve0
      : eth_pair.reserve1
    : BIG_DECIMAL_ZERO
  const eth_price = eth_rate.times(getEthPrice())

  // weighted avg
  const sumprod = usdt_price.times(usdt_weight).plus(eth_price.times(eth_weight))
  const sumweights = usdt_weight.plus(eth_weight)
  const wavg = sumprod.div(sumweights)
  return wavg
}

/*
 * Bundle tracks the price of ETH, it is used to convert from ETH price to USD price.
 * Exchange subgraph only keeps 1 bundle; it is updated during factory sync() event.
 *
 * This is different from getEthRate which calculates ETH price for token, as it only
 * calculates price in USD for ETH.
 *
 * ETH price is calculated by getting weighted average of stable-coin pairs.
 *
 */
export function getEthPrice(block: ethereum.Block = null): BigDecimal {

  log.info("getEthPrice, block: {}", [block.number.toString()])
  log.info("num weth stable pairs: {}", [`${WETH_STABLE_PAIRS.length}`])
  
  let total_weight = BIG_DECIMAL_ZERO
  let sum_price = BIG_DECIMAL_ZERO

  for (let i = 0; i < WETH_STABLE_PAIRS.length; ++i) {
    const pair_address = WETH_STABLE_PAIRS[i]
    const pair = Pair.load(pair_address)
    const price = _getEthPrice(pair)
    const weight = _getEthReserve(pair)

    log.info("WETH STABLE PAIR: index {}, address: {}, price: {}, weight: {}", [i.toString(), pair_address.toString(), price.toString(), weight.toString()])

    total_weight = total_weight.plus(weight)
    sum_price = sum_price.plus(price.times(weight))
    log.info('getEthPrice, address: {}, price: {}, weight: {}', [pair_address, price.toString(), weight.toString()])
  }

  log.info("getEthPrice total: weight {}, price {}", [total_weight.toString(), sum_price.toString()])

  // div by 0
  const eth_price = total_weight.equals(BIG_DECIMAL_ZERO) ? BIG_DECIMAL_ZERO : sum_price.div(total_weight)

  return eth_price
}

// returns eth price given e.g. eth-usdt or eth-usdc pair
function _getEthPrice(pair: Pair | null): BigDecimal {
  if (pair == null) {
    return BIG_DECIMAL_ZERO
  }
  const eth = pair.token0 == WETH_ADDRESS.toHexString() ? pair.token1Price : pair.token0Price
  return eth
}

// returns eth reserves given e.g. eth-usdt or eth-usdc pair
function _getEthReserve(pair: Pair | null): BigDecimal {
  if (pair == null) {
    return BIG_DECIMAL_ZERO
  }
  const eth = pair.token0 == WETH_ADDRESS.toHexString() ? pair.reserve0 : pair.reserve1
  return eth
}

/*
 * Get price of token in Eth.
 * Loop through WHITELIST to get Eth/Token rate.
 */
export function getEthRate(address: Address): BigDecimal {
  if (address == WETH_ADDRESS) {
    return BIG_DECIMAL_ONE
  }
  // TODO: This is slow, and this function is called quite often.
  // What could we do to improve this?
  for (let i = 0; i < WHITELIST.length; ++i) {
    // TODO: Cont. This would be a good start, by avoiding multiple calls to getPair...
    const pairAddress = factoryContract.getPair(address, Address.fromString(WHITELIST[i]))

    if (pairAddress != ADDRESS_ZERO) {
      const pair = Pair.load(pairAddress.toHex())
      if (pair.token0 == address.toHexString()) {
        const token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * ETH per token 1
      }
      if (pair.token1 == address.toHexString()) {
        const token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }

  return BIG_DECIMAL_ZERO // nothing was found return 0
}

/*
 * Get price of token in USD.
 */
export function getUSDRate(address: Address, block: ethereum.Block = null): BigDecimal {
  if (address == USDT_ADDRESS) {
    return BIG_DECIMAL_ONE
  }

  const ethRate = getEthRate(address)
  const ethPrice = getEthPrice()

  return ethRate.times(ethPrice)
}