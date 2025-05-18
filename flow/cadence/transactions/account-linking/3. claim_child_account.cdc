import "MetadataViews"
import "ViewResolver"

import "HybridCustody"
import "CapabilityFilter"

transaction(childAddress: Address) {
    prepare(acct: auth(Storage, Capabilities, Inbox) &Account) {
        var filter = getAccount(childAddress).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)

        if acct.storage.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
            let m <- HybridCustody.createManager(filter: filter)
            acct.storage.save(<- m, to: HybridCustody.ManagerStoragePath)

            for c in acct.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath) {
                c.delete()
            }

            acct.capabilities.unpublish(HybridCustody.ManagerPublicPath)

            acct.capabilities.publish(
                acct.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath),
                at: HybridCustody.ManagerPublicPath
            )

            acct.capabilities.storage.issue<auth(HybridCustody.Manage) &{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath)
        }

        let inboxName = HybridCustody.getChildAccountIdentifier(acct.address)
        let cap = acct.inbox.claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(inboxName, provider: childAddress)
            ?? panic("child account cap not found")

        let manager = acct.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager no found")

        manager.addAccount(cap: cap)

        let d = MetadataViews.Display(
            name: "Waddle Magic Link Wallet",
            description: "Waddle Magic Link Custodial Wallet",
            thumbnail: MetadataViews.HTTPFile(url: "https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_logo.png")
        )

        manager.setChildAccountDisplay(address: childAddress, d)
    }
}