import { Staked, Withdrawal, ExpiredLocksWithdrawal, RewardPaid } from '../generated/Staker/Staker'
import { Stake } from '../generated/schema'

import { log } from '@graphprotocol/graph-ts'
  
import { BIG_DECIMAL_1E18, ADDRESS_ZERO } from 'const'

export function onStake(event: Staked): void {  
  log.info('{} has staked {} ruby', [
    event.params.user.toHex(),
    event.params.amount.toString()
  ])

  let staked = new Stake(event.transaction.hash.toHex())

  staked.address = event.params.user
  staked.amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)
  staked.type = 'Staked'
  staked.rewardToken = ADDRESS_ZERO
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
  staked.type = 'Withdrawal'
  staked.rewardToken = ADDRESS_ZERO
  staked.timestamp = event.block.timestamp

  staked.save()
}

export function onExpiredLocksWithdrawal(event: ExpiredLocksWithdrawal): void {  
  log.info('{} has withdrawed {} ruby', [
    event.params.user.toHex(),
    event.params.amount.toString()
  ])

  let staked = new Stake(event.transaction.hash.toHex())

  staked.address = event.params.user
  staked.amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)
  staked.type = 'ExpiredLocksWithdrawal'
  staked.rewardToken = ADDRESS_ZERO
  staked.timestamp = event.block.timestamp

  staked.save()
}

export function onRewardPaid(event: RewardPaid): void {  
  log.info('{} has withdrawed {} ruby', [
    event.params.user.toHex(),
    event.params.reward.toString()
  ])

  let staked = new Stake(event.transaction.hash.toHex())

  staked.address = event.params.user
  staked.amount = event.params.reward.toBigDecimal()
  staked.type = 'RewardPaid'
  staked.rewardToken = event.params.rewardToken
  staked.timestamp = event.block.timestamp

  staked.save()
}