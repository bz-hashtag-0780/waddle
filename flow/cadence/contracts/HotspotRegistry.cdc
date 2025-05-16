// HotspotRegistry.cdc
//
// This contract manages the registration and management of hotspots in the network.
// It allows users to register hotspots and admins to update their status, and retrieve information about them.

import "HotspotOperatorNFT"

access(all) contract HotspotRegistry {

    // Events
    access(all) event ContractInitialized()
    access(all) event HotspotRegistered(id: UInt64, owner: Address)
    access(all) event HotspotStatusChanged(id: UInt64, online: Bool)
    access(all) event HotspotLocationUpdated(id: UInt64, lat: UFix64, lng: UFix64)

    // Named paths
    access(all) let AdminStoragePath: StoragePath

    // Represents a 5G hotspot in the network
    access(all) struct Hotspot {
        access(all) let id: UInt64
        access(all) let owner: Address
        access(all) var lat: UFix64?
        access(all) var lng: UFix64?
        access(all) var online: Bool
        access(all) var lastUpdated: UFix64
        access(all) var totalUptime: UFix64

        init(id: UInt64, owner: Address) {
            self.id = id
            self.owner = owner
            self.lat = nil
            self.lng = nil
            self.online = false
            self.lastUpdated = getCurrentBlock().timestamp
            self.totalUptime = 0.0
        }

        // Setter methods
        access(all) fun setLatLng(lat: UFix64, lng: UFix64) {
            self.lat = lat
            self.lng = lng
        }

        access(all) fun setOnlineStatus(online: Bool, currentTime: UFix64) {
            // If going from online to offline, add to total uptime
            if self.online && !online {
                self.totalUptime = self.totalUptime + (currentTime - self.lastUpdated)
            }
            
            self.online = online
            self.lastUpdated = currentTime
        }

        access(all) fun addUptime(amount: UFix64) {
            self.totalUptime = self.totalUptime + amount
        }
    }

    // Registry of all hotspots
    // Hotspot ID -> Hotspot Struct
    access(all) var hotspots: {UInt64: Hotspot}

    // Register a new hotspot
    access(all) fun registerHotspot(owner: Address, hotspotOperatorNFT: @HotspotOperatorNFT.NFT): @HotspotOperatorNFT.NFT {
        
        let newHotspotID = hotspotOperatorNFT.uuid
        
        let newHotspot = Hotspot(
            id: newHotspotID,
            owner: owner
        )
        
        HotspotRegistry.hotspots[newHotspotID] = newHotspot
        
        emit HotspotRegistered(id: newHotspot.id, owner: owner)
        
        return <-hotspotOperatorNFT
    }

    access(all) resource Admin {
        access(all) fun updateHotspotStatus(id: UInt64, online: Bool) {
            if var hotspot = &HotspotRegistry.hotspots[id] as &Hotspot? {
                let now = getCurrentBlock().timestamp
                
                // Update the hotspot status using the setter method
                hotspot.setOnlineStatus(online: online, currentTime: now)
                
                emit HotspotStatusChanged(id: id, online: online)
            }
        }

        // Update hotspot location
        access(all) fun updateHotspotLocation(id: UInt64, lat: UFix64, lng: UFix64) {
            if var hotspot = &HotspotRegistry.hotspots[id] as &Hotspot? {
                // Update location using the setter method
                hotspot.setLatLng(lat: lat, lng: lng)
                
                emit HotspotLocationUpdated(id: id, lat: lat, lng: lng)
            }
        }
    }

    access(all) view fun getHotspotByID(id: UInt64): Hotspot? {
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
    
    access(all) view fun getAllHotspots(): [Hotspot] {
        return HotspotRegistry.hotspots.values
    }
    
    init() {
        self.hotspots = {}

        self.AdminStoragePath = /storage/HotspotRegistryAdmin_1

        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
       
        emit ContractInitialized()
    }

} 