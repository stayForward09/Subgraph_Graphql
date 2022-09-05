import { Staked, Withdrawal } from '../generated/Staker/Staker'
import { Stake } from '../generated/schema'

import { log } from '@graphprotocol/graph-ts'
  
import { BIG_DECIMAL_1E18 } from 'const'

export function onStake(event: Staked): void {  
  log.info('{} has staked {} ruby', [
    event.params.user.toHex(),
    event.params.amount.toString()
  ])

  let staked = new Stake(event.transaction.hash.toHex())

  staked.address = event.params.user
  staked.amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)
  staked.stake = true
  staked.timestamp = event.block.timestamp

  staked.save()
}

export function onWithdraw(event: Withdrawal): void {  
  log.info('{} has withdrawed {} ruby', [
    event.params.user.toHex(),
    event.params.amount.toString()
  ])

  let staked = new Stake(event.transaction.hash.toHex())

  staked.address = event.params.user
  staked.amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)
  staked.stake = false
  staked.timestamp = event.block.timestamp

  staked.save()
}