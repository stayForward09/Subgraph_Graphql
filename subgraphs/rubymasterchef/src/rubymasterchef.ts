import {
  Add,
  Set,
  Deposit,
  SetTreasuryAddress,
  SetTreasuryPercent,
  EmergencyWithdraw,
  RubyMasterChef as RubyMasterChefContract,
  OwnershipTransferred,
  Withdraw,
  UpdateEmissionRate,
} from '../generated/RubyMasterChef/RubyMasterChef'

import { ERC20 as ERC20Contract } from '../generated/RubyMasterChef/ERC20'
import { Pair as PairContract } from '../generated/RubyMasterChef/Pair'
import {
  Rewarder as RewarderContract
} from '../generated/RubyMasterChef/Rewarder'

import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  RUBY_MASTER_CHEF_ADDRESS,
  RUBY_MASTER_CHEF_START_BLOCK,
  ADDRESS_ZERO
} from 'const'

import { History, RubyMasterChef, Pool, PoolHistory, User, Rewarder } from '../generated/schema'
import { getRubyPrice, getUSDRate } from 'pricing'

function getOrInsertMasterChef(block: ethereum.Block): RubyMasterChef {
  let masterChef = RubyMasterChef.load(RUBY_MASTER_CHEF_ADDRESS.toHex())

  if (masterChef === null) {
    const contract = RubyMasterChefContract.bind(RUBY_MASTER_CHEF_ADDRESS)
    masterChef = new RubyMasterChef(RUBY_MASTER_CHEF_ADDRESS.toHex())
    masterChef.rubyPerSec = contract.rubyPerSec()
    masterChef.treasuryAddr = contract.treasuryAddr()
    masterChef.treasuryPercent = contract.treasuryPercent()
    masterChef.owner = contract.owner()
    // poolInfo ...
    masterChef.startTimestamp = contract.startTimestamp()
    masterChef.ruby = contract.RUBY()
    masterChef.rubyPerSec = contract.rubyPerSec()
    masterChef.totalAllocPoint = contract.totalAllocPoint()
    // userInfo ...
    masterChef.poolCount = BIG_INT_ZERO

    masterChef.rlpBalance = BIG_DECIMAL_ZERO
    masterChef.rlpAge = BIG_DECIMAL_ZERO
    masterChef.rlpAgeRemoved = BIG_DECIMAL_ZERO
    masterChef.rlpDeposited = BIG_DECIMAL_ZERO
    masterChef.rlpWithdrawn = BIG_DECIMAL_ZERO

    masterChef.updatedAt = block.timestamp

    masterChef.save()
  }

  return masterChef as RubyMasterChef
}


export function getOrInsertRewarder(rewarderAddress: Address, block: ethereum.Block ): Rewarder {

  log.info("Getting or inserting rewarder, address: {}", [rewarderAddress.toHex()])

  if(rewarderAddress == ADDRESS_ZERO) {
    return null
  }

  let idHex = rewarderAddress.toHex()
  let rewarder = Rewarder.load(idHex)

  const rewarderContract = RewarderContract.bind(rewarderAddress)
  const rewardTokenAddress = rewarderContract.rewardToken();
  const rewardTokenContract =  ERC20Contract.bind(rewardTokenAddress)
  

  if(rewarder === null) {
    rewarder = new Rewarder(idHex)
    rewarder.rewardToken = rewardTokenAddress
    rewarder.name = rewardTokenContract.name()
    rewarder.symbol = rewardTokenContract.symbol()
    rewarder.decimals = rewardTokenContract.decimals()
  }

  // update rewarder endTimestamp and tokenPerSec on each obtaining
  rewarder.tokenPerSec = rewarderContract.tokenPerSec()
  const rewarderBalance = rewardTokenContract.balanceOf(rewarderAddress);
  const currentTimestamp = block.timestamp;

  const numSeconds = rewarderBalance.div(rewarder.tokenPerSec);

  rewarder.endTimestamp = currentTimestamp.plus(numSeconds);

  rewarder.save()

  return rewarder as Rewarder
}


export function getOrInsertPool(id: BigInt, block: ethereum.Block): Pool {
  let pool = Pool.load(id.toString())

  log.info("Getting or inserting pool, id: {}", [id.toString()])

  if (pool === null) {
    const masterChef = getOrInsertMasterChef(block)

    const masterChefContract = RubyMasterChefContract.bind(RUBY_MASTER_CHEF_ADDRESS)
    const poolLength = masterChefContract.poolLength()

    if (id >= poolLength) {
      return null
    }

    // Create new pool.
    pool = new Pool(id.toString())

    // Set relation
    pool.owner = masterChef.id

    const poolInfo = masterChefContract.poolInfo(masterChef.poolCount)

    pool.pair = poolInfo.value0
    pool.allocPoint = poolInfo.value1
    pool.lastRewardTimestamp = poolInfo.value2
    pool.accRubyPerShare = poolInfo.value3
    const rewarder = getOrInsertRewarder(poolInfo.value4, block)
    if(rewarder !== null ) {
      pool.rewarder = rewarder.id
    }

    // Total supply of LP tokens
    pool.balance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO

    pool.rlpBalance = BIG_DECIMAL_ZERO
    pool.rlpAge = BIG_DECIMAL_ZERO
    pool.rlpAgeRemoved = BIG_DECIMAL_ZERO
    pool.rlpDeposited = BIG_DECIMAL_ZERO
    pool.rlpWithdrawn = BIG_DECIMAL_ZERO

    pool.timestamp = block.timestamp
    pool.block = block.number

    pool.updatedAt = block.timestamp
    pool.entryUSD = BIG_DECIMAL_ZERO
    pool.exitUSD = BIG_DECIMAL_ZERO
    pool.rubyHarvested = BIG_DECIMAL_ZERO
    pool.rubyHarvestedUSD = BIG_DECIMAL_ZERO
    pool.save()
  }

  return pool as Pool
}

function getOrInsertHistory(owner: string, block: ethereum.Block): History {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = owner.concat(day.toString())

  let history = History.load(id)

  if (history === null) {
    history = new History(id)
    history.owner = owner
    history.rlpBalance = BIG_DECIMAL_ZERO
    history.rlpAge = BIG_DECIMAL_ZERO
    history.rlpAgeRemoved = BIG_DECIMAL_ZERO
    history.rlpDeposited = BIG_DECIMAL_ZERO
    history.rlpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
  }

  return history as History
}

function getOrInsertPoolHistory(pool: Pool, block: ethereum.Block): PoolHistory {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = pool.id.concat(day.toString())

  let history = PoolHistory.load(id)

  if (history === null) {
    history = new PoolHistory(id)
    history.pool = pool.id
    history.rlpBalance = BIG_DECIMAL_ZERO
    history.rlpAge = BIG_DECIMAL_ZERO
    history.rlpAgeRemoved = BIG_DECIMAL_ZERO
    history.rlpDeposited = BIG_DECIMAL_ZERO
    history.rlpWithdrawn = BIG_DECIMAL_ZERO
    history.userCount = BIG_INT_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
    history.entryUSD = BIG_DECIMAL_ZERO
    history.exitUSD = BIG_DECIMAL_ZERO
    history.rubyHarvested = BIG_DECIMAL_ZERO
    history.rubyHarvestedUSD = BIG_DECIMAL_ZERO
  }

  return history as PoolHistory
}

export function getOrInsertUser(pid: BigInt, address: Address, block: ethereum.Block): User {
  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)

  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.pool = null
    user.address = address
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.rubyHarvested = BIG_DECIMAL_ZERO
    user.rubyHarvestedUSD = BIG_DECIMAL_ZERO
    user.entryUSD = BIG_DECIMAL_ZERO
    user.exitUSD = BIG_DECIMAL_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()
  }

  return user as User
}


export function add(event: Add): void {
  log.info('Pool added: pid {}, allocPoint: {}, lpToken: {}, rewarder: {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.rewarder.toHex()
  ])
  massUpdatePools(event.block);
  const masterChef = getOrInsertMasterChef(event.block)
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.plus(event.params.allocPoint);
  masterChef.poolCount = masterChef.poolCount.plus(BIG_INT_ONE)
  masterChef.save()
}

export function set(event: Set): void {
  log.info('Pool set: pid {}, allocPoint: {}, rewarder: {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex()
  ])

  const pool = getOrInsertPool(event.params.pid, event.block)
  const oldAllocPoint = pool.allocPoint
  
  massUpdatePools(event.block);

  const masterChef = getOrInsertMasterChef(event.block)
  masterChef.totalAllocPoint = masterChef.totalAllocPoint.minus(oldAllocPoint).plus(event.params.allocPoint)
  masterChef.save()

}


export function massUpdatePools(block: ethereum.Block): void {
  log.info('Mass update pools', [])
  const masterChef = RubyMasterChefContract.bind(RUBY_MASTER_CHEF_ADDRESS)
  const numPools = (masterChef.poolLength()).toI32()


  for(let i = 0; i < numPools; i++) {
    updatePool(BigInt.fromI32(i), masterChef, block)
  }
}

export function updatePool(pid: BigInt, masterChef: RubyMasterChefContract, block: ethereum.Block): void {

  log.info('Updating pool, id {}', [pid.toString()])


  const poolInfo = masterChef.poolInfo(pid)

  log.info("Updating pool, lastRewardTimestamp: {}, accRubPerShare: {}, rewarder: {}", [poolInfo.value2.toString(), poolInfo.value3.toString(), poolInfo.value4.toHex()])

  const pool = getOrInsertPool(pid, block)
  pool.lastRewardTimestamp = poolInfo.value2
  pool.accRubyPerShare = poolInfo.value3

  const rewarder = getOrInsertRewarder(poolInfo.value4, block)
  if(rewarder !== null ) {
    pool.rewarder = rewarder.id
  }

  pool.save()
}


export function setTreasuryAddress(event: SetTreasuryAddress): void {
  log.info('Treasury address changed from {} to {}', [event.params.oldAddress.toHex(), event.params.newAddress.toHex()])

  const masterChef = getOrInsertMasterChef(event.block)

  masterChef.treasuryAddr = event.params.newAddress
  masterChef.save()
}

export function setTreasuryPercent(event: SetTreasuryPercent): void {
  log.info('Treasury percent changed to {}', [event.params.newPercent.toString()])

  const masterChef = getOrInsertMasterChef(event.block)

  masterChef.treasuryPercent = event.params.newPercent

  masterChef.save()
}




// Events
export function deposit(event: Deposit): void {
  // if (event.params.amount == BIG_INT_ZERO) {
  //   log.info('Deposit zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  log.info('{} has deposited {} rlp tokens to pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const masterChefContract = RubyMasterChefContract.bind(RUBY_MASTER_CHEF_ADDRESS)

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getOrInsertPool(event.params.pid, event.block)

  const poolHistory = getOrInsertPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(RUBY_MASTER_CHEF_ADDRESS)

  pool.lastRewardTimestamp = poolInfo.value2
  pool.accRubyPerShare = poolInfo.value3
  if (poolInfo.value4 != ADDRESS_ZERO) {
    pool.rewarder = poolInfo.value4.toHex()
  }
  

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  pool.rlpAge = pool.rlpAge.plus(poolDays.times(pool.rlpBalance))

  pool.rlpDeposited = pool.rlpDeposited.plus(amount)
  pool.rlpBalance = pool.rlpBalance.plus(amount)

  pool.updatedAt = event.block.timestamp

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  const user = getOrInsertUser(event.params.pid, event.params.user, event.block)

  // If not currently in pool and depositing RLP
  if (!user.pool && event.params.amount.gt(BIG_INT_ZERO)) {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
  }

  // Calculate RUBY being paid out
  if (event.block.number.gt(RUBY_MASTER_CHEF_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accRubyPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    log.info('Deposit: User amount is more than zero, we should harvest {} ruby', [pending.toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      log.info('Harvesting {} RUBY', [pending.toString()])
      const rubyHarvestedUSD = pending.times(getRubyPrice(event.block))
      user.rubyHarvested = user.rubyHarvested.plus(pending)
      user.rubyHarvestedUSD = user.rubyHarvestedUSD.plus(rubyHarvestedUSD)
      pool.rubyHarvested = pool.rubyHarvested.plus(pending)
      pool.rubyHarvestedUSD = pool.rubyHarvestedUSD.plus(rubyHarvestedUSD)
      poolHistory.rubyHarvested = pool.rubyHarvested
      poolHistory.rubyHarvestedUSD = pool.rubyHarvestedUSD
    }
  }

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()
    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const entryUSD = token0USD.plus(token1USD)

      // log.info(
      //   'Token {} priceUSD: {} reserve: {} amount: {} / Token {} priceUSD: {} reserve: {} amount: {} - rlp amount: {} total supply: {} share: {}',
      //   [
      //     token0PriceUSD.toString(),
      //     reservesResult.value.value0.toString(),
      //     token0Amount.toString(),
      //     token1PriceUSD.toString(),
      //     reservesResult.value.value1.toString(),
      //     token1Amount.toString(),
      //     amount.toString(),
      //     totalSupply.toString(),
      //     share.toString(),
      //   ]
      // )

      // log.info('User {} has deposited {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0USD.toString(),
      //   token1Amount.toString(),
      //   token1USD.toString(),
      //   entryUSD.toString(),
      // ])

      user.entryUSD = user.entryUSD.plus(entryUSD)

      pool.entryUSD = pool.entryUSD.plus(entryUSD)

      poolHistory.entryUSD = pool.entryUSD
    }
  }

  user.save()
  pool.save()

  const masterChef = getOrInsertMasterChef(event.block)

  const masterChefDays = event.block.timestamp.minus(masterChef.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  masterChef.rlpAge = masterChef.rlpAge.plus(masterChefDays.times(masterChef.rlpBalance))

  masterChef.rlpDeposited = masterChef.rlpDeposited.plus(amount)
  masterChef.rlpBalance = masterChef.rlpBalance.plus(amount)

  masterChef.updatedAt = event.block.timestamp
  masterChef.save()

  const history = getOrInsertHistory(RUBY_MASTER_CHEF_ADDRESS.toHex(), event.block)
  history.rlpAge = masterChef.rlpAge
  history.rlpBalance = masterChef.rlpBalance
  history.rlpDeposited = history.rlpDeposited.plus(amount)
  history.save()

  poolHistory.rlpAge = pool.rlpAge
  poolHistory.rlpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.rlpDeposited = poolHistory.rlpDeposited.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function withdraw(event: Withdraw): void {
  // if (event.params.amount == BIG_INT_ZERO && User.load(event.params.user.toHex()) !== null) {
  //   log.info('Withdrawal zero transaction, input {} hash {}', [
  //     event.transaction.input.toHex(),
  //     event.transaction.hash.toHex(),
  //   ])
  // }

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  log.info('{} has withdrawn {} rlp tokens from pool #{}', [
    event.params.user.toHex(),
    amount.toString(),
    event.params.pid.toString(),
  ])

  const masterChefContract = RubyMasterChefContract.bind(RUBY_MASTER_CHEF_ADDRESS)

  const poolInfo = masterChefContract.poolInfo(event.params.pid)

  const pool = getOrInsertPool(event.params.pid, event.block)

  const poolHistory = getOrInsertPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(RUBY_MASTER_CHEF_ADDRESS)
  pool.lastRewardTimestamp = poolInfo.value2
  pool.accRubyPerShare = poolInfo.value3
  
  
  if(poolInfo.value4 != ADDRESS_ZERO) {
    pool.rewarder = poolInfo.value4.toHex()
  }
  

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const poolAge = pool.rlpAge.plus(poolDays.times(pool.rlpBalance))
  const poolAgeRemoved = poolAge.div(pool.rlpBalance).times(amount)
  pool.rlpAge = poolAge.minus(poolAgeRemoved)
  pool.rlpAgeRemoved = pool.rlpAgeRemoved.plus(poolAgeRemoved)
  pool.rlpWithdrawn = pool.rlpWithdrawn.plus(amount)
  pool.rlpBalance = pool.rlpBalance.minus(amount)
  pool.updatedAt = event.block.timestamp

  const user = getOrInsertUser(event.params.pid, event.params.user, event.block)

  if (event.block.number.gt(RUBY_MASTER_CHEF_START_BLOCK) && user.amount.gt(BIG_INT_ZERO)) {
    const pending = user.amount
      .toBigDecimal()
      .times(pool.accRubyPerShare.toBigDecimal())
      .div(BIG_DECIMAL_1E12)
      .minus(user.rewardDebt.toBigDecimal())
      .div(BIG_DECIMAL_1E18)
    log.info('Withdraw: User amount is more than zero, we should harvest {} ruby - block: {}', [
      pending.toString(),
      event.block.number.toString(),
    ])
    log.info('RUBY PRICE {}', [getRubyPrice(event.block).toString()])
    if (pending.gt(BIG_DECIMAL_ZERO)) {
      log.info('Harvesting {} RUBY (CURRENT RUBY PRICE {})', [
        pending.toString(),
        getRubyPrice(event.block).toString(),
      ])
      const rubyHarvestedUSD = pending.times(getRubyPrice(event.block))
      user.rubyHarvested = user.rubyHarvested.plus(pending)
      user.rubyHarvestedUSD = user.rubyHarvestedUSD.plus(rubyHarvestedUSD)
      pool.rubyHarvested = pool.rubyHarvested.plus(pending)
      pool.rubyHarvestedUSD = pool.rubyHarvestedUSD.plus(rubyHarvestedUSD)
      poolHistory.rubyHarvested = pool.rubyHarvested
      poolHistory.rubyHarvestedUSD = pool.rubyHarvestedUSD
    }
  }

  const userInfo = masterChefContract.userInfo(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()

    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const exitUSD = token0USD.plus(token1USD)

      pool.exitUSD = pool.exitUSD.plus(exitUSD)

      poolHistory.exitUSD = pool.exitUSD

      // log.info('User {} has withdrwn {} SLP tokens {} {} (${}) and {} {} (${}) at a combined value of ${}', [
      //   user.address.toHex(),
      //   amount.toString(),
      //   token0Amount.toString(),
      //   token0USD.toString(),
      //   pairContract.token0().toHex(),
      //   token1Amount.toString(),
      //   token1USD.toString(),
      //   pairContract.token1().toHex(),
      //   exitUSD.toString(),
      // ])

      user.exitUSD = user.exitUSD.plus(exitUSD)
    } else {
      log.info("Withdraw couldn't get reserves for pair {}", [poolInfo.value0.toHex()])
    }
  }

  // If RLP amount equals zero, remove from pool and reduce userCount
  if (user.amount.equals(BIG_INT_ZERO)) {
    user.pool = null
    pool.userCount = pool.userCount.minus(BIG_INT_ONE)
  }

  user.save()
  pool.save()

  const masterChef = getOrInsertMasterChef(event.block)

  const days = event.block.timestamp.minus(masterChef.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const rlpAge = masterChef.rlpAge.plus(days.times(masterChef.rlpBalance))
  const rlpAgeRemoved = rlpAge.div(masterChef.rlpBalance).times(amount)
  masterChef.rlpAge = rlpAge.minus(rlpAgeRemoved)
  masterChef.rlpAgeRemoved = masterChef.rlpAgeRemoved.plus(rlpAgeRemoved)

  masterChef.rlpWithdrawn = masterChef.rlpWithdrawn.plus(amount)
  masterChef.rlpBalance = masterChef.rlpBalance.minus(amount)
  masterChef.updatedAt = event.block.timestamp
  masterChef.save()

  const history = getOrInsertHistory(RUBY_MASTER_CHEF_ADDRESS.toHex(), event.block)
  history.rlpAge = masterChef.rlpAge
  history.rlpAgeRemoved = history.rlpAgeRemoved.plus(rlpAgeRemoved)
  history.rlpBalance = masterChef.rlpBalance
  history.rlpWithdrawn = history.rlpWithdrawn.plus(amount)
  history.save()

  poolHistory.rlpAge = pool.rlpAge
  poolHistory.rlpAgeRemoved = poolHistory.rlpAgeRemoved.plus(rlpAgeRemoved)
  poolHistory.rlpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.rlpWithdrawn = poolHistory.rlpWithdrawn.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('User {} emergancy withdrawal of {} from pool #{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const pool = getOrInsertPool(event.params.pid, event.block)

  const pairContract = PairContract.bind(pool.pair as Address)
  pool.balance = pairContract.balanceOf(RUBY_MASTER_CHEF_ADDRESS)
  pool.save()

  // Update user
  const user = getOrInsertUser(event.params.pid, event.params.user, event.block)
  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO

  user.save()
}


export function updateEmissionRate(event: UpdateEmissionRate): void {
  log.info('Emission rates updated, new emission rate: {}', [
    event.params._rubyPerSec.toString()
  ])

  const masterChef = getOrInsertMasterChef(event.block)

  masterChef.rubyPerSec = event.params._rubyPerSec

  masterChef.save()
}

export function ownershipTransferred(event: OwnershipTransferred): void {
  log.info('Ownership transfered from previous owner: {} to new owner: {}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])

  const masterChef = getOrInsertMasterChef(event.block)

  masterChef.owner = event.params.newOwner

  masterChef.save()
}
