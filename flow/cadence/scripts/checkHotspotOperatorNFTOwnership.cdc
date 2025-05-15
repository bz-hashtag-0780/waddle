// checkHotspotOperatorNFTOwnership.cdc
//
// This script checks if an account owns at least one HotspotOperatorNFT.

import HotspotOperatorNFT from "../contracts/HotspotOperatorNFT.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(address: Address): Bool {
    // Try to borrow the public collection capability
    let collectionRef = getAccount(address)
        .getCapability(HotspotOperatorNFT.CollectionPublicPath)
        .borrow<&{HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic}>()
    
    // If the user doesn't have a collection set up, return false
    if collectionRef == nil {
        return false
    }
    
    // Check if the collection has any NFTs
    let ids = collectionRef!.getIDs()
    
    // Return true if they have at least one NFT
    return ids.length > 0
} 