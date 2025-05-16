access(all) contract FooBar: NonFungibleToken {

    // Standard Paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath

    // Path where the minter should be stored
    access(all) let MinterStoragePath: StoragePath

    // NFT resource conforming to the NonFungibleToken.NFT interface
    access(all) resource NFT: NonFungibleToken.NFT {
        // ...NFT fields and code...

        // Allow users to create an empty collection from the NFT
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())
        }
    }

    // Collection resource conforming to the NonFungibleToken.Collection interface
    access(all) resource Collection: NonFungibleToken.Collection {
        // Store NFTs in a dictionary
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        // Deposit function to add NFTs to the collection
        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @FooBar.NFT
            let id = token.id
            let oldToken <- self.ownedNFTs[token.id] <- token
            destroy oldToken
        }

        // Withdraw function to remove NFTs from the collection
        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID)
                ?? panic("FooBar.Collection.withdraw: Could not withdraw an NFT with ID "
                        .concat(withdrawID.toString())
                        .concat(". Check the submitted ID to make sure it is one that this collection owns."))
            return <-token
        }

        // Allow users to create an empty collection from the Collection
        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-FooBar.createEmptyCollection(nftType: Type<@FooBar.NFT>())
        }

        init() {
            self.ownedNFTs <- {}
        }
    }

    // Function to create an empty collection
    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    init() {
        self.CollectionStoragePath = /storage/fooBarNFTCollection
        self.CollectionPublicPath = /public/fooBarNFTCollection
        self.MinterStoragePath = /storage/fooBarNFTMinter
        self.account.storage.save(<- create NFTMinter(), to: self.MinterStoragePath)
    }
}
