// UptimeProof.cdc
//
// This contract handles the submission and verification of uptime proofs
// for hotspots in our decentralized 5G network.

import "HotspotRegistry"

access(all) contract UptimeProof {

    // Events
    access(all) event UptimeProofSubmitted(hotspotID: UInt64, timestamp: UFix64, duration: UFix64)
    access(all) event ContractInitialized()
    
    // Structure to store a single uptime proof
    access(all) struct Proof {
        access(all) let hotspotID: UInt64
        access(all) let timestamp: UFix64
        access(all) let duration: UFix64
        access(all) let signalStrength: UFix64  // A measure of 5G signal quality
        access(all) let submitter: Address
        
        init(hotspotID: UInt64, duration: UFix64, signalStrength: UFix64, submitter: Address) {
            self.hotspotID = hotspotID
            self.timestamp = getCurrentBlock().timestamp
            self.duration = duration
            self.signalStrength = signalStrength
            self.submitter = submitter
        }
    }
    
    // Store all proofs by hotspot ID
    // HotspotID -> [Proof]
    access(all) var proofsByHotspot: {UInt64: [Proof]}
    
    // Store total uptime by hotspot ID
    // HotspotID -> Total Uptime (in seconds)
    access(all) var totalUptimeByHotspot: {UInt64: UFix64}
    
    // Admin resource for managing proofs
    access(all) resource Admin {
        // Submit a new uptime proof for a hotspot
        access(all) fun submitProof(hotspotID: UInt64, duration: UFix64, signalStrength: UFix64, submitter: Address) {
            // Create a new proof
            let newProof = Proof(
                hotspotID: hotspotID,
                duration: duration,
                signalStrength: signalStrength,
                submitter: submitter
            )
            
            // Add to proofs array for this hotspot
            if UptimeProof.proofsByHotspot[hotspotID] == nil {
                UptimeProof.proofsByHotspot[hotspotID] = []
            }
            UptimeProof.proofsByHotspot[hotspotID]!.append(newProof)
            
            // Update total uptime for this hotspot
            if UptimeProof.totalUptimeByHotspot[hotspotID] == nil {
                UptimeProof.totalUptimeByHotspot[hotspotID] = 0.0
            }
            UptimeProof.totalUptimeByHotspot[hotspotID] = UptimeProof.totalUptimeByHotspot[hotspotID]! + duration
            
            // Emit event
            emit UptimeProofSubmitted(hotspotID: hotspotID, timestamp: newProof.timestamp, duration: duration)
        }
        
        // Clear all proofs for testing
        access(all) fun clearProofs() {
            UptimeProof.proofsByHotspot = {}
            UptimeProof.totalUptimeByHotspot = {}
        }
    }
    
    // Get all proofs for a specific hotspot
    access(all) fun getProofsForHotspot(hotspotID: UInt64): [Proof] {
        return UptimeProof.proofsByHotspot[hotspotID] ?? []
    }
    
    // Get total uptime for a specific hotspot
    access(all) fun getTotalUptimeForHotspot(hotspotID: UInt64): UFix64 {
        return UptimeProof.totalUptimeByHotspot[hotspotID] ?? 0.0
    }
    
    // Calculate average signal strength for a hotspot
    access(all) fun getAverageSignalStrengthForHotspot(hotspotID: UInt64): UFix64? {
        let proofs = UptimeProof.proofsByHotspot[hotspotID] ?? []
        
        if proofs.length == 0 {
            return nil
        }
        
        var totalStrength: UFix64 = 0.0
        for proof in proofs {
            totalStrength = totalStrength + proof.signalStrength
        }
        
        return totalStrength / UFix64(proofs.length)
    }
    
    // Paths for storing resources
    access(all) let AdminStoragePath: StoragePath
    
    init() {
        self.proofsByHotspot = {}
        self.totalUptimeByHotspot = {}
        
        self.AdminStoragePath = /storage/UptimeProofAdmin
        
        // Create the admin resource
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
        
        emit ContractInitialized()
    }
} 