// setup_parent_account.cdc
// This transaction sets up a parent account (Flow wallet) with a Manager resource

import "HybridCustody"
import "CapabilityFilter"

transaction {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Check if the Manager already exists
        if signer.storage.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
            // Create a new Manager resource without a filter
            let manager <- HybridCustody.createManager(filter: nil)
            
            // Save the Manager to storage
            signer.storage.save(<-manager, to: HybridCustody.ManagerStoragePath)
            
            // Create a public capability for the Manager
            signer.capabilities.publish(
                signer.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(
                    HybridCustody.ManagerStoragePath
                ),
                at: HybridCustody.ManagerPublicPath
            )
            
            log("Manager created and published")
        } else {
            log("Manager already exists")
        }
    }
} 