import { Address, BigInt, dataSource, log, json } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, NULL_CALL_RESULT_VALUE } from 'const'

import { RubyNFT } from '../../generated/LotteryFactory/RubyNFT'
import { RubyNFTDescriptionBytes } from '../../generated/LotteryFactory/RubyNFTDescriptionBytes'
import { NFT } from '../../generated/schema'

export function getNFT(address: Address): NFT | null {
  let nft = NFT.load(address.toHex())

  if (nft === null) {

    nft = new NFT(address.toHex())
    nft.description = getDescription(address)

    nft.save()
  }

  return nft as NFT
}

export function getDescription(address: Address): string {
  const contract = RubyNFT.bind(address)
  const contractDescriptionBytes = RubyNFTDescriptionBytes.bind(address)

  // try types string and bytes32 for description
  let descriptionValue = '{title: \"unknown\", description: \"unknown\"}'
  const descriptionResult = contract.try_description()
  if (descriptionResult.reverted) {
    const descriptionResultBytes = contractDescriptionBytes.try_description()
    if (!descriptionResultBytes.reverted) {
      // for broken exchanges that have no description function exposed
      if (descriptionResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        descriptionValue = descriptionResultBytes.value.toString()
      }
    }
  } else {
    descriptionValue = descriptionResult.value
  }

  return descriptionValue
}