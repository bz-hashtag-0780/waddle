import "HotspotRegistry"

transaction(nftID: UInt64, online: Bool) {
    prepare(acct: auth(Storage) &Account) {

        let adminRef = acct.storage.borrow<&HotspotRegistry.Admin>(from: HotspotRegistry.AdminStoragePath)?? panic("Could not borrow Admin reference")
        
        adminRef.updateHotspotStatus(id: nftID, online: online)

    }
}