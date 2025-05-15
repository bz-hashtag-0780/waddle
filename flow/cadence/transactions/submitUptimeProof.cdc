// submitUptimeProof.cdc
//
// This transaction submits an uptime proof for a hotspot,
// which will be used for calculating rewards.

import "UptimeProof"

transaction(hotspotID: UInt64, duration: UFix64, signalStrength: UFix64) {
    
    let adminRef: &UptimeProof.Admin
    
    prepare(acct: &Account) {
        // Borrow a reference to the admin resource
        self.adminRef = acct.storage.borrow<&UptimeProof.Admin>(
            from: UptimeProof.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        // Submit the uptime proof
        self.adminRef.submitProof(
            hotspotID: hotspotID,
            duration: duration,
            signalStrength: signalStrength, 
            submitter: acct.address
        )
        
        log("Successfully submitted uptime proof for hotspot ID: ".concat(hotspotID.toString()))
    }
} 