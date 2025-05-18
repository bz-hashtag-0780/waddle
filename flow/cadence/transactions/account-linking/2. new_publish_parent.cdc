import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "CapabilityDelegator"
import "HotspotOperatorNFT"
import "NonFungibleToken"
import "NFTCollectionPublicFactory"
import "NFTProviderAndCollectionFactory"
import "NFTProviderFactory"

access(all) fun createCapIfNotExists(_ acct: auth(StorageCapabilities) &Account, forPath: StoragePath) {
    var capExists = false

    acct.capabilities.storage.forEachController(forPath: forPath, fun (controller: &StorageCapabilityController): Bool {
        if (controller.borrowType.isSubtype(of: Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>())) {
            capExists = true

            return true
        }

        return false
    })


    if (!capExists) {
        acct.capabilities.storage.issue<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(forPath)
    }
}

transaction(parent: Address) {
    prepare(acct: auth(Storage, Capabilities, StorageCapabilities) &Account) {
        createCapIfNotExists(acct, forPath: HotspotOperatorNFT.CollectionStoragePath)

        let owned = acct.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(
            from: HybridCustody.OwnedAccountStoragePath
        ) ?? panic("owned account not found")

        // Setup factory
        if acct.storage.borrow<&CapabilityFactory.Manager>(from: CapabilityFactory.StoragePath) == nil {
            let f <- CapabilityFactory.createFactoryManager()
            acct.storage.save(<-f, to: CapabilityFactory.StoragePath)
        }

        if !acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath).check() {
            acct.capabilities.unpublish(CapabilityFactory.PublicPath)
            acct.capabilities.publish(
                acct.capabilities.storage.issue<&CapabilityFactory.Manager>(CapabilityFactory.StoragePath),
                at: CapabilityFactory.PublicPath
            )
        }

        let factory = acct.capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory not set up")

        // Flow wallet inaccessible - try fixing
        let manager = acct.storage.borrow<auth(CapabilityFactory.Add) &CapabilityFactory.Manager>(from: CapabilityFactory.StoragePath)
            ?? panic("manager not found")
        
        manager.addFactory(Type<&{NonFungibleToken.CollectionPublic}>(), NFTCollectionPublicFactory.Factory())
        manager.addFactory(Type<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(), NFTProviderAndCollectionFactory.Factory())
        manager.addFactory(Type<&{NonFungibleToken.Provider}>(), NFTProviderFactory.Factory())


        // Use a unique per-parent filter path
        let filterStoragePath = StoragePath(identifier: "CapFilter_".concat(parent.toString()))!
        let filterPublicPath = PublicPath(identifier: "CapFilter_".concat(parent.toString()))!

        if acct.storage.borrow<&CapabilityFilter.AllowlistFilter>(from: filterStoragePath) == nil {
            acct.storage.save(<- CapabilityFilter.createFilter(Type<@CapabilityFilter.AllowlistFilter>()), to: filterStoragePath)
            acct.capabilities.unpublish(filterPublicPath)
            acct.capabilities.publish(
                acct.capabilities.storage.issue<&{CapabilityFilter.Filter}>(filterStoragePath), at: filterPublicPath)
        }
        

        let filterCap = acct.capabilities.get<&{CapabilityFilter.Filter}>(filterPublicPath)
        assert(filterCap.check(), message: "failed to load filter cap")

        let filter = acct.storage.borrow<auth(CapabilityFilter.Add, CapabilityFilter.Delete) &CapabilityFilter.AllowlistFilter>(from: filterStoragePath)
            ?? panic("filter does not exist")

        let filterDetails = filter.getDetails() as! {String:AnyStruct}
        for allowedType in filterDetails["allowedTypes"]! as! [Type]{
            filter.removeType(allowedType)
        }

        let collectionIdentifiers = ["A.cc6a3536f37381a2.HotspotOperatorNFT.Collection"]

        for collectionIdent in collectionIdentifiers {
            let c = CompositeType(collectionIdent)!
            filter.addType(c)
        }

        // Publish to parent
        owned.publishToParent(parentAddress: parent, factory: factory, filter: filterCap)
    }
}
