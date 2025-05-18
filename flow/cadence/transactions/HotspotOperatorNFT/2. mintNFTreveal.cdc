// mintNFTreveal.cdc
//
// This transaction reveals the random selection and completes the minting of a new HotspotOperatorNFT
// This must be executed after running mintNFTcommit.cdc and waiting at least one block.

import "HotspotOperatorNFT"
import "RandomPicker"
import "NonFungibleToken"

transaction {
    prepare(acct: auth(Storage, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Check if the user has a receipt from the commit step
        let receipt <- acct.storage.load<@RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath)
            ?? panic("No receipt found. Make sure you've run mintNFTcommit.cdc first and waited at least one block")
        
        // Create a collection for the user if they don't already have one
        if acct.storage.borrow<&HotspotOperatorNFT.Collection>(from: HotspotOperatorNFT.CollectionStoragePath) == nil {
            let collection <- HotspotOperatorNFT.createEmptyCollection(nftType: Type<@HotspotOperatorNFT.NFT>())
            
            acct.storage.save(<-collection, to: HotspotOperatorNFT.CollectionStoragePath)
            
            let collectionCap = acct.capabilities.storage.issue<&HotspotOperatorNFT.Collection>(HotspotOperatorNFT.CollectionStoragePath)

            acct.capabilities.publish(collectionCap, at: HotspotOperatorNFT.CollectionPublicPath)
        }
        
        // Get the user's collection reference to receive the NFT
        let collectionRef = acct.storage.borrow<&HotspotOperatorNFT.Collection>(
            from: HotspotOperatorNFT.CollectionStoragePath
        ) ?? panic("Could not borrow reference to HotspotOperatorNFT collection")
        
        // Call the reveal function to mint the NFT with random properties
        HotspotOperatorNFT.mintNFTReveal(
            recipient: collectionRef as &{HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic},
            receipt: <-receipt
        )
        
    }
}
