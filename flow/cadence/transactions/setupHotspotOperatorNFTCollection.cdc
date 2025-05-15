// setupHotspotOperatorNFTCollection.cdc
//
// This transaction sets up an account to hold HotspotOperatorNFT by
// creating an empty collection and storing it in the account.

import HotspotOperatorNFT from "../contracts/HotspotOperatorNFT.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction {
    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&HotspotOperatorNFT.Collection>(from: HotspotOperatorNFT.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- HotspotOperatorNFT.createEmptyCollection()

        // Save it to the account
        signer.save(<-collection, to: HotspotOperatorNFT.CollectionStoragePath)

        // Create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic}>(
            HotspotOperatorNFT.CollectionPublicPath,
            target: HotspotOperatorNFT.CollectionStoragePath
        )
    }
} 