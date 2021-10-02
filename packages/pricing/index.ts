import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  RUBY_WETH_USDT_PAIR_ADDRESS,
  RUBY_TOKEN_ADDRESS,
  RUBY_USDT_PAIR_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_RUBY_ETH_PAIR_FIRST_LIQUDITY_BLOCK,
  UNISWAP_RUBY_USDT_PAIR_ADDRESS,
  UNISWAP_WETH_USDT_PAIR_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from "const";
import {
  Address,
  BigDecimal,
  BigInt,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";

import { Factory as FactoryContract } from "exchange/generated/Factory/Factory";
import { Pair as PairContract } from "exchange/generated/Factory/Pair";

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {
  const usdt = BIG_DECIMAL_ONE;

  if (token != USDT_ADDRESS) {
    const address = block.number.le(BigInt.fromI32(10829344))
      ? UNISWAP_WETH_USDT_PAIR_ADDRESS
      : RUBY_WETH_USDT_PAIR_ADDRESS;

    const tokenPriceETH = getEthRate(token, block);

    const pair = PairContract.bind(address);

    const reserves = pair.getReserves();

    const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18);

    const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18);

    const ethPriceUSD = reserve1
      .div(reserve0)
      .div(BIG_DECIMAL_1E6)
      .times(BIG_DECIMAL_1E18);

    return ethPriceUSD.times(tokenPriceETH);
  }

  return usdt;
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  let eth = BIG_DECIMAL_ONE;

  if (token != WETH_ADDRESS) {
    const factory = FactoryContract.bind(
      block.number.le(BigInt.fromI32(10829344))
        ? UNISWAP_FACTORY_ADDRESS
        : FACTORY_ADDRESS
    );

    const address = factory.getPair(token, WETH_ADDRESS);

    if (address == ADDRESS_ZERO) {
      log.info("Adress ZERO...", []);
      return BIG_DECIMAL_ZERO;
    }

    const pair = PairContract.bind(address);

    const reserves = pair.getReserves();

    eth =
      pair.token0() == WETH_ADDRESS
        ? reserves.value0
            .toBigDecimal()
            .times(BIG_DECIMAL_1E18)
            .div(reserves.value1.toBigDecimal())
        : reserves.value1
            .toBigDecimal()
            .times(BIG_DECIMAL_1E18)
            .div(reserves.value0.toBigDecimal());

    return eth.div(BIG_DECIMAL_1E18);
  }

  return eth;
}

export function getRubyPrice(block: ethereum.Block): BigDecimal {
  if (block.number.lt(UNISWAP_RUBY_ETH_PAIR_FIRST_LIQUDITY_BLOCK)) {
    // If before uniswap sushi-eth pair creation and liquidity added, return zero
    return BIG_DECIMAL_ZERO;
  } else if (block.number.lt(BigInt.fromI32(10800029))) {
    // Else if before uniswap sushi-usdt pair creation (get price from eth sushi-eth pair above)
    return getUSDRate(RUBY_TOKEN_ADDRESS, block);
  } else {
    // Else get price from either uni or sushi usdt pair depending on space-time
    const pair = PairContract.bind(
      block.number.le(BigInt.fromI32(10829344))
        ? UNISWAP_RUBY_USDT_PAIR_ADDRESS
        : RUBY_USDT_PAIR_ADDRESS
    );
    const reserves = pair.getReserves();
    return reserves.value1
      .toBigDecimal()
      .times(BIG_DECIMAL_1E18)
      .div(reserves.value0.toBigDecimal())
      .div(BIG_DECIMAL_1E6);
  }
}
