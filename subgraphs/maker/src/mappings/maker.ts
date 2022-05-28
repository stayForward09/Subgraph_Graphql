import { Address, log } from '@graphprotocol/graph-ts'
import { FACTORY_ADDRESS, BIG_DECIMAL_ONE } from 'const'
import { getMaker, getServer } from '../entities'
import { Serving } from '../../generated/schema'
import { Factory as FactoryContract } from '../../generated/RubyMaker/Factory'
import { Convert, BurnPercentSet } from '../../generated/RubyMaker/RubyMaker'


export function handleLogConvert(event: Convert): void {
  log.info('[RubyMaker] Log Convert {} {} {} {} {} {} {}', [
    event.params.server.toHex(),
    event.params.token0.toHex(),
    event.params.token1.toHex(),
    event.params.amount0.toString(),
    event.params.amount1.toString(),
    event.params.amountRubyDistributed.toString(),
    event.params.amountRubyBurned.toString()
  ])

  const maker = getMaker(event.block)
  const server = getServer(event.params.server, event.block)

  const factoryContract = FactoryContract.bind(FACTORY_ADDRESS)
  const pair = factoryContract.getPair(event.params.token0, event.params.token1)

  const id = pair.toHex().concat('-').concat(event.block.number.toString())
  let serving = new Serving(id)

  serving.maker = maker.id
  serving.server = server.id
  serving.tx = event.transaction.hash
  serving.token0 = event.params.token0
  serving.token1 = event.params.token1
  serving.amount0 = event.params.amount0
  serving.amount1 = event.params.amount1
  serving.rubyServed = event.params.amountRubyDistributed
  serving.rubyBurned = event.params.amountRubyBurned
  serving.block = event.block.number
  serving.timestamp = event.block.timestamp
  serving.save()

  maker.rubyServed = maker.rubyServed.plus(event.params.amountRubyDistributed)
  maker.rubyBurned = maker.rubyBurned.plus(event.params.amountRubyBurned)
  maker.totalServings = maker.totalServings.plus(BIG_DECIMAL_ONE)
  maker.save()

  server.rubyServed = server.rubyServed.plus(event.params.amountRubyDistributed)
  server.rubyBurned = server.rubyBurned.plus(event.params.amountRubyBurned)
  server.totalServings = server.totalServings.plus(BIG_DECIMAL_ONE)
  server.save()
}

export function handleBurnPercentChange(event: BurnPercentSet): void {
  log.info('[RubyMaker] Burn percent change {}', [
    event.params.newBurnPercent.toString()
  ])
  const maker = getMaker(event.block)

  maker.burnPercent = event.params.newBurnPercent
  maker.save()
}
