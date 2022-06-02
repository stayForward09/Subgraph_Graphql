import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Ticket } from '../../generated/schema'
import { NewTickets } from '../../generated/templates/Lottery/Lottery'

export function onNewTickets(event: NewTickets): void {
    let ticket = new Ticket(event.transaction.hash.toHex());
    ticket.who = event.params.who;
    ticket.ticketSize = event.params.ticketSize;
    ticket.timestamp = event.block.timestamp;
    ticket.save();
}