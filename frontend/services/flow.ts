/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fcl from '@onflow/fcl';
import { Hotspot, UptimeStats } from '../types/flow';
import { Magic as MagicBase } from 'magic-sdk';
import { FlowExtension } from '@magic-ext/flow';

// Define Magic type correctly
export type Magic = MagicBase<[FlowExtension]>;

// Define an interface for raw NFT data coming from the blockchain
interface RawNFTData {
	id?: { id: string; uuid: string } | string;
	uuid?: string;
	metadata?: {
		name?: string;
		description?: string;
		thumbnail?: string;
		type?: string;
		traits?: Record<string, string>;
		createdAt?: string;
		serial?: string;
	};
	rewardsVault?: {
		balance: string;
		uuid: string;
	};
}

// Add an interface for Flow event types
interface FlowEvent {
	type: string;
	transactionId: string;
	transactionIndex: number;
	eventIndex: number;
	data: {
		id?: string | number;
		[key: string]: any;
	};
}

// Define Magic instance type
interface MagicInstance {
	flow: {
		authorization: any;
	};
}

// Mint NFT Commit Transaction - Works
export const mintNFTCommit = async (magic: Magic): Promise<string> => {
	try {
		console.log('Executing NFT mint commit transaction');

		const transactionId = await fcl.mutate({
			cadence: `
			// mintNFTcommit.cdc
//
// This transaction commits to minting a new HotspotOperatorNFT
// using the RandomPicker to ensure fair and verifiable randomness.
// 
// Note: You must run the setupHotspotOperatorNFTCollection transaction first
// to set up your account to receive NFTs.

import HotspotOperatorNFT from 0xcc6a3536f37381a2
import RandomPicker from 0xcc6a3536f37381a2

transaction {
    prepare(acct: auth(Storage) &Account) {
        // Check if receipt already exists and remove it to avoid conflicts
        if acct.storage.borrow<&RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath) != nil {
            // In Cadence 1.0, we need to load and destroy the existing receipt
            let oldReceipt <- acct.storage.load<@RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath)
            destroy oldReceipt
        }
        
        // Create a new RandomPicker Receipt for committing to a random NFT
        let receipt: @RandomPicker.Receipt <- HotspotOperatorNFT.mintNFTCommit()
        
        // Save the receipt to storage for later use in the reveal transaction
        acct.storage.save(<-receipt, to: RandomPicker.ReceiptStoragePath)
        
    }
}

			`,
			proposer: magic.flow.authorization,
			authorizations: [magic.flow.authorization],
			payer: magic.flow.authorization,
			limit: 999,
		});

		console.log('NFT mint commit transaction submitted:', transactionId);
		return transactionId;
	} catch (error) {
		console.error('Error in NFT mint commit transaction:', error);
		throw error;
	}
};

// Mint NFT Reveal Transaction - Works
export const mintNFTReveal = async (magic: Magic): Promise<string> => {
	try {
		console.log('Executing NFT mint reveal transaction');

		const transactionId = await fcl.mutate({
			cadence: `
			
// mintNFTreveal.cdc
//
// This transaction reveals the random selection and completes the minting of a new HotspotOperatorNFT
// This must be executed after running mintNFTcommit.cdc and waiting at least one block.

import HotspotOperatorNFT from 0xcc6a3536f37381a2
import RandomPicker from 0xcc6a3536f37381a2
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction {
    prepare(acct: auth(Storage, IssueStorageCapabilityController, PublishCapability) &Account) {
        // Check if the user has a receipt from the commit step
        let receipt <- acct.storage.load<@RandomPicker.Receipt>(from: RandomPicker.ReceiptStoragePath)
            ?? panic("No receipt found. Make sure you've run mintNFTcommit.cdc first and waited at least one block")
        
        // Create a collection for the user if they don't already have one
        if acct.storage.borrow<&HotspotOperatorNFT.Collection>(from: HotspotOperatorNFT.CollectionStoragePath) == nil {
            let collection <- HotspotOperatorNFT.createEmptyCollection(nftType: Type<@HotspotOperatorNFT.NFT>())
            
            acct.storage.save(<-collection, to: HotspotOperatorNFT.CollectionStoragePath)
            
            let collectionCap = acct.capabilities.storage.issue<&HotspotOperatorNFT.Collection>(HotspotOperatorNFT.CollectionStoragePath)

            acct.capabilities.publish(collectionCap, at: HotspotOperatorNFT.CollectionPublicPath)
        }
        
        // Get the user's collection reference to receive the NFT
        let collectionRef = acct.storage.borrow<&HotspotOperatorNFT.Collection>(
            from: HotspotOperatorNFT.CollectionStoragePath
        ) ?? panic("Could not borrow reference to HotspotOperatorNFT collection")
        
        // Call the reveal function to mint the NFT with random properties
        HotspotOperatorNFT.mintNFTReveal(
            recipient: collectionRef as &{HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic},
            receipt: <-receipt
        )
        
    }
}

			
			`,
			proposer: magic.flow.authorization,
			authorizations: [magic.flow.authorization],
			payer: magic.flow.authorization,
			limit: 999,
		});

		console.log('NFT mint reveal transaction submitted:', transactionId);
		return transactionId;
	} catch (error) {
		console.error('Error in NFT mint reveal transaction:', error);
		throw error;
	}
};

// Complete NFT Minting Process (Commit then Reveal)
export const mintNFTComplete = async (
	magic: Magic
): Promise<{
	commitTxId: string;
	revealTxId: string;
}> => {
	try {
		// Step 1: Execute the commit transaction
		const commitTxId = await mintNFTCommit(magic);

		// Step 2: Wait for the commit transaction to be sealed
		console.log('Waiting for commit transaction to be sealed...');
		const commitTxResult = await fcl.tx(commitTxId).onceSealed();
		console.log('Commit transaction sealed:', commitTxResult);

		// Step 3: Execute the reveal transaction
		const revealTxId = await mintNFTReveal(magic);

		return {
			commitTxId,
			revealTxId,
		};
	} catch (error) {
		console.error('Error in complete NFT minting process:', error);
		throw error;
	}
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

// Register a new hotspot
export const registerHotspot = async (
	magic: MagicInstance,
	nftID: number
): Promise<string> => {
	try {
		console.log(`Registering hotspot with NFT ID: ${nftID}`);

		const transactionId = await fcl.mutate({
			cadence: `
import HotspotRegistry from 0xHotspotRegistry
import HotspotOperatorNFT from 0xHotspotOperatorNFT
import NonFungibleToken from 0xNonFungibleToken

transaction(nftID: UInt64) {
    prepare(acct: auth(Storage) &Account) {

        let collectionRef = acct.storage.borrow<auth(NonFungibleToken.Withdraw) &HotspotOperatorNFT.Collection>(from: HotspotOperatorNFT.CollectionStoragePath)?? panic("Could not borrow operator collection reference")
        
        let nft <- HotspotRegistry.registerHotspot(
            owner: acct.address,
            hotspotOperatorNFT: <-collectionRef.withdraw(withdrawID: nftID) as! @HotspotOperatorNFT.NFT
        )

        collectionRef.deposit(token: <-nft)
    }
}
      `,
			args: (arg, t) => [arg(nftID.toString(), t.UInt64)],
			payer: magic.flow.authorization,
			proposer: magic.flow.authorization,
			authorizations: [magic.flow.authorization],
			limit: 999,
		});

		console.log(
			`Hotspot registration transaction submitted: ${transactionId}`
		);
		return transactionId;
	} catch (error) {
		console.error('Error registering hotspot:', error);
		throw error;
	}
};

// Complete hotspot registration process (submit and wait for sealing)
export const registerHotspotComplete = async (
	magic: MagicInstance,
	nftID: number
): Promise<{ transactionId: string; hotspotId?: string }> => {
	try {
		// Submit the registration transaction
		const transactionId = await registerHotspot(magic, nftID);

		console.log(
			`Waiting for hotspot registration transaction ${transactionId} to be sealed...`
		);

		// Wait for the transaction to be sealed
		const txResult = await fcl.tx(transactionId).onceSealed();
		console.log('Hotspot registration transaction sealed:', txResult);

		// Try to extract the hotspot ID from transaction events
		const hotspotRegisteredEvent = txResult.events.find(
			(event: FlowEvent) =>
				event.type.includes('HotspotRegistry.HotspotRegistered')
		);

		let hotspotId: string | undefined;

		if (hotspotRegisteredEvent) {
			hotspotId = hotspotRegisteredEvent.data.id.toString();
			console.log(`Extracted hotspot ID from event: ${hotspotId}`);
		} else {
			console.log('No HotspotRegistered event found in transaction');
		}

		return {
			transactionId,
			hotspotId,
		};
	} catch (error) {
		console.error('Error in complete hotspot registration process:', error);
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

// Get all registered hotspots
export const getAllHotspots = async (): Promise<Hotspot[]> => {
	try {
		console.log('Fetching all hotspots from the blockchain...');

		// Call the actual script to get hotspots from the blockchain
		const result = await fcl.query({
			cadence: `
				import HotspotRegistry from 0xcc6a3536f37381a2      

				access(all) fun main(): [HotspotRegistry.Hotspot] {
					return HotspotRegistry.getAllHotspots()
				}
			`,
		});

		console.log(
			'Received raw hotspot data from blockchain:',
			JSON.stringify(result)
		);

		if (!result || !Array.isArray(result)) {
			console.error('Unexpected response format:', result);
			return [];
		}

		if (result.length === 0) {
			console.log('No hotspots found in registry');
			return [];
		}

		// Log data structure of first item to help with debugging
		const firstItem = result[0];
		console.log('First hotspot data structure:', JSON.stringify(firstItem));

		// Transform the returned data into the Hotspot format
		const mappedHotspots = result.map((hotspotData: any, index) => {
			console.log(
				`Processing hotspot ${index}:`,
				JSON.stringify(hotspotData)
			);

			// Check if the data is already in the format we expect
			if (hotspotData.id !== undefined) {
				console.log(`Hotspot ${index} has direct properties`);
				return {
					id: Number(hotspotData.id),
					owner: hotspotData.owner,
					lat: hotspotData.lat ? parseFloat(hotspotData.lat) : null,
					lng: hotspotData.lng ? parseFloat(hotspotData.lng) : null,
					online: hotspotData.online,
					lastUpdated: parseFloat(hotspotData.lastUpdated),
					totalUptime: parseFloat(hotspotData.totalUptime),
				};
			}

			// If it's wrapped in a "HotspotRegistry.Hotspot" property
			if (hotspotData['HotspotRegistry.Hotspot']) {
				console.log(
					`Hotspot ${index} is wrapped in HotspotRegistry.Hotspot`
				);
				const hotspot = hotspotData['HotspotRegistry.Hotspot'];
				return {
					id: Number(hotspot.id),
					owner: hotspot.owner,
					lat: hotspot.lat ? parseFloat(hotspot.lat) : null,
					lng: hotspot.lng ? parseFloat(hotspot.lng) : null,
					online: hotspot.online,
					lastUpdated: parseFloat(hotspot.lastUpdated),
					totalUptime: parseFloat(hotspot.totalUptime),
				};
			}

			// If we can't figure out the format, log an error and return a placeholder
			console.error(
				`Unexpected format for hotspot ${index}:`,
				hotspotData
			);
			return {
				id: index,
				owner: 'unknown',
				lat: null,
				lng: null,
				online: false,
				lastUpdated: 0,
				totalUptime: 0,
			};
		});

		console.log('Successfully processed hotspots:', mappedHotspots.length);
		return mappedHotspots;
	} catch (error) {
		console.error('Error getting all hotspots:', error);

		// Return empty array on error
		return [];
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
		console.log('Checking if address owns a HotspotOperatorNFT:', address);

		// Query the blockchain to check if the user owns any HotspotOperatorNFTs
		const result = await fcl.query({
			cadence: `
				import HotspotOperatorNFT from 0xcc6a3536f37381a2
				import NonFungibleToken from 0x631e88ae7f1d7c20

				access(all) fun main(address: Address): Bool {
					// Get the public account object for the address
					let account = getAccount(address)
					
					// Try to borrow the collection capabilities
					if let collectionRef = account.capabilities.borrow<&{HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic}>(HotspotOperatorNFT.CollectionPublicPath) {
						let ids = collectionRef.getIDs()
						var collection: [&HotspotOperatorNFT.NFT] = []

						return ids.length > 0
					}
						
					
						return false
				}
			`,
			args: (arg, t) => [arg(address, t.Address)],
		});

		console.log('NFT ownership check result:', result);
		return Boolean(result);
	} catch (error) {
		console.error('Error checking NFT ownership:', error);
		// Return false on error to be safe
		return false;
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

// Get NFTs owned by a user - Enhanced with proper error handling and data normalization
export const getUserNFTs = async (
	address: string,
	skipCache: boolean = false
): Promise<
	Array<{
		id:
			| number
			| string
			| {
					id: string;
					uuid: string;
			  };
		metadata: {
			name: string;
			description: string;
			thumbnail: string;
			type?: string;
			traits?: Record<string, string>;
			createdAt?: string;
			serial?: string;
		};
		rewardsVault?: {
			balance: string;
			uuid: string;
		};
	}>
> => {
	try {
		// Log whether we're skipping cache or not
		console.log(
			`Getting NFTs for address: ${address}${
				skipCache ? ' (bypassing cache)' : ''
			}`
		);

		// Execute a simpler FCL script that just gets the NFT IDs
		const nftData = await fcl.query({
			cadence: `
				import HotspotOperatorNFT from 0xcc6a3536f37381a2
				import NonFungibleToken from 0x631e88ae7f1d7c20
				
				access(all) fun main(address: Address): [&HotspotOperatorNFT.NFT] {
					let account = getAccount(address)
					
					// Try to borrow the collection capabilities
					if let collectionRef = account.capabilities.borrow<&{HotspotOperatorNFT.HotspotOperatorNFTCollectionPublic}>(HotspotOperatorNFT.CollectionPublicPath) {
						let ids = collectionRef.getIDs()
						var collection: [&HotspotOperatorNFT.NFT] = []
						for id in ids {
							let nft = collectionRef.borrowHotspotOperator(id: id)!
							collection.append(nft)
						}
						return collection
					}
					
					return []
				}
			`,
			args: (arg, t) => [arg(address, t.Address)],
			// If skipCache is true, tell FCL not to use cached results
			...(skipCache ? { skipCache: true } : {}),
		});

		console.log('NFT data fetched from blockchain:', nftData);
		console.log(
			'NFT data first item (raw):',
			nftData[0] ? JSON.stringify(nftData[0], null, 2) : 'no items'
		);

		if (!nftData || nftData.length === 0) {
			return [];
		}

		// Process the raw NFT data into our expected format
		const formattedNfts = nftData.map((nft: RawNFTData) => {
			// Check if this is already in the expected format
			if (nft && typeof nft === 'object') {
				const formattedNft = {
					id: nft.id ||
						nft.uuid || { id: 'unknown', uuid: 'unknown' },
					metadata: {
						name: nft.metadata?.name || 'Unnamed NFT',
						description:
							nft.metadata?.description ||
							'No description available',
						thumbnail: nft.metadata?.thumbnail || '',
						type: nft.metadata?.type || 'HotspotOperator',
						traits: nft.metadata?.traits || {},
						createdAt: nft.metadata?.createdAt,
						serial: nft.metadata?.serial,
					},
					rewardsVault: nft.rewardsVault,
				};

				// Debug the formatted NFT's ID
				console.log(`Formatted NFT ID type: ${typeof formattedNft.id}`);
				console.log(`Formatted NFT ID value:`, formattedNft.id);

				return formattedNft;
			}

			// Fallback for unknown format
			return {
				id:
					typeof nft === 'number' || typeof nft === 'string'
						? nft
						: { id: 'unknown', uuid: 'unknown' },
				metadata: {
					name: 'Unknown NFT',
					description: 'NFT with unrecognized format',
					thumbnail: '',
					type: 'Unknown',
				},
			};
		});

		console.log('Formatted NFTs:', formattedNfts);
		return formattedNfts;
	} catch (error) {
		console.error('Error getting user NFTs:', error);
		console.log('Using fallback mock data due to error');

		// Return mock data as fallback but now using GitHub URLs for images
		return [
			{
				id: 1,
				metadata: {
					name: 'Hotspot Operator #1',
					description:
						'A 5G Hotspot Operator NFT with standard range capabilities',
					thumbnail:
						'https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_1.png',
					type: 'HotspotOperator',
					traits: {
						rarity: 'Common',
						range: '500m',
						power: 'Standard',
						frequency: '5G Mid-band',
					},
				},
			},
			{
				id: 2,
				metadata: {
					name: 'Hotspot Operator #2',
					description:
						'A premium 5G Hotspot Operator NFT with extended range',
					thumbnail:
						'https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_2.png',
					type: 'HotspotOperator',
					traits: {
						rarity: 'Rare',
						range: '750m',
						power: 'Enhanced',
						frequency: '5G Mid-band',
					},
				},
			},
			{
				id: 3,
				metadata: {
					name: 'Ultra Range Hotspot',
					description:
						'An ultra-rare 5G Hotspot Operator NFT with maximum range and power capabilities',
					thumbnail:
						'https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_operator_3.png',
					type: 'HotspotOperator',
					traits: {
						rarity: 'Ultra Rare',
						range: '1200m',
						power: 'Maximum',
						frequency: '5G Mid-band',
						bonus: '+20% Rewards',
					} as Record<string, string>,
				},
			},
		];
	}
};
