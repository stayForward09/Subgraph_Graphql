import { Address, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, NULL_CALL_RESULT_VALUE } from 'const'

import { ERC20 } from '../../generated/LotteryFactory/ERC20'
import { ERC20SymbolBytes } from '../../generated/LotteryFactory/ERC20SymbolBytes'
import { Token } from '../../generated/schema'

export function getToken(address: Address): Token | null {
  let token = Token.load(address.toHex())

  if (token === null) {

    token = new Token(address.toHex())
    token.symbol = getSymbol(address)
    const decimals = getDecimals(address)

    // TODO: Does this ever happen?
    if (decimals === null) {
      log.warning('Demicals for token {} was null', [address.toHex()])
      return null
    }

    token.decimals = decimals

    token.save()
  }

  return token as Token
}

export function getSymbol(address: Address): string {
  const contract = ERC20.bind(address)
  const contractSymbolBytes = ERC20SymbolBytes.bind(address)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (symbolResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        symbolValue = symbolResultBytes.value.toString()
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function getDecimals(address: Address): BigInt {

  const contract = ERC20.bind(address)

  // try types uint8 for decimals
  let decimalValue = null

  const decimalResult = contract.try_decimals()

  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }

  return BigInt.fromI32(decimalValue as i32)
}
