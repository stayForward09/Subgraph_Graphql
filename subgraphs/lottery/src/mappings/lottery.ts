import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Ticket, Reward } from '../../generated/schema'
import { NewTickets, RewardClaimed } from '../../generated/templates/Lottery/Lottery'

export function onNewTickets(event: NewTickets): void {
    let ticket = new Ticket(event.transaction.hash.toHex());
    ticket.who = event.params.who;
    ticket.ticketSize = event.params.ticketSize;
    ticket.timestamp = event.block.timestamp;
    ticket.save();
}

export function onRewardClaimed(event: RewardClaimed): void {
    let reward = new Reward(event.transaction.hash.toHex());
    reward.to = event.params.to;
    reward.amount = event.params.amount;
    reward.collateral = event.params.collateral;
    reward.nft = event.params.nft;
    reward.nftid = event.params.nftid;
    reward.timestamp = event.block.timestamp;
    reward.save();
}
