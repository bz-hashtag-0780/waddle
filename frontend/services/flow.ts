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

// Get a user's actual FLOW token balance
export const getFlowBalance = async (address: string): Promise<number> => {
	try {
		console.log('Fetching real FLOW balance for address:', address);

		// Use FCL's account API to get account details including balance
		const accountInfo = await fcl.account(address);
		console.log('Account info received:', accountInfo);

		// The balance can be either a number or a string
		if (accountInfo && accountInfo.balance !== undefined) {
			// Convert to number in case it's a string, then divide by 10^8 (FLOW uses 8 decimal places)
			const balanceAsNumber =
				typeof accountInfo.balance === 'string'
					? parseFloat(accountInfo.balance)
					: accountInfo.balance;

			const balanceAsFlow = balanceAsNumber / 100000000;
			console.log('Parsed FLOW balance:', balanceAsFlow);
			return balanceAsFlow;
		}

		console.warn(
			'Could not get FLOW balance from account info',
			accountInfo
		);
		return 0;
	} catch (error) {
		console.error('Error getting FLOW token balance:', error);
		// Return 0 on error to be safe
		return 0;
	}
};

// Get FIVEGCOIN balance for a user - using mock data for now
export const getFIVEGCOINBalance = async (address: string): Promise<number> => {
	try {
		console.log('Getting FIVEGCOIN balance for address:', address);

		// For demonstration purposes, return a hardcoded value
		// based on the first character of the address to make it unique per user
		const firstChar = address.charAt(2); // Skip 0x prefix
		const mockBalance = parseInt(firstChar, 16) || 1;
		return 100 + mockBalance * 10; // Higher than FLOW to make it obvious
	} catch (error) {
		console.error('Error getting FIVEGCOIN balance:', error);
		// Return a default value on error
		return 100.0;
	}
};

// Set up user account with required resources for NFTs and tokens
export const setupUserAccount = async (): Promise<string> => {
	try {
		console.log('Setting up user account (mock)');
		// In the real implementation, this would execute a transaction
		// For now, just return a mock transaction ID
		return 'mock-transaction-' + Date.now().toString();
	} catch (error) {
		console.error('Error setting up user account:', error);
		throw error;
	}
};

// Check if a user account is properly set up for NFTs and tokens
export const isUserAccountSetup = async (address: string): Promise<boolean> => {
	try {
		console.log('Checking account setup for address:', address);
		// For mock implementation, just return true
		return true;
	} catch (error) {
		console.error('Error checking account setup:', error);
		return false;
	}
};

// Get NFTs owned by a user
export const getUserNFTs = async (
	address: string
): Promise<Array<{ id: number; name: string }>> => {
	try {
		console.log('Getting NFTs for address:', address);
		// Return mock NFT data
		return [
			{ id: 1, name: 'Hotspot Operator #1' },
			{ id: 2, name: 'Hotspot Operator #2' },
		];
	} catch (error) {
		console.error('Error getting user NFTs:', error);
		return [];
	}
};
