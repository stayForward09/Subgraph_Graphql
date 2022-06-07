import { Lottery } from '../../generated/templates'
import { LotteryCreated } from '../../generated/LotteryFactory/LotteryFactory'

export function onLotteryCreated(event: LotteryCreated): void {
  // Start indexing the exchange; `event.params.exchange` is the
  // address of the new exchange contract
  Lottery.create(event.params._lottery)
}