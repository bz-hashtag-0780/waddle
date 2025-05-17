// publish_to_parent.cdc
// This transaction publishes a child account (Magic.link) to a parent account (Flow wallet)
// creating the capability that allows the parent to access the child

import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"

transaction(parentAddress: Address) {
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Get the OwnedAccount resource
        let ownedAccount = signer.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(
            from: HybridCustody.OwnedAccountStoragePath
        ) ?? panic("OwnedAccount not found, please setup your child account first")
        
        // Check if already published to this parent
        if ownedAccount.isChildOf(parentAddress) {
            panic("Already published to this parent address")
        }
        
        // Create a simple capability factory
        let factoryManager <- CapabilityFactory.create()
        signer.storage.save(<-factoryManager, to: /storage/HCFactoryManager)
        
        let capabilityFactoryCap = signer.capabilities.storage.issue<&CapabilityFactory.Manager>(
            /storage/HCFactoryManager
        )
        
        // Create a simple capability filter that allows all capabilities
        let filter <- CapabilityFilter.AllowlistFilter([Type<&AnyResource>()])
        signer.storage.save(<-filter, to: /storage/HCFilterAllowAll)
        
        let capabilityFilterCap = signer.capabilities.storage.issue<&{CapabilityFilter.Filter}>(
            /storage/HCFilterAllowAll
        )
        
        // Publish the child account to the parent
        ownedAccount.publishToParent(
            parentAddress: parentAddress,
            factory: capabilityFactoryCap,
            filter: capabilityFilterCap
        )
        
        log("Published child account to parent: ".concat(parentAddress.toString()))
    }
}