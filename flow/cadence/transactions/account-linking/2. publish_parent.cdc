import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "CapabilityDelegator"
import "HotspotOperatorNFT"
import "NonFungibleToken"
						
transaction(parent: Address) {
    prepare(acct: auth(Storage, Capabilities, BorrowValue, StorageCapabilities) &Account) {
        let owned = acct.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
            ?? panic("owned account not found")

        if acct.storage.borrow<&CapabilityFilter.AllowAllFilter>(from: CapabilityFilter.StoragePath) == nil {
            acct.storage.save(<- CapabilityFilter.createFilter(Type<@CapabilityFilter.AllowAllFilter>()), to: CapabilityFilter.StoragePath)
        }

        acct.capabilities.unpublish(CapabilityFilter.PublicPath)
        acct.capabilities.publish(
            acct.capabilities.storage.issue<&{CapabilityFilter.Filter}>(CapabilityFilter.StoragePath),
            at: CapabilityFilter.PublicPath
        )

        assert(acct.capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath).check(), message: "failed to setup filter")

        if acct.storage.borrow<&AnyResource>(from: CapabilityFactory.StoragePath) == nil {
            let f <- CapabilityFactory.createFactoryManager()
            acct.storage.save(<-f, to: CapabilityFactory.StoragePath)
        }

        if !acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath).check() {
            acct.capabilities.unpublish(CapabilityFactory.PublicPath)

            let cap = acct.capabilities.storage.issue<&CapabilityFactory.Manager>(CapabilityFactory.StoragePath)
            acct.capabilities.publish(cap, at: CapabilityFactory.PublicPath)
        }

        assert(
            acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath).check(),
            message: "CapabilityFactory is not setup properly"
        )

        let factory = acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory address is not configured properly")

        let filter = acct.capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        assert(filter.check(), message: "capability filter is not configured properly")

        owned.publishToParent(parentAddress: parent, factory: factory, filter: filter)

    }
}