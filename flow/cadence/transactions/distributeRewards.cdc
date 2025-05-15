// distributeRewards.cdc
//
// This transaction distributes rewards to hotspot operators
// based on their uptime statistics.

import "RewardToken"
import "UptimeProof"
import "HotspotRegistry"

transaction(rewardPerHour: UFix64) {
    
    let minterRef: &RewardToken.Minter
    let proofsRef: &{UptimeProof.ProofsPublic}
    let registryRef: &{HotspotRegistry.RegistryPublic}
    
    prepare(acct: &Account) {
        // Borrow references to the required resources
        self.minterRef = acct.storage.borrow<&RewardToken.Minter>(
            from: RewardToken.MinterStoragePath
        ) ?? panic("Could not borrow minter reference")
        
        // Get the public capability to the proofs
        let proofsCapability = getAccount(0xf8d6e0586b0a20c7) // Replace with actual deployment address
            .capabilities.get<&{UptimeProof.ProofsPublic}>(
                at: UptimeProof.ProofsPublicPath
            )
            ?? panic("Could not get proofs capability")
        self.proofsRef = proofsCapability.borrow()
            ?? panic("Could not borrow proofs reference")
            
        // Get the public capability to the registry
        let registryCapability = getAccount(0xf8d6e0586b0a20c7) // Replace with actual deployment address
            .capabilities.get<&{HotspotRegistry.RegistryPublic}>(
                at: HotspotRegistry.RegistryPublicPath
            )
            ?? panic("Could not get registry capability")
        self.registryRef = registryCapability.borrow()
            ?? panic("Could not borrow registry reference")
    }
    
    execute {
        // Get all hotspots
        let hotspots = self.registryRef.getAllHotspots()
        
        // Distribute rewards for each hotspot
        for hotspot in hotspots {
            // Get the total uptime for this hotspot
            let totalUptime = self.proofsRef.getTotalUptimeForHotspot(hotspotID: hotspot.id)
            
            // Convert uptime from seconds to hours
            let uptimeHours = totalUptime / 3600.0
            
            // Calculate reward amount
            let rewardAmount = uptimeHours * rewardPerHour
            
            if rewardAmount > 0.0 {
                // Get the recipient's receiver capability
                let recipient = getAccount(hotspot.owner)
                    .capabilities.get<&{RewardToken.Receiver}>(
                        at: RewardToken.VaultReceiverPath
                    )
                    ?? panic("Could not get receiver capability for recipient")
                
                // Mint and distribute the rewards
                let receiverRef = recipient.borrow()
                    ?? panic("Could not borrow receiver reference")
                    
                self.minterRef.mintTokens(amount: rewardAmount, recipient: receiverRef)
                
                log("Distributed ".concat(rewardAmount.toString()).concat(" tokens to hotspot ID: ").concat(hotspot.id.toString()))
            }
        }
    }
} 