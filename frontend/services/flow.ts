import * as fcl from '@onflow/fcl';
// Note: t is used in the arg callbacks for transaction arguments
import * as t from '@onflow/types';
import { Hotspot, UptimeStats } from '../types/flow';

// Contract addresses (updated with testnet deployed contract addresses)
const CONTRACT_ADDRESSES = {
	HotspotOperatorNFT: '0x010f2d483a538e7e',
	HotspotRegistry: '0x010f2d483a538e7e',
	UptimeProof: '0x010f2d483a538e7e',
	RewardToken: '0x010f2d483a538e7e',
};

// Mint an NFT for a user (simulation mode)
export const mintHotspotOperatorNFT = async (
	recipientAddress: string,
	name: string,
	description: string,
	thumbnail: string
): Promise<string> => {
	try {
		const transactionId = await fcl.mutate({
			cadence: `
        import HotspotOperatorNFT from ${CONTRACT_ADDRESSES.HotspotOperatorNFT}

        transaction(recipientAddress: Address, name: String, description: String, thumbnail: String) {
          let minterRef: &HotspotOperatorNFT.NFTMinter
          
          prepare(signer: AuthAccount) {
            self.minterRef = signer.borrow<&HotspotOperatorNFT.NFTMinter>(
              from: HotspotOperatorNFT.MinterStoragePath
            ) ?? panic("Could not borrow minter reference")
          }
          
          execute {
            // For simulation, we'll just log the action
            log("Simulating minting NFT for: ".concat(recipientAddress.toString()))
          }
        }
      `,
			args: (arg, t) => [
				arg(recipientAddress, t.Address),
				arg(name, t.String),
				arg(description, t.String),
				arg(thumbnail, t.String),
			],
			payer: fcl.authz,
			proposer: fcl.authz,
			authorizations: [fcl.authz],
			limit: 999,
		});

		return transactionId;
	} catch (error) {
		console.error('Error minting NFT:', error);
		throw error;
	}
};

// Register a new hotspot (simulation mode)
export const registerHotspot = async (
	lat: number,
	lng: number
): Promise<string> => {
	try {
		const transactionId = await fcl.mutate({
			cadence: `
        import HotspotRegistry from ${CONTRACT_ADDRESSES.HotspotRegistry}

        transaction(lat: UFix64, lng: UFix64) {
          let adminRef: &HotspotRegistry.Admin
          
          prepare(signer: AuthAccount) {
            self.adminRef = signer.borrow<&HotspotRegistry.Admin>(
              from: HotspotRegistry.AdminStoragePath
            ) ?? panic("Could not borrow admin reference")
          }
          
          execute {
            // For simulation, we'll just log the action
            log("Simulating registering hotspot at coordinates: ".concat(lat.toString()).concat(", ").concat(lng.toString()))
          }
        }
      `,
			args: (arg, t) => [
				arg(lat.toFixed(6), t.UFix64),
				arg(lng.toFixed(6), t.UFix64),
			],
			payer: fcl.authz,
			proposer: fcl.authz,
			authorizations: [fcl.authz],
			limit: 999,
		});

		return transactionId;
	} catch (error) {
		console.error('Error registering hotspot:', error);
		throw error;
	}
};

// Submit an uptime proof (simulation mode)
export const submitUptimeProof = async (
	hotspotID: number,
	duration: number,
	signalStrength: number
): Promise<string> => {
	try {
		const transactionId = await fcl.mutate({
			cadence: `
        import UptimeProof from ${CONTRACT_ADDRESSES.UptimeProof}

        transaction(hotspotID: UInt64, duration: UFix64, signalStrength: UFix64) {
          let adminRef: &UptimeProof.Admin
          
          prepare(signer: AuthAccount) {
            self.adminRef = signer.borrow<&UptimeProof.Admin>(
              from: UptimeProof.AdminStoragePath
            ) ?? panic("Could not borrow admin reference")
          }
          
          execute {
            // For simulation, we'll just log the action
            log("Simulating uptime proof for hotspot ID: ".concat(hotspotID.toString()))
          }
        }
      `,
			args: (arg, t) => [
				arg(hotspotID, t.UInt64),
				arg(duration.toFixed(6), t.UFix64),
				arg(signalStrength.toFixed(6), t.UFix64),
			],
			payer: fcl.authz,
			proposer: fcl.authz,
			authorizations: [fcl.authz],
			limit: 999,
		});

		return transactionId;
	} catch (error) {
		console.error('Error submitting uptime proof:', error);
		throw error;
	}
};

// Get all registered hotspots (simulation mode)
export const getAllHotspots = async (): Promise<Hotspot[]> => {
	try {
		// For simulation, return mock data
		return [
			{
				id: 1,
				owner: '0x01',
				lat: 37.7749,
				lng: -122.4194,
				online: true,
				lastUpdated: Date.now(),
				totalUptime: 3600, // 1 hour in seconds
			},
			{
				id: 2,
				owner: '0x02',
				lat: 40.7128,
				lng: -74.006,
				online: false,
				lastUpdated: Date.now() - 3600000, // 1 hour ago
				totalUptime: 7200, // 2 hours in seconds
			},
			{
				id: 3,
				owner: '0x03',
				lat: 34.0522,
				lng: -118.2437,
				online: true,
				lastUpdated: Date.now(),
				totalUptime: 1800, // 30 minutes in seconds
			},
		];
	} catch (error) {
		console.error('Error getting all hotspots:', error);
		throw error;
	}
};

// Get uptime statistics for a hotspot (simulation mode)
export const getHotspotUptimeStats = async (
	hotspotID: number
): Promise<UptimeStats> => {
	try {
		// For simulation, return mock data
		return {
			totalUptime: hotspotID * 1800, // Each hotspot has different uptime
			averageSignalStrength: 85.5, // Out of 100
			proofCount: hotspotID * 5,
		};
	} catch (error) {
		console.error('Error getting hotspot uptime stats:', error);
		throw error;
	}
};

// Check if an account owns an NFT (simulation mode)
export const checkHotspotOperatorNFTOwnership = async (
	address: string
): Promise<boolean> => {
	try {
		// For simulation, return true if address ends with '1'
		return address.endsWith('1');
	} catch (error) {
		console.error('Error checking NFT ownership:', error);
		throw error;
	}
};
