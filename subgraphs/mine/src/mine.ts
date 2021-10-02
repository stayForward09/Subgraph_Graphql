import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ZERO,
  BIG_INT_ZERO,
  RUBY_MINE_ADDRESS,
  RUBY_TOKEN_ADDRESS,
  RUBY_USDT_PAIR_ADDRESS,
} from 'const'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import { Mine, History, User } from '../generated/schema'
import { Mine as MineContract, Transfer as TransferEvent } from '../generated/RubyMine/Mine'

import { Pair as PairContract } from '../generated/RubyMine/Pair'
import { RubyToken as RubyTokenContract } from '../generated/RubyMine/RubyToken'

// TODO: Get averages of multiple ruby stablecoin pairs
function getRubyPrice(): BigDecimal {
  const pair = PairContract.bind(RUBY_USDT_PAIR_ADDRESS)
  const reserves = pair.getReserves()
  return reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal()).div(BIG_DECIMAL_1E6)
}

function createMine(block: ethereum.Block): Mine {
  const contract = MineContract.bind(dataSource.address())
  const mine = new Mine(dataSource.address().toHex())
  mine.decimals = contract.decimals()
  mine.name = contract.name()
  mine.ruby = contract.ruby()
  mine.symbol = contract.symbol()
  mine.totalSupply = BIG_DECIMAL_ZERO
  mine.rubyStaked = BIG_DECIMAL_ZERO
  mine.rubyStakedUSD = BIG_DECIMAL_ZERO
  mine.rubyHarvested = BIG_DECIMAL_ZERO
  mine.rubyHarvestedUSD = BIG_DECIMAL_ZERO
  mine.xRubyMinted = BIG_DECIMAL_ZERO
  mine.xRubyBurned = BIG_DECIMAL_ZERO
  mine.xRubyAge = BIG_DECIMAL_ZERO
  mine.xRubyAgeDestroyed = BIG_DECIMAL_ZERO
  mine.ratio = BIG_DECIMAL_ZERO
  mine.updatedAt = block.timestamp
  mine.save()

  return mine as Mine
}

function getMine(block: ethereum.Block): Mine {
  let mine = Mine.load(dataSource.address().toHex())

  if (mine === null) {
    mine = createMine(block)
  }

  return mine as Mine
}

function createUser(address: Address, block: ethereum.Block): User {
  const user = new User(address.toHex())

  // Set relation to mine
  user.mine = dataSource.address().toHex()

  user.xRuby = BIG_DECIMAL_ZERO
  user.xRubyMinted = BIG_DECIMAL_ZERO
  user.xRubyBurned = BIG_DECIMAL_ZERO

  user.rubyStaked = BIG_DECIMAL_ZERO
  user.rubyStakedUSD = BIG_DECIMAL_ZERO

  user.rubyHarvested = BIG_DECIMAL_ZERO
  user.rubyHarvestedUSD = BIG_DECIMAL_ZERO

  // In/Out
  user.xRubyOut = BIG_DECIMAL_ZERO
  user.rubyOut = BIG_DECIMAL_ZERO
  user.usdOut = BIG_DECIMAL_ZERO

  user.xRubyIn = BIG_DECIMAL_ZERO
  user.rubyIn = BIG_DECIMAL_ZERO
  user.usdIn = BIG_DECIMAL_ZERO

  user.xRubyAge = BIG_DECIMAL_ZERO
  user.xRubyAgeDestroyed = BIG_DECIMAL_ZERO

  user.xRubyOffset = BIG_DECIMAL_ZERO
  user.rubyOffset = BIG_DECIMAL_ZERO
  user.usdOffset = BIG_DECIMAL_ZERO
  user.updatedAt = block.timestamp

  return user as User
}

function getUser(address: Address, block: ethereum.Block): User {
  let user = User.load(address.toHex())

  if (user === null) {
    user = createUser(address, block)
  }

  return user as User
}

function getHistory(block: ethereum.Block): History {
  const day = block.timestamp.toI32() / 86400

  const id = BigInt.fromI32(day).toString()

  let history = History.load(id)

  if (history === null) {
    const date = day * 86400
    history = new History(id)
    history.date = date
    history.timeframe = 'Day'
    history.rubyStaked = BIG_DECIMAL_ZERO
    history.rubyStakedUSD = BIG_DECIMAL_ZERO
    history.rubyHarvested = BIG_DECIMAL_ZERO
    history.rubyHarvestedUSD = BIG_DECIMAL_ZERO
    history.xRubyAge = BIG_DECIMAL_ZERO
    history.xRubyAgeDestroyed = BIG_DECIMAL_ZERO
    history.xRubyMinted = BIG_DECIMAL_ZERO
    history.xRubyBurned = BIG_DECIMAL_ZERO
    history.xRubySupply = BIG_DECIMAL_ZERO
    history.ratio = BIG_DECIMAL_ZERO
  }

  return history as History
}

export function transfer(event: TransferEvent): void {
  // Convert to BigDecimal with 18 places, 1e18.
  const value = event.params.value.divDecimal(BIG_DECIMAL_1E18)

  // If value is zero, do nothing.
  if (value.equals(BIG_DECIMAL_ZERO)) {
    log.warning('Transfer zero value! Value: {} Tx: {}', [
      event.params.value.toString(),
      event.transaction.hash.toHex(),
    ])
    return
  }

  const mine = getMine(event.block)
  const mineContract = MineContract.bind(RUBY_MINE_ADDRESS)

  const rubyPrice = getRubyPrice()

  mine.totalSupply = mineContract.totalSupply().divDecimal(BIG_DECIMAL_1E18)
  mine.rubyStaked = RubyTokenContract.bind(RUBY_TOKEN_ADDRESS)
    .balanceOf(RUBY_MINE_ADDRESS)
    .divDecimal(BIG_DECIMAL_1E18)
  mine.ratio = mine.rubyStaked.div(mine.totalSupply)

  const what = value.times(mine.ratio)

  // Minted xRuby
  if (event.params.from == ADDRESS_ZERO) {
    const user = getUser(event.params.to, event.block)

    log.info('{} minted {} xRuby in exchange for {} ruby - rubyStaked before {} rubyStaked after {}', [
      event.params.to.toHex(),
      value.toString(),
      what.toString(),
      user.rubyStaked.toString(),
      user.rubyStaked.plus(what).toString(),
    ])

    if (user.xRuby == BIG_DECIMAL_ZERO) {
      log.info('{} entered the mine', [user.id])
      user.mine = mine.id
    }

    user.xRubyMinted = user.xRubyMinted.plus(value)

    const rubyStakedUSD = what.times(rubyPrice)

    user.rubyStaked = user.rubyStaked.plus(what)
    user.rubyStakedUSD = user.rubyStakedUSD.plus(rubyStakedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xRubyAge = days.times(user.xRuby)

    user.xRubyAge = user.xRubyAge.plus(xRubyAge)

    // Update last
    user.xRuby = user.xRuby.plus(value)

    user.updatedAt = event.block.timestamp

    user.save()

    const mineDays = event.block.timestamp.minus(mine.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const mineXruby = mine.xRubyMinted.minus(mine.xRubyBurned)
    mine.xRubyMinted = mine.xRubyMinted.plus(value)
    mine.xRubyAge = mine.xRubyAge.plus(mineDays.times(mineXruby))
    mine.rubyStaked = mine.rubyStaked.plus(what)
    mine.rubyStakedUSD = mine.rubyStakedUSD.plus(rubyStakedUSD)
    mine.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xRubyAge = mine.xRubyAge
    history.xRubyMinted = history.xRubyMinted.plus(value)
    history.xRubySupply = mine.totalSupply
    history.rubyStaked = history.rubyStaked.plus(what)
    history.rubyStakedUSD = history.rubyStakedUSD.plus(rubyStakedUSD)
    history.ratio = mine.ratio
    history.save()
  }

  // Burned xRuby
  if (event.params.to == ADDRESS_ZERO) {
    log.info('{} burned {} xRuby', [event.params.from.toHex(), value.toString()])

    const user = getUser(event.params.from, event.block)

    user.xRubyBurned = user.xRubyBurned.plus(value)

    user.rubyHarvested = user.rubyHarvested.plus(what)

    const rubyHarvestedUSD = what.times(rubyPrice)

    user.rubyHarvestedUSD = user.rubyHarvestedUSD.plus(rubyHarvestedUSD)

    const days = event.block.timestamp.minus(user.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    const xRubyAge = days.times(user.xRuby)

    user.xRubyAge = user.xRubyAge.plus(xRubyAge)

    const xRubyAgeDestroyed = user.xRubyAge.div(user.xRuby).times(value)

    user.xRubyAgeDestroyed = user.xRubyAgeDestroyed.plus(xRubyAgeDestroyed)

    // remove xRubyAge
    user.xRubyAge = user.xRubyAge.minus(xRubyAgeDestroyed)
    // Update xRuby last
    user.xRuby = user.xRuby.minus(value)

    if (user.xRuby == BIG_DECIMAL_ZERO) {
      log.info('{} left the mine', [user.id])
      user.mine = null
    }

    user.updatedAt = event.block.timestamp

    user.save()

    const mineDays = event.block.timestamp.minus(mine.updatedAt).divDecimal(BigDecimal.fromString('86400'))
    const mineXruby = mine.xRubyMinted.minus(mine.xRubyBurned)
    mine.xRubyBurned = mine.xRubyBurned.plus(value)
    mine.xRubyAge = mine.xRubyAge.plus(mineDays.times(mineXruby)).minus(xRubyAgeDestroyed)
    mine.xRubyAgeDestroyed = mine.xRubyAgeDestroyed.plus(xRubyAgeDestroyed)
    mine.rubyHarvested = mine.rubyHarvested.plus(what)
    mine.rubyHarvestedUSD = mine.rubyHarvestedUSD.plus(rubyHarvestedUSD)
    mine.updatedAt = event.block.timestamp

    const history = getHistory(event.block)
    history.xRubySupply = mine.totalSupply
    history.xRubyBurned = history.xRubyBurned.plus(value)
    history.xRubyAge = mine.xRubyAge
    history.xRubyAgeDestroyed = history.xRubyAgeDestroyed.plus(xRubyAgeDestroyed)
    history.rubyHarvested = history.rubyHarvested.plus(what)
    history.rubyHarvestedUSD = history.rubyHarvestedUSD.plus(rubyHarvestedUSD)
    history.ratio = mine.ratio
    history.save()
  }

  // If transfer from address to address and not known xRuby pools.
  if (event.params.from != ADDRESS_ZERO && event.params.to != ADDRESS_ZERO) {
    log.info('transfered {} xRuby from {} to {}', [
      value.toString(),
      event.params.from.toHex(),
      event.params.to.toHex(),
    ])

    const fromUser = getUser(event.params.from, event.block)

    const fromUserDays = event.block.timestamp.minus(fromUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    // Recalc xRuby age first
    fromUser.xRubyAge = fromUser.xRubyAge.plus(fromUserDays.times(fromUser.xRuby))
    // Calculate xRubyAge being transfered
    const xRubyAgeTranfered = fromUser.xRubyAge.div(fromUser.xRuby).times(value)
    // Subtract from xRubyAge
    fromUser.xRubyAge = fromUser.xRubyAge.minus(xRubyAgeTranfered)
    fromUser.updatedAt = event.block.timestamp

    fromUser.xRuby = fromUser.xRuby.minus(value)
    fromUser.xRubyOut = fromUser.xRubyOut.plus(value)
    fromUser.rubyOut = fromUser.rubyOut.plus(what)
    fromUser.usdOut = fromUser.usdOut.plus(what.times(rubyPrice))

    if (fromUser.xRuby == BIG_DECIMAL_ZERO) {
      log.info('{} left the mine by transfer OUT', [fromUser.id])
      fromUser.mine = null
    }

    fromUser.save()

    const toUser = getUser(event.params.to, event.block)

    if (toUser.mine === null) {
      log.info('{} entered the mine by transfer IN', [fromUser.id])
      toUser.mine = mine.id
    }

    // Recalculate xRuby age and add incoming xRubyAgeTransfered
    const toUserDays = event.block.timestamp.minus(toUser.updatedAt).divDecimal(BigDecimal.fromString('86400'))

    toUser.xRubyAge = toUser.xRubyAge.plus(toUserDays.times(toUser.xRuby)).plus(xRubyAgeTranfered)
    toUser.updatedAt = event.block.timestamp

    toUser.xRuby = toUser.xRuby.plus(value)
    toUser.xRubyIn = toUser.xRubyIn.plus(value)
    toUser.rubyIn = toUser.rubyIn.plus(what)
    toUser.usdIn = toUser.usdIn.plus(what.times(rubyPrice))

    const difference = toUser.xRubyIn.minus(toUser.xRubyOut).minus(toUser.xRubyOffset)

    // If difference of ruby in - ruby out - offset > 0, then add on the difference
    // in staked ruby based on xRuby:Ruby ratio at time of reciept.
    if (difference.gt(BIG_DECIMAL_ZERO)) {
      const ruby = toUser.rubyIn.minus(toUser.rubyOut).minus(toUser.rubyOffset)
      const usd = toUser.usdIn.minus(toUser.usdOut).minus(toUser.usdOffset)

      log.info('{} recieved a transfer of {} xRuby from {}, ruby value of transfer is {}', [
        toUser.id,
        value.toString(),
        fromUser.id,
        what.toString(),
      ])

      toUser.rubyStaked = toUser.rubyStaked.plus(ruby)
      toUser.rubyStakedUSD = toUser.rubyStakedUSD.plus(usd)

      toUser.xRubyOffset = toUser.xRubyOffset.plus(difference)
      toUser.rubyOffset = toUser.rubyOffset.plus(ruby)
      toUser.usdOffset = toUser.usdOffset.plus(usd)
    }

    toUser.save()
  }

  mine.save()
}
