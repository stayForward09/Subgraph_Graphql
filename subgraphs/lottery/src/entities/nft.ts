import { Address, BigInt, dataSource, log } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO, NULL_CALL_RESULT_VALUE } from 'const'

import { RubyNFT } from '../../generated/LotteryFactory/RubyNFT'
import { RubyNFTDescriptionBytes } from '../../generated/LotteryFactory/RubyNFTDescriptionBytes'
import { RubyNFTVisualAppearanceBytes } from '../../generated/LotteryFactory/RubyNFTVisualAppearanceBytes'
import { NFT } from '../../generated/schema'

export function getNFT(address: Address): NFT | null {
  let nft = NFT.load(address.toHex())

  if (nft === null) {

    nft = new NFT(address.toHex())
    nft.description = getDescription(address)
    nft.visualAppearance = getVisualAppearance(address)

    nft.save()
  }

  return nft as NFT
}

export function getDescription(address: Address): string {
  const contract = RubyNFT.bind(address)
  const contractDescriptionBytes = RubyNFTDescriptionBytes.bind(address)

  // try types string and bytes32 for description
  let descriptionValue = 'unknown'
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

export function getVisualAppearance(address: Address): string {

  const contract = RubyNFT.bind(address)
  const contractVisualAppearanceBytes = RubyNFTVisualAppearanceBytes.bind(address)

  // try types string and bytes32 for visualAppearance
  let visualAppearanceValue = 'unknown'
  const visualAppearanceResult = contract.try_visualAppearance()
  if (visualAppearanceResult.reverted) {
    const visualAppearanceResultBytes = contractVisualAppearanceBytes.try_visualAppearance()
    if (!visualAppearanceResultBytes.reverted) {
      // for broken exchanges that have no visualAppearance function exposed
      if (visualAppearanceResultBytes.value.toHex() != NULL_CALL_RESULT_VALUE) {
        visualAppearanceValue = visualAppearanceResultBytes.value.toString()
      }
    }
  } else {
    visualAppearanceValue = visualAppearanceResult.value
  }

  return visualAppearanceValue
}