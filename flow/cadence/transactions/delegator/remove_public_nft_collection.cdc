import "CapabilityDelegator"

import "NonFungibleToken"
import "ExampleNFT"

transaction {
    prepare(acct: auth(BorrowValue, Capabilities) &Account) {
        let delegator = acct.storage.borrow<auth(CapabilityDelegator.Delete) &CapabilityDelegator.Delegator>(from: CapabilityDelegator.StoragePath)
            ?? panic("delegator not found")

        let sharedCap 
            = acct.capabilities.get<&{ExampleNFT.ExampleNFTCollectionPublic, NonFungibleToken.CollectionPublic}>(ExampleNFT.CollectionPublicPath)
        delegator.removeCapability(cap: sharedCap)
    }
}