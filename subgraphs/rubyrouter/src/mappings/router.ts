import { Swap as SwapEvent } from '../../generated/Router/Router'

import { BigInt, log } from '@graphprotocol/graph-ts'
import { getToken } from '../entities'
import { Transaction, Swap } from '../../generated/schema'
import { convertTokenToDecimal } from '../utils'

export function onSwap(event: SwapEvent): void {
  log.info('[onRubySwap] token0: {}, token1: {}', [event.params.token0.toHex(), event.params.token1.toHex()])

  const token0 = getToken(event.params.token0)
  log.info('[onRubySwap] token0 name: {}, symbol: {}', [token0.name, token0.symbol])

  const token1 = getToken(event.params.token1)
  log.info('[onRubySwap] token1 name: {}, symbol: {}', [token1.name, token1.symbol])

  const amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
  const amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

  let transaction = Transaction.load(event.transaction.hash.toHex())

  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHex())
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.swaps = []
  }

  const swap = new Swap(event.transaction.hash.toHex().concat('-').concat(BigInt.fromI32(transaction.swaps.length).toString()))
  swap.sender = event.params.sender
  swap.amount0In = amount0In
  swap.amount1Out = amount1Out
  swap.token0 = token0.id
  swap.token1 = token1.id
  swap.to = event.params.to
  swap.logIndex = event.logIndex

  swap.save()
  
  // update the transaction
  transaction.swaps = transaction.swaps.concat([swap.id])

  transaction.save()

  log.info('[onRubySwap] new swap event saved', [])
}
