// claim_capability.cdc
// This transaction claims a published capability from a child account (Magic.link) 
// to a parent account (Flow wallet) from the parent's inbox

import "HybridCustody"
import "ViewResolver"

transaction(childAddress: Address) {
    prepare(signer: auth(Storage, Capabilities, Inbox) &Account) {
        // Check if the Manager already exists, if not create one
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
        }
        
        // Get the Manager resource
        let manager = signer.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(
            from: HybridCustody.ManagerStoragePath
        ) ?? panic("Manager not found, please setup your parent account first")
        
        // Get the identifier for the child account
        let identifier = HybridCustody.getChildAccountIdentifier(signer.address)
        
        // Check if there's a message in the inbox with this capability
        let capability = signer.inbox.claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(
            identifier,
            provider: childAddress
        ) ?? panic("No capability found in inbox from provider: ".concat(childAddress.toString()))
        
        // Add the account to the manager
        manager.addAccount(cap: capability)
        
        log("Claimed capability from child account: ".concat(childAddress.toString()))
    }
} 