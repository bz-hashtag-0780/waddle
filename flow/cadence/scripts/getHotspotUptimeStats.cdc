// getHotspotUptimeStats.cdc
//
// This script retrieves uptime statistics for a specific hotspot,
// including total uptime and average signal strength.

import "UptimeProof"

access(all)
fun main(hotspotID: UInt64): {String: AnyStruct} {
    // Get the public capability to the proofs
    let proofsCapability = getAccount(0xf8d6e0586b0a20c7) // Replace with actual deployment address
        .capabilities.get<&{UptimeProof.ProofsPublic}>(
            at: UptimeProof.ProofsPublicPath
        )
        ?? panic("Could not get proofs capability")
    
    // Borrow a reference to the proofs
    let proofsRef = proofsCapability.borrow()
        ?? panic("Could not borrow proofs reference")
    
    // Get statistics
    let totalUptime = proofsRef.getTotalUptimeForHotspot(hotspotID: hotspotID)
    let avgSignalStrength = proofsRef.getAverageSignalStrengthForHotspot(hotspotID: hotspotID)
    let proofs = proofsRef.getProofsForHotspot(hotspotID: hotspotID)
    
    // Return as a dictionary
    return {
        "totalUptime": totalUptime,
        "averageSignalStrength": avgSignalStrength,
        "proofCount": proofs.length
    }
} 