import "HybridCustody"
import "CapabilityFilter"

// Sets the signing account's HybridCustody.Manager.filter capability to
// the filter which exists at the given address's public path
transaction(addr: Address) {
    prepare(acct: auth(Storage) &Account) {
        let manager = acct.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("manager not found")
        
        let cap = getAccount(addr).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        manager.setDefaultManagerCapabilityFilter(cap: cap)
    }
}