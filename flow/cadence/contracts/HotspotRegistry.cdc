// HotspotRegistry.cdc
//
// This contract manages the registration and tracking of 5G hotspots
// in our decentralized network. It enforces NFT ownership for registration
// and maintains hotspot status and location information.

import "HotspotOperatorNFT"

access(all) contract HotspotRegistry {

    // Events
    access(all) event HotspotRegistered(id: UInt64, owner: Address, lat: UFix64, lng: UFix64)
    access(all) event HotspotStatusChanged(id: UInt64, online: Bool)
    access(all) event HotspotLocationUpdated(id: UInt64, lat: UFix64, lng: UFix64)

    // Represents a 5G hotspot in the network
    access(all) struct Hotspot {
        access(all) let id: UInt64
        access(all) let owner: Address
        access(all) var lat: UFix64
        access(all) var lng: UFix64
        access(all) var online: Bool
        access(all) var lastUpdated: UFix64
        access(all) var totalUptime: UFix64

        init(id: UInt64, owner: Address, lat: UFix64, lng: UFix64) {
            self.id = id
            self.owner = owner
            self.lat = lat
            self.lng = lng
            self.online = false
            self.lastUpdated = getCurrentBlock().timestamp
            self.totalUptime = 0.0
        }
    }

    // Registry of all hotspots
    // Hotspot ID -> Hotspot Struct
    access(all) var hotspots: {UInt64: Hotspot}
    
    // Next available hotspot ID
    access(all) var nextHotspotID: UInt64

    // Registry interface for managing hotspots
    access(all) resource interface RegistryPublic {
        access(all) fun getHotspotByID(id: UInt64): Hotspot?
        access(all) fun getHotspotsByOwner(owner: Address): [Hotspot]
        access(all) fun getAllHotspots(): [Hotspot]
    }

    // Admin resource for managing the registry
    access(all) resource Admin: RegistryPublic {
        // Register a new hotspot
        access(all) fun registerHotspot(owner: Address, lat: UFix64, lng: UFix64): UInt64 {
            // Check if owner has a HotspotOperatorNFT
            // NOTE: In a full implementation, we would verify NFT ownership here
            
            let newHotspotID = HotspotRegistry.nextHotspotID
            
            let newHotspot = Hotspot(
                id: newHotspotID,
                owner: owner,
                lat: lat,
                lng: lng
            )
            
            HotspotRegistry.hotspots[newHotspotID] = newHotspot
            HotspotRegistry.nextHotspotID = newHotspotID + 1
            
            emit HotspotRegistered(id: newHotspotID, owner: owner, lat: lat, lng: lng)
            
            return newHotspotID
        }
        
        // Update hotspot online status
        access(all) fun updateHotspotStatus(id: UInt64, online: Bool) {
            if let hotspot = &HotspotRegistry.hotspots[id] as &Hotspot? {
                let now = getCurrentBlock().timestamp
                
                // If going from online to offline, add to total uptime
                if hotspot.online && !online {
                    hotspot.totalUptime = hotspot.totalUptime + (now - hotspot.lastUpdated)
                }
                
                hotspot.online = online
                hotspot.lastUpdated = now
                
                emit HotspotStatusChanged(id: id, online: online)
            }
        }
        
        // Update hotspot location
        access(all) fun updateHotspotLocation(id: UInt64, lat: UFix64, lng: UFix64) {
            if let hotspot = &HotspotRegistry.hotspots[id] as &Hotspot? {
                hotspot.lat = lat
                hotspot.lng = lng
                
                emit HotspotLocationUpdated(id: id, lat: lat, lng: lng)
            }
        }
        
        // Implement RegistryPublic functions
        access(all) fun getHotspotByID(id: UInt64): Hotspot? {
            return HotspotRegistry.hotspots[id]
        }
        
        access(all) fun getHotspotsByOwner(owner: Address): [Hotspot] {
            let result: [Hotspot] = []
            
            for hotspot in HotspotRegistry.hotspots.values {
                if hotspot.owner == owner {
                    result.append(hotspot)
                }
            }
            
            return result
        }
        
        access(all) fun getAllHotspots(): [Hotspot] {
            return HotspotRegistry.hotspots.values
        }
    }

    // Public resource for reading hotspot information
    access(all) resource Registry: RegistryPublic {
        access(all) fun getHotspotByID(id: UInt64): Hotspot? {
            return HotspotRegistry.hotspots[id]
        }
        
        access(all) fun getHotspotsByOwner(owner: Address): [Hotspot] {
            let result: [Hotspot] = []
            
            for hotspot in HotspotRegistry.hotspots.values {
                if hotspot.owner == owner {
                    result.append(hotspot)
                }
            }
            
            return result
        }
        
        access(all) fun getAllHotspots(): [Hotspot] {
            return HotspotRegistry.hotspots.values
        }
    }

    // Path for storing the admin resource
    access(all) let AdminStoragePath: StoragePath
    
    // Path for the public registry capability
    access(all) let RegistryPublicPath: PublicPath
    
    init() {
        self.hotspots = {}
        self.nextHotspotID = 1
        
        self.AdminStoragePath = /storage/HotspotRegistryAdmin
        self.RegistryPublicPath = /public/HotspotRegistry
        
        // Create the admin resource and save it to storage
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
        
        // Create a public registry and link a capability
        let registry <- create Registry()
        self.account.storage.save(<-registry, to: /storage/HotspotRegistry)
        self.account.capabilities.publish(
            at: self.RegistryPublicPath,
            target: /storage/HotspotRegistry,
            as: Type<&Registry{RegistryPublic}>()
        )
        
        emit ContractInitialized()
    }

    // Contract-level event for initialization
    access(all) event ContractInitialized()
} 