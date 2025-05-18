'use client';

import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { getUserNFTs } from '../services/flow';
import Card from './Card';
import Image from 'next/image';

// Helper function to safely get displayable ID from any ID format
function getDisplayableId(
	id: number | string | { id: string; uuid: string } | unknown
): string {
	if (id === undefined || id === null) return 'unknown';
	if (typeof id === 'number') return id.toString();
	if (typeof id === 'string') return id;
	if (typeof id === 'object' && id !== null) {
		const objId = id as Record<string, string | number>;
		if ('id' in objId) return String(objId.id);
		if ('uuid' in objId) return String(objId.uuid);
	}
	return JSON.stringify(id);
}

interface NFT {
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
}

interface NFTCollectionViewerProps {
	userAddress: string;
}

// Define a ref interface for external methods
export interface NFTCollectionViewerRef {
	refreshCollection: () => void;
}

const NFTCollectionViewer = forwardRef<
	NFTCollectionViewerRef,
	NFTCollectionViewerProps
>(({ userAddress }, ref) => {
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
	const [refreshCounter, setRefreshCounter] = useState(0);

	// Function to manually refresh the NFT collection
	const refreshCollection = () => {
		console.log('Refreshing NFT collection...');
		setRefreshCounter((prev) => prev + 1);
		// Will trigger the useEffect since refreshCounter is a dependency
	};

	// Expose the refreshCollection method to parent components
	useImperativeHandle(ref, () => ({
		refreshCollection,
	}));

	useEffect(() => {
		const fetchNFTs = async () => {
			if (!userAddress) return;

			setIsLoading(true);
			setError(null);
			try {
				console.log('Fetching NFTs for address:', userAddress);
				// Use skipCache=true when refreshCounter > 0 to bypass caching
				const userNfts = await getUserNFTs(
					userAddress,
					refreshCounter > 0
				);

				// Debug the raw NFT data
				console.log(
					'Raw NFT data from getUserNFTs:',
					JSON.stringify(userNfts, null, 2)
				);
				console.log(
					'First NFT ID type:',
					userNfts[0] ? typeof userNfts[0].id : 'no NFTs'
				);
				if (userNfts[0] && typeof userNfts[0].id === 'object') {
					console.log(
						'First NFT ID object:',
						JSON.stringify(userNfts[0].id, null, 2)
					);
				}

				// Validate NFT data structure
				const validNfts = userNfts.filter((nft) => {
					// Check for required fields - more permissive validation
					const hasRequiredFields =
						nft &&
						nft.id !== undefined && // Just check if id exists, don't be strict about type
						nft.metadata &&
						typeof nft.metadata.name === 'string';

					if (!hasRequiredFields) {
						console.warn('Skipping malformed NFT data:', nft);
					} else {
						console.log(
							'Valid NFT found:',
							JSON.stringify(nft, null, 2)
						);
					}

					return hasRequiredFields;
				});

				// Log valid NFTs after filtering
				console.log('Valid NFTs after filtering:', validNfts);

				setNfts(validNfts);

				if (validNfts.length === 0 && userNfts.length > 0) {
					// We had NFTs but none were valid
					setError(
						'Some NFTs could not be displayed due to invalid data format'
					);
				}
			} catch (err) {
				console.error('Error fetching NFTs:', err);
				setError('Failed to load NFTs. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNFTs();
	}, [userAddress, refreshCounter]);

	const handleNftClick = (nft: NFT) => {
		setSelectedNft(nft);
	};

	const closeModal = () => {
		setSelectedNft(null);
	};

	if (isLoading) {
		return (
			<Card title="Your NFT Collection">
				<div className="flex justify-center items-center p-8">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</Card>
		);
	}

	if (error) {
		return (
			<Card title="Your NFT Collection">
				<div className="p-4 text-red-600 bg-red-50 rounded-md">
					{error}
				</div>
			</Card>
		);
	}

	if (nfts.length === 0) {
		return (
			<Card title="Your NFT Collection">
				<div className="p-6 text-center">
					<p className="text-xl text-gray-500 mb-4">
						You don&apos;t have any Hotspot Operator NFTs yet
					</p>
					<p className="text-gray-400">
						Mint your first Hotspot Operator NFT to get started
						using the mint button on the dashboard.
					</p>
				</div>
			</Card>
		);
	}

	return (
		<div>
			<Card title="Your NFT Collection">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
					{nfts.map((nft, index) => (
						<div
							key={getDisplayableId(nft.id)}
							className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50"
							onClick={() => handleNftClick(nft)}
						>
							<div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
								{nft.metadata.thumbnail ? (
									<Image
										src={nft.metadata.thumbnail}
										alt={nft.metadata.name}
										width={400}
										height={300}
										className="w-full h-full object-cover"
										unoptimized={true}
										priority={index === 0}
										onError={() => {
											console.warn(
												'Image failed to load:',
												nft.metadata.thumbnail
											);
										}}
									/>
								) : (
									// Fallback for NFTs without thumbnails
									<div className="flex items-center justify-center w-full h-full bg-gray-200">
										<span className="text-gray-500 text-lg font-medium">
											{nft.metadata.name
												.substring(0, 2)
												.toUpperCase()}
										</span>
									</div>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-semibold text-lg text-gray-800">
									{nft.metadata.name}
								</h3>
								<p className="text-sm text-gray-600 truncate">
									{nft.metadata.description}
								</p>
								<div className="mt-3 flex flex-wrap gap-2">
									{nft.metadata.traits &&
										Object.entries(nft.metadata.traits).map(
											([key, value]) => (
												<span
													key={key}
													className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
												>
													{key}: {value}
												</span>
											)
										)}
									{nft.metadata.serial && (
										<span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
											Serial: {nft.metadata.serial}
										</span>
									)}
								</div>
								<p className="text-xs mt-2 text-gray-500">
									ID: {getDisplayableId(nft.id)}
								</p>
							</div>
						</div>
					))}
				</div>
			</Card>

			{/* NFT Detail Modal */}
			{selectedNft && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl">
						<div className="flex justify-between items-center p-4 border-b">
							<h2 className="text-xl font-semibold text-gray-800">
								{selectedNft.metadata.name}
							</h2>
							<button
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-gray-100 rounded-lg p-2 relative">
								{selectedNft.metadata.thumbnail ? (
									<Image
										src={selectedNft.metadata.thumbnail}
										alt={selectedNft.metadata.name}
										width={600}
										height={400}
										className="w-full h-auto rounded-lg"
										unoptimized={true}
										onError={() => {
											console.warn(
												'Image failed to load:',
												selectedNft.metadata.thumbnail
											);
										}}
									/>
								) : (
									// Fallback for NFTs without thumbnails
									<div className="flex items-center justify-center w-full h-80 bg-gray-200 rounded-lg">
										<span className="text-gray-500 text-4xl font-medium">
											{selectedNft.metadata.name
												.substring(0, 2)
												.toUpperCase()}
										</span>
									</div>
								)}
							</div>

							<div>
								<h3 className="font-semibold mb-2 text-gray-800">
									Details
								</h3>
								<p className="text-gray-600 mb-4">
									{selectedNft.metadata.description}
								</p>

								<div className="mb-4">
									<h4 className="font-semibold text-sm text-gray-500 mb-1">
										ID
									</h4>
									<p className="text-gray-800">
										{getDisplayableId(selectedNft.id)}
									</p>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-sm text-gray-500 mb-1">
										Type
									</h4>
									<p className="text-gray-800">
										{selectedNft.metadata.type ||
											'Hotspot Operator'}
									</p>
								</div>

								{selectedNft.rewardsVault && (
									<div className="mb-4">
										<h4 className="font-semibold text-sm text-gray-500 mb-1">
											Rewards Balance
										</h4>
										<p className="text-gray-800">
											{parseFloat(
												selectedNft.rewardsVault
													.balance || '0'
											).toFixed(2)}{' '}
											$5G
										</p>
									</div>
								)}

								{selectedNft.metadata.serial && (
									<div className="mb-4">
										<h4 className="font-semibold text-sm text-gray-500 mb-1">
											Serial Number
										</h4>
										<p className="text-gray-800">
											{selectedNft.metadata.serial}
										</p>
									</div>
								)}

								{selectedNft.metadata.traits &&
									Object.keys(selectedNft.metadata.traits)
										.length > 0 && (
										<div>
											<h4 className="font-semibold text-sm text-gray-500 mb-2">
												Traits
											</h4>
											<div className="grid grid-cols-2 gap-2">
												{Object.entries(
													selectedNft.metadata.traits
												).map(([key, value]) => (
													<div
														key={key}
														className="bg-gray-100 p-3 rounded-lg"
													>
														<span className="text-xs text-gray-500 block capitalize">
															{key}
														</span>
														<span className="font-medium text-gray-800">
															{value}
														</span>
													</div>
												))}
											</div>
										</div>
									)}

								<div className="mt-6 pt-4 border-t">
									<button
										className="w-full py-2 px-4 bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)] text-white font-medium rounded-lg transition-colors"
										onClick={closeModal}
									>
										Use this NFT
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
});

// Add display name
NFTCollectionViewer.displayName = 'NFTCollectionViewer';

export default NFTCollectionViewer;
