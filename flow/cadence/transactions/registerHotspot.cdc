// registerHotspot.cdc
//
// This transaction allows a user to register a new hotspot in the network
// if they own a HotspotOperatorNFT.

import "HotspotRegistry"
import "HotspotOperatorNFT"

transaction(lat: UFix64, lng: UFix64) {
    
    let adminRef: &HotspotRegistry.Admin
    
    prepare(acct: &Account) {
        // Borrow a reference to the admin resource
        self.adminRef = acct.storage.borrow<&HotspotRegistry.Admin>(
            from: HotspotRegistry.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Register the hotspot for the signer's address
        let hotspotID = self.adminRef.registerHotspot(
            owner: self.acct.address,
            lat: lat,
            lng: lng
        )
        
        log("Successfully registered hotspot with ID: ".concat(hotspotID.toString()))
    }
} 