// getAllHotspots.cdc
//
// This script retrieves all registered hotspots from the registry.

import "HotspotRegistry"

access(all)
fun main(): [HotspotRegistry.Hotspot] {
    // Get the public capability to the registry
    let registryCapability = getAccount(0xf8d6e0586b0a20c7) // Replace with actual deployment address
        .capabilities.get<&{HotspotRegistry.RegistryPublic}>(
            at: HotspotRegistry.RegistryPublicPath
        )
        ?? panic("Could not get registry capability")
    
    // Borrow a reference to the registry
    let registryRef = registryCapability.borrow()
        ?? panic("Could not borrow registry reference")
    
    // Get all hotspots
    return registryRef.getAllHotspots()
} 