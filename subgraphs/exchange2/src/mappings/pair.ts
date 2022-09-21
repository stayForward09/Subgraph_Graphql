import { BIG_DECIMAL_ZERO, MINIMUM_USD_THRESHOLD_NEW_PAIRS, WHITELIST } from 'const'
import { Address, BigDecimal, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { Pair, Swap, Token, Transaction } from '../../generated/schema'
import {
  Swap as SwapEvent,
} from '../../generated/templates/Pair/Pair'
import {
  getBundle,
  getFactory,
  getPair,
  getToken,
  updateDayData,
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
} from '../enitites'

const BLACKLIST_EXCHANGE_VOLUME: string[] = [
  '0x9ea3b5b4ec044b70375236a281986106457b20ef', // DELTA
]

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  const bundle = getBundle()
  const price0 = token0.derivedETH.times(bundle.ethPrice)
  const price1 = token1.derivedETH.times(bundle.ethPrice)

  const network = dataSource.network()

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
    const reserve0USD = pair.reserve0.times(price0)
    const reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return BIG_DECIMAL_ZERO
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return BIG_DECIMAL_ZERO
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return BIG_DECIMAL_ZERO
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return BIG_DECIMAL_ZERO
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  const bundle = getBundle()
  const price0 = token0.derivedETH.times(bundle.ethPrice)
  const price1 = token1.derivedETH.times(bundle.ethPrice)

  const network = dataSource.network()

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return BIG_DECIMAL_ZERO
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == BigInt.fromI32(0)) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function onSwap(event: SwapEvent): void {
  log.info('onSwap', [])
  const pair = getPair(event.address, event.block)
  const token0 = getToken(Address.fromString(pair.token0))
  const token1 = getToken(Address.fromString(pair.token1))
  const amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
  const amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals)
  const amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals)
  const amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

  // totals for volume updates
  const amount0Total = amount0Out.plus(amount0In)
  const amount1Total = amount1Out.plus(amount1In)

  // ETH/USD prices
  const bundle = getBundle()

  // get total amounts of derived USD and ETH for tracking
  const derivedAmountETH = token1.derivedETH
    .times(amount1Total)
    .plus(token0.derivedETH.times(amount0Total))
    .div(BigDecimal.fromString('2'))
  const derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice)

  // only accounts for volume through white listed tokens
  const trackedAmountUSD = getTrackedVolumeUSD(
    amount0Total,
    token0 as Token,
    amount1Total,
    token1 as Token,
    pair as Pair
  )

  let trackedAmountETH: BigDecimal

  if (bundle.ethPrice.equals(BIG_DECIMAL_ZERO)) {
    trackedAmountETH = BIG_DECIMAL_ZERO
  } else {
    trackedAmountETH = trackedAmountUSD.div(bundle.ethPrice)
  }

  // update token0 global volume and token liquidity stats
  token0.volume = token0.volume.plus(amount0In.plus(amount0Out))
  token0.volumeUSD = token0.volumeUSD.plus(trackedAmountUSD)
  token0.untrackedVolumeUSD = token0.untrackedVolumeUSD.plus(derivedAmountUSD)

  // update token1 global volume and token liquidity stats
  token1.volume = token1.volume.plus(amount1In.plus(amount1Out))
  token1.volumeUSD = token1.volumeUSD.plus(trackedAmountUSD)
  token1.untrackedVolumeUSD = token1.untrackedVolumeUSD.plus(derivedAmountUSD)

  // update txn counts
  token0.txCount = token0.txCount.plus(BigInt.fromI32(1))
  token1.txCount = token1.txCount.plus(BigInt.fromI32(1))

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = pair.volumeUSD.plus(trackedAmountUSD)
  pair.volumeToken0 = pair.volumeToken0.plus(amount0Total)
  pair.volumeToken1 = pair.volumeToken1.plus(amount1Total)
  pair.untrackedVolumeUSD = pair.untrackedVolumeUSD.plus(derivedAmountUSD)
  pair.txCount = pair.txCount.plus(BigInt.fromI32(1))
  pair.save()

  // Don't track volume for these tokens in total exchange volume
  if (!BLACKLIST_EXCHANGE_VOLUME.includes(token0.id) && !BLACKLIST_EXCHANGE_VOLUME.includes(token1.id)) {
    // update global values, only used tracked amounts for volume
    const factory = getFactory()
    factory.volumeUSD = factory.volumeUSD.plus(trackedAmountUSD)
    factory.volumeETH = factory.volumeETH.plus(trackedAmountETH)
    factory.untrackedVolumeUSD = factory.untrackedVolumeUSD.plus(derivedAmountUSD)
    factory.txCount = factory.txCount.plus(BigInt.fromI32(1))
    factory.save()
  }

  // save entities
  pair.save()
  token0.save()
  token1.save()

  let transaction = Transaction.load(event.transaction.hash.toHex())

  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHex())
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.swaps = []
    transaction.burns = []
  }

  const swaps = transaction.swaps

  const swap = new Swap(event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(swaps.length).toString()))

  // update swap event
  swap.pair = pair.id
  swap.timestamp = transaction.timestamp
  swap.transaction = transaction.id
  swap.sender = event.params.sender
  swap.amount0In = amount0In
  swap.amount1In = amount1In
  swap.amount0Out = amount0Out
  swap.amount1Out = amount1Out
  swap.to = event.params.to
  swap.logIndex = event.logIndex
  // use the tracked amount if we have it
  swap.amountUSD = trackedAmountUSD == BIG_DECIMAL_ZERO ? derivedAmountUSD : trackedAmountUSD
  swap.save()

  // update the transaction
  transaction.swaps = transaction.swaps.concat([swap.id])

  transaction.save()

  const dayData = updateDayData(event)

  const pairDayData = updatePairDayData(event)
  const pairHourData = updatePairHourData(event)

  const token0DayData = updateTokenDayData(token0 as Token, event)
  const token1DayData = updateTokenDayData(token1 as Token, event)

  // Don't track volume for these tokens in total exchange volume
  if (!BLACKLIST_EXCHANGE_VOLUME.includes(token0.id) && !BLACKLIST_EXCHANGE_VOLUME.includes(token1.id)) {
    // swap specific updating
    dayData.volumeUSD = dayData.volumeUSD.plus(trackedAmountUSD)
    dayData.volumeETH = dayData.volumeETH.plus(trackedAmountETH)
    dayData.untrackedVolume = dayData.untrackedVolume.plus(derivedAmountUSD)
    dayData.save()
  }

  // swap specific updating for pair
  pairDayData.volumeToken0 = pairDayData.volumeToken0.plus(amount0Total)
  pairDayData.volumeToken1 = pairDayData.volumeToken1.plus(amount1Total)
  pairDayData.volumeUSD = pairDayData.volumeUSD.plus(trackedAmountUSD)
  pairDayData.save()

  // update hourly pair data
  pairHourData.volumeToken0 = pairHourData.volumeToken0.plus(amount0Total)
  pairHourData.volumeToken1 = pairHourData.volumeToken1.plus(amount1Total)
  pairHourData.volumeUSD = pairHourData.volumeUSD.plus(trackedAmountUSD)
  pairHourData.save()

  // swap specific updating for token0
  token0DayData.volume = token0DayData.volume.plus(amount0Total)
  token0DayData.volumeETH = token0DayData.volumeETH.plus(amount0Total.times(token1.derivedETH as BigDecimal))
  token0DayData.volumeUSD = token0DayData.volumeUSD.plus(
    amount0Total.times(token0.derivedETH as BigDecimal).times(bundle.ethPrice)
  )
  token0DayData.save()

  // swap specific updating
  token1DayData.volume = token1DayData.volume.plus(amount1Total)
  token1DayData.volumeETH = token1DayData.volumeETH.plus(amount1Total.times(token1.derivedETH as BigDecimal))
  token1DayData.volumeUSD = token1DayData.volumeUSD.plus(
    amount1Total.times(token1.derivedETH as BigDecimal).times(bundle.ethPrice)
  )
  token1DayData.save()
}
