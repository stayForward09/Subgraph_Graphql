import { BigInt, Bytes, store } from '@graphprotocol/graph-ts'
import { DCAOrder } from '../../generated/schema'
import { DCAStorage, NewDCAStrategy, AlterDCAStrategy, DeleteDCAStrategy } from '../../generated/templates/DCAStorage/DCAStorage'

export function onNewDCAStrategy(event: NewDCAStrategy): void {
    let order = new DCAOrder(event.params.index.toString());  
    let contract = DCAStorage.bind(event.address);
    let TokenXYZ = contract.TokenXYZ();
    order.index = event.params.index;
    order.storageID = event.params.storageID;
    order.trader = event.params.trader;
    order.interval = event.params.interval;
    order.tokenPriceMin = event.params.tokenPriceMin;
    order.tokenPriceMax = event.params.tokenPriceMax;
    order.tokenAmount = event.params.tokenAmount;
    order.buyOrder = event.params.buyOrder;
    order.lastSwapCount = BigInt.fromI32(0);
    order.lastSwapTime = BigInt.fromI32(1);
    order.totalSwapSum = event.params.duration.times(BigInt.fromI32(3600)).div(event.params.interval);
    order.finished = false;
    order.tokenXYZ = TokenXYZ;
    order.save();
}

export function onAlterDCAStrategy(event: AlterDCAStrategy): void {
    let order = DCAOrder.load(event.params.index.toString());
    order.index = event.params.index;
    order.storageID = event.params.storageID;
    order.trader = event.params.trader;
    order.interval = event.params.interval;
    order.tokenPriceMin = event.params.tokenPriceMin;
    order.tokenPriceMax = event.params.tokenPriceMax;
    order.tokenAmount = event.params.tokenAmount;
    order.buyOrder = event.params.buyOrder;
    order.lastSwapCount = event.params.lastSwapCount;
    order.lastSwapTime = event.params.lastSwapTime;
    order.totalSwapSum = event.params.totalSwapSum;
    if(event.params.lastSwapCount == event.params.totalSwapSum.plus(BigInt.fromI32(1))) order.finished = true;
    else order.finished = false;
    order.save();
}

export function onDeleteDCAStrategy(event: DeleteDCAStrategy): void {
    let order = DCAOrder.load(event.params.index.toString());
    order.finished = true;
    order.save();
}
