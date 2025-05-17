import "NonFungibleToken"
import "FungibleToken"

import "CapabilityFactory"
import "NFTCollectionPublicFactory"
import "NFTProviderAndCollectionFactory"
import "NFTProviderFactory"
import "NFTCollectionFactory"
import "FTProviderFactory"
import "FTBalanceFactory"
import "FTReceiverBalanceFactory"
import "FTReceiverFactory"
import "FTAllFactory"
import "FTVaultFactory"

transaction {
    prepare(acct: auth(Storage, Capabilities) &Account) {
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

        let manager = acct.storage.borrow<auth(CapabilityFactory.Add) &CapabilityFactory.Manager>(from: CapabilityFactory.StoragePath) ?? panic("manager not found")

        manager.updateFactory(Type<&{NonFungibleToken.CollectionPublic}>(), NFTCollectionPublicFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(), NFTProviderAndCollectionFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>(), NFTProviderFactory.Factory())
        manager.updateFactory(Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Collection}>(), NFTCollectionFactory.WithdrawFactory())
        manager.updateFactory(Type<&{NonFungibleToken.Collection}>(), NFTCollectionFactory.Factory())
        manager.updateFactory(Type<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(), FTProviderFactory.Factory())
        manager.updateFactory(Type<&{FungibleToken.Balance}>(), FTBalanceFactory.Factory())
        manager.updateFactory(Type<&{FungibleToken.Receiver}>(), FTReceiverFactory.Factory())
        manager.updateFactory(Type<&{FungibleToken.Receiver, FungibleToken.Balance}>(), FTReceiverBalanceFactory.Factory())
        manager.updateFactory(Type<auth(FungibleToken.Withdraw) &{FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance}>(), FTAllFactory.Factory())
        manager.updateFactory(Type<auth(FungibleToken.Withdraw) &{FungibleToken.Vault}>(), FTVaultFactory.WithdrawFactory())
        manager.updateFactory(Type<&{FungibleToken.Vault}>(), FTVaultFactory.Factory())
    }
}
