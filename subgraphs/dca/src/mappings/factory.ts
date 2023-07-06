import { DCAStorage } from '../../generated/templates'
import { DCAStorageCreated } from '../../generated/DCAFactory/DCAFactory'

export function onDCAStorageCreated(event: DCAStorageCreated): void {
  // Start indexing the exchange; `event.params.exchange` is the
  // address of the new exchange contract
  DCAStorage.create(event.params._dcaStorage)
}