import { getFactory, getPair } from '../enitites'

import { BIG_INT_ONE } from 'const'
import { PairCreated } from '../../generated/Factory/Factory'
import { Pair as PairTemplate } from '../../generated/templates'

import { log } from '@graphprotocol/graph-ts'

export function onPairCreated(event: PairCreated): void {

  log.info('Pair params: pair {}, block {}, token0 {}, token1 {}', 
  [event.params.pair.toHex(), event.block.number.toString(), event.params.token0.toHex(), event.params.token1.toHex() ])

  const factory = getFactory()

  log.info('PairCreated: Factory obtained {}', [factory.id])

  const pair = getPair(event.params.pair, event.block, event.params.token0, event.params.token1)

  // We returned null for some reason, we should silently bail without creating this pair
  if (!pair) {
    log.warning('PairCreated: Pair not obtained successfully', [])
    return
  }

  log.info('PairCreated: Pair obtained successfully, id: {}', [pair.id.toString()])


  // Now it's safe to save
  pair.save()

  // create the tracked contract based on the template
  PairTemplate.create(event.params.pair)

  // Update pair count once we've sucessesfully created a pair
  factory.pairCount = factory.pairCount.plus(BIG_INT_ONE)
  factory.save()

  log.info('PairCreated: Factory saved, ID: {}', [factory.id.toString()])

}
