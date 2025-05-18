import "HotspotRegistry"
import "HotspotOperatorNFT"
import "NonFungibleToken"

transaction(nftID: UInt64) {
    prepare(acct: auth(Storage) &Account) {

        let collectionRef = acct.storage.borrow<auth(NonFungibleToken.Withdraw) &HotspotOperatorNFT.Collection>(from: HotspotOperatorNFT.CollectionStoragePath)?? panic("Could not borrow operator collection reference")
        
        let nft <- HotspotRegistry.registerHotspot(
            owner: acct.address,
            hotspotOperatorNFT: <-collectionRef.withdraw(withdrawID: nftID) as! @HotspotOperatorNFT.NFT
        )

        collectionRef.deposit(token: <-nft)
    }
}