import "HotspotRegistry"

transaction(nftID: UInt64, lat: UFix64, lng: UFix64) {
    prepare(acct: auth(Storage) &Account) {

        let adminRef = acct.storage.borrow<&HotspotRegistry.Admin>(from: HotspotRegistry.AdminStoragePath)?? panic("Could not borrow Admin reference")
        
        adminRef.updateHotspotLocation(
            id: nftID,
            lat: lat,
            lng: lng
        )

    }
}