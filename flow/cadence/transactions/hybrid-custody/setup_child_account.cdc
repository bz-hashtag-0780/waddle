// setup_child_account.cdc
// This transaction sets up a child account (Magic.link account) with an OwnedAccount resource

import "HybridCustody"
import "MetadataViews"
import "CapabilityFactory"
import "CapabilityFilter"

transaction {
    prepare(signer: auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account) {
        // Check if the OwnedAccount already exists
        if signer.storage.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
            // Create the AuthAccount capability for the owned account
            let acctCap = signer.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()
            
            // Create a new OwnedAccount resource with the account capability
            let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
            
            // Save the OwnedAccount to storage
            signer.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)
            
            // Create a public capability for the OwnedAccount
            signer.capabilities.publish(
                signer.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic}>(
                    HybridCustody.OwnedAccountStoragePath
                ),
                at: HybridCustody.OwnedAccountPublicPath
            )
            
            log("OwnedAccount created and published")
        } else {
            log("OwnedAccount already exists")
        }
    }
} 