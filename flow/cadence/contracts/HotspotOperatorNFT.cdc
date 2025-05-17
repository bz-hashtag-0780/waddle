// HotspotOperatorNFT.cdc
//
// This contract implements a non-fungible token (NFT) for representing Hotspot Operator NFTs.
// It allows users to register hotspots and receive coverage rewards.

import "NonFungibleToken"
import "ViewResolver"
import "MetadataViews"
import "FIVEGCOIN"
import "RandomPicker"
access(all) contract HotspotOperatorNFT {

    // Events
    access(all) event ContractInitialized()
    access(all) event Withdraw(id: UInt64, from: Address?)
    access(all) event Deposit(id: UInt64, to: Address?)
    access(all) event Minted(id: UInt64, recipient: Address?)

    // Named paths
    access(all) let CollectionStoragePath: StoragePath
    access(all) let CollectionPublicPath: PublicPath

    // Total supply of HotspotOperatorNFTs in existence
    access(all) var totalSupply: UInt64
    access(all) var minters: [Address]
    access(all) var thumbnails: [String]

    // Represents the metadata for a HotspotOperator NFT
    access(all) struct HotspotOperatorData {
        access(all) let name: String
        access(all) let description: String
        access(all) let thumbnail: String
        access(all) let createdAt: UFix64

        init(name: String, description: String, thumbnail: String) {
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.createdAt = getCurrentBlock().timestamp
        }
    }

    // The NFT resource that represents ownership rights to a hotspot
    access(all) resource NFT: NonFungibleToken.NFT {
        access(all) let id: UInt64
        access(all) var metadata: HotspotOperatorData
        access(all) var rewardsVault: @FIVEGCOIN.Vault

        init(thumbnail: String) {

            let metadata: HotspotOperatorData = HotspotOperatorData(
                name: "Hotspot Operator",
                description: "A 🎶 smooth operator 🎶 that represents ownership rights to a hotspot",
                thumbnail: "https://example.com/thumbnail.png"
            )

            self.id = self.uuid
            self.metadata = metadata
            self.rewardsVault <- FIVEGCOIN.createEmptyVault(vaultType: Type<@FIVEGCOIN.Vault>())
        }

        access(all) view fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
				Type<MetadataViews.NFTCollectionDisplay>(),
				Type<MetadataViews.NFTCollectionData>(),
				Type<MetadataViews.ExternalURL>(),
				Type<MetadataViews.Traits>(),
				Type<MetadataViews.Serial>()
            ]
        }

        // resolves the view with the given type for the NFT
        access(all) fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata.name, 
                        description: self.metadata.description, 
                        thumbnail: MetadataViews.HTTPFile(url: self.metadata.thumbnail)
                        )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let externalURL = MetadataViews.ExternalURL("https://waddle-git-main-basicbeasts.vercel.app/")
                    let squareImage = MetadataViews.Media(file: MetadataViews.HTTPFile(url: "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_logo.png"), mediaType: "image/png")
                    return nil
                case Type<MetadataViews.NFTCollectionData>():
                    return self.metadata
            }
            return nil
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-HotspotOperatorNFT.createEmptyCollection(nftType: Type<@NFT>())
        }
    }

    // Interface that users can cast their Collection as to allow others to deposit HotspotOperatorNFTs
    access(all) resource interface HotspotOperatorNFTCollectionPublic {
        access(all) fun deposit(token: @{NonFungibleToken.NFT})
        access(all) fun getIDs(): [UInt64]
        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}?
        access(all) fun borrowHotspotOperator(id: UInt64): &NFT? {
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow HotspotOperator reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection resource that holds multiple HotspotOperator NFTs
    access(all) resource Collection: HotspotOperatorNFTCollectionPublic, NonFungibleToken.Collection {
        // Dictionary of NFT conforming tokens
        // NFT ID -> NFT Resource
        access(all) var ownedNFTs: @{UInt64: {NonFungibleToken.NFT}}

        init() {
            self.ownedNFTs <- {}
        }

        // Return a list of NFT types that this receiver accepts
        access(all) view fun getSupportedNFTTypes(): {Type: Bool} {
            let supportedTypes: {Type: Bool} = {}
            supportedTypes[Type<@HotspotOperatorNFT.NFT>()] = true
            return supportedTypes
        }

        // Return whether or not the given type is accepted by the collection
        // A collection that can accept any type should just return true by default
        access(all) view fun isSupportedNFTType(type: Type): Bool {
            if type == Type<@HotspotOperatorNFT.NFT>() {
                return true
            }
            return false
        }

        access(NonFungibleToken.Withdraw) fun withdraw(withdrawID: UInt64): @{NonFungibleToken.NFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // Deposits an NFT into the collection
        access(all) fun deposit(token: @{NonFungibleToken.NFT}) {
            let token <- token as! @HotspotOperatorNFT.NFT
            let id: UInt64 = token.id
            
            // Add the new token to the dictionary
            let oldToken <- self.ownedNFTs[id] <- token
            
            // Emit the Deposit event
            emit Deposit(id: id, to: self.owner?.address)
            
            destroy oldToken
        }

        access(all) view fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        access(all) view fun getLength(): Int {
            return self.ownedNFTs.keys.length
        }

        access(all) view fun borrowNFT(_ id: UInt64): &{NonFungibleToken.NFT}? {
            return &self.ownedNFTs[id]
        }

        // Returns a borrowed reference to a HotspotOperator NFT in the collection
        access(all) fun borrowHotspotOperator(id: UInt64): &NFT? {
            return self.borrowNFT(id) as! &NFT?
        }

        access(all) view fun borrowViewResolver(id: UInt64): &{ViewResolver.Resolver}? {
            if let nft = &self.ownedNFTs[id] as &{NonFungibleToken.NFT}? {
                return nft as &{ViewResolver.Resolver}
            }
            return nil
        }

        access(all) fun createEmptyCollection(): @{NonFungibleToken.Collection} {
            return <-HotspotOperatorNFT.createEmptyCollection(nftType: Type<@NFT>())
        }
    }

    access(all) fun mintNFTCommit(): @RandomPicker.Receipt {
        var values: [UInt64] = []
        var i: UInt64 = 0
        while i < UInt64(HotspotOperatorNFT.thumbnails.length) {
            values.append(i)
            i = i + 1
        }
        return <-RandomPicker.commit(values: values)
    }

    access(all) fun mintNFTReveal(recipient: &{HotspotOperatorNFTCollectionPublic}, receipt: @RandomPicker.Receipt) {
        
        let randomIndex: UInt64 = RandomPicker.reveal(receipt: <-receipt)
            
        let newNFT: @HotspotOperatorNFT.NFT <- create NFT(thumbnail: HotspotOperatorNFT.thumbnails[randomIndex])

        recipient.deposit(token: <-newNFT)

        HotspotOperatorNFT.totalSupply = HotspotOperatorNFT.totalSupply + 1

        emit Minted(id: HotspotOperatorNFT.totalSupply - 1, recipient: recipient.owner?.address)
    }

    access(all) fun createEmptyCollection(nftType: Type): @{NonFungibleToken.Collection} {
        return <- create Collection()
    }

    init() {
        self.totalSupply = 0
        self.minters = []
        self.thumbnails = [
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_1.png",
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_2.png",
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_3.png",
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_4.png",
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_5.png",
                "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_6.png"
            ]
        
        self.CollectionStoragePath = /storage/HotspotOperatorNFTCollection_2
        self.CollectionPublicPath = /public/HotspotOperatorNFTCollection_2

        emit ContractInitialized()
    }
} 