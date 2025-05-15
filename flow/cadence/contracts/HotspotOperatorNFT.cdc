// HotspotOperatorNFT.cdc
//
// This contract implements the basic functionality for a Non-Fungible Token
// that represents ownership rights for operating a 5G hotspot in our network.
// It implements the standard Flow NFT interface.

import "NonFungibleToken"

access(all) contract HotspotOperatorNFT {

    // Events
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event Minted(id: UInt64, recipient: Address?)

    // Named paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath
    access(all) let MinterStoragePath: StoragePath

    // Total supply of HotspotOperatorNFTs in existence
    access(all) var totalSupply: UInt64

    // Represents the metadata for a HotspotOperator NFT
    access(all) struct HotspotOperatorData {
        access(all) let name: String
        access(all) let description: String
        access(all) let thumbnail: String // Could be a URL to an image
        access(all) let createdAt: UFix64

        init(name: String, description: String, thumbnail: String) {
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.createdAt = getCurrentBlock().timestamp
        }
    }

    // Interface for NFT 
    access(all) resource interface INFT {
        access(all) let id: UInt64
    }

    // The NFT resource that represents ownership rights to a hotspot
    access(all) resource NFT: INFT {
        access(all) let id: UInt64
        access(all) let metadata: HotspotOperatorData

        init(initID: UInt64, metadata: HotspotOperatorData) {
            self.id = initID
            self.metadata = metadata
        }
    }

    // Interface for NFT Collection Provider
    access(all) resource interface Provider {
        access(all) fun withdraw(withdrawID: UInt64): @NFT
    }

    // Interface for NFT Collection Receiver
    access(all) resource interface Receiver {
        access(all) fun deposit(token: @NFT)
    }

    // Interface for public collection methods
    access(all) resource interface CollectionPublic {
        access(all) fun getIDs(): [UInt64]
        access(all) fun borrowNFT(id: UInt64): &NFT
    }

    // Interface that users can cast their Collection as to allow others to deposit HotspotOperatorNFTs
    access(all) resource interface HotspotOperatorNFTCollectionPublic {
        access(all) fun deposit(token: @NFT)
        access(all) fun getIDs(): [UInt64]
        access(all) fun borrowNFT(id: UInt64): &NFT
        access(all) fun borrowHotspotOperator(id: UInt64): &NFT? {
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow HotspotOperator reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection resource that holds multiple HotspotOperator NFTs
    access(all) resource Collection: Provider, Receiver, CollectionPublic, HotspotOperatorNFTCollectionPublic {
        // Dictionary of NFT conforming tokens
        // NFT ID -> NFT Resource
        access(all) var ownedNFTs: @{UInt64: NFT}

        init() {
            self.ownedNFTs <- {}
        }

        // Withdraws an NFT from the collection
        access(all) fun withdraw(withdrawID: UInt64): @NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: HotspotOperator with the specified ID does not exist")
            
            emit Withdraw(id: token.id, from: self.owner?.address)
            
            return <-token
        }

        // Deposits an NFT into the collection
        access(all) fun deposit(token: @NFT) {
            let id: UInt64 = token.id
            
            // Add the new token to the dictionary
            let oldToken <- self.ownedNFTs[id] <- token
            
            // Emit the Deposit event
            emit Deposit(id: id, to: self.owner?.address)
            
            destroy oldToken
        }

        // Returns an array of the IDs of NFTs in the collection
        access(all) fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // Returns a borrowed reference to an NFT in the collection
        access(all) fun borrowNFT(id: UInt64): &NFT {
            return (&self.ownedNFTs[id] as &NFT?)!
        }

        // Returns a borrowed reference to a HotspotOperator NFT in the collection
        access(all) fun borrowHotspotOperator(id: UInt64): &NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NFT?)!
                return ref
            }
            
            return nil
        }
    }

    // Resource that allows an admin to mint new HotspotOperator NFTs
    access(all) resource NFTMinter {
        // Mints a new NFT and deposits it into the recipient's collection
        access(all) fun mintNFT(
            recipient: &{HotspotOperatorNFTCollectionPublic},
            name: String,
            description: String,
            thumbnail: String
        ) {
            // Create new metadata
            let metadata = HotspotOperatorData(
                name: name,
                description: description,
                thumbnail: thumbnail
            )

            // Create the NFT
            let newNFT <- create NFT(
                initID: HotspotOperatorNFT.totalSupply,
                metadata: metadata
            )

            // Deposit it in the recipient's account
            recipient.deposit(token: <-newNFT)

            // Increment the total supply counter
            HotspotOperatorNFT.totalSupply = HotspotOperatorNFT.totalSupply + 1

            emit Minted(id: HotspotOperatorNFT.totalSupply - 1, recipient: recipient.owner?.address)
        }
    }

    // Creates an empty Collection and returns it
    access(all) fun createEmptyCollection(): @Collection {
        return <-create Collection()
    }

    init() {
        // Initialize total supply
        self.totalSupply = 0
        
        // Set named paths
        self.CollectionStoragePath = /storage/HotspotOperatorNFTCollection
        self.CollectionPublicPath = /public/HotspotOperatorNFTCollection
        self.MinterStoragePath = /storage/HotspotOperatorNFTMinter

        // Create a Minter resource and save it in storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
} 