// mintHotspotOperatorNFT.cdc
//
// This transaction mints a new HotspotOperatorNFT and deposits it
// into the recipient's collection.

import HotspotOperatorNFT from "../contracts/HotspotOperatorNFT.cdc"
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction(
    recipientAddress: Address,
    name: String,
    description: String,
    thumbnail: String
) {
    // Local variable for storing the minter reference
    let minterRef: &HotspotOperatorNFT.NFTMinter
    
    // Local variable for storing the recipient's collection reference
    let recipientCollectionRef: &{NonFungibleToken.CollectionPublic}
    
    prepare(signer: AuthAccount) {
        // Borrow a reference to the NFTMinter resource in storage
        self.minterRef = signer.borrow<&HotspotOperatorNFT.NFTMinter>(from: HotspotOperatorNFT.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")
            
        // Borrow a public reference to the recipient's collection
        self.recipientCollectionRef = getAccount(recipientAddress)
            .getCapability(HotspotOperatorNFT.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the recipient's collection")
    }
    
    execute {
        // Mint the NFT and deposit it to the recipient's collection
        self.minterRef.mintNFT(
            recipient: self.recipientCollectionRef,
            name: name,
            description: description,
            thumbnail: thumbnail
        )
    }
} 