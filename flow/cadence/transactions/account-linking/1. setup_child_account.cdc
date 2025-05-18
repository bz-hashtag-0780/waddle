import "ViewResolver"
import "HybridCustody"
import "MetadataViews"

transaction {
    prepare(acct: auth(Storage, Capabilities) &Account) {
        let acctCap = acct.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()

        if acct.storage.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
            let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
            acct.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)
        }

        let owned = acct.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
            ?? panic("owned account not found")

        // check that paths are all configured properly
        for c in acct.capabilities.storage.getControllers(forPath: HybridCustody.OwnedAccountStoragePath) {
            c.delete()
        }

        acct.capabilities.storage.issue<&{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath)
        acct.capabilities.publish(
            acct.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath),
            at: HybridCustody.OwnedAccountPublicPath
        )
    }
}