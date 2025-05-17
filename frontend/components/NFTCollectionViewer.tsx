'use client';

import { useEffect, useState } from 'react';
import { getUserNFTs } from '../services/flow';
import Card from './Card';

interface NFT {
	id: number;
	metadata: {
		name: string;
		description: string;
		thumbnail: string;
		type: string;
		traits: Record<string, string>;
	};
}

interface NFTCollectionViewerProps {
	userAddress: string;
}

export default function NFTCollectionViewer({
	userAddress,
}: NFTCollectionViewerProps) {
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

	useEffect(() => {
		const fetchNFTs = async () => {
			if (!userAddress) return;

			setIsLoading(true);
			try {
				const userNfts = await getUserNFTs(userAddress);
				setNfts(userNfts);
			} catch (err) {
				console.error('Error fetching NFTs:', err);
				setError('Failed to load NFTs. Please try again later.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNFTs();
	}, [userAddress]);

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
						You don't have any NFTs yet
					</p>
					<p className="text-gray-400">
						Mint your first Hotspot Operator NFT to get started.
					</p>
				</div>
			</Card>
		);
	}

	return (
		<div>
			<Card title="Your NFT Collection">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
					{nfts.map((nft) => (
						<div
							key={nft.id}
							className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
							onClick={() => handleNftClick(nft)}
						>
							<div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
								{/* <img
									src={
										nft.metadata.thumbnail ||
										'https://via.placeholder.com/400x300?text=NFT'
									}
									alt={nft.metadata.name}
									className="w-full h-full object-cover"
								/> */}
							</div>
							<div className="p-4">
								{/* <h3 className="font-semibold text-lg">
									{nft.metadata.name}
								</h3>
								<p className="text-sm text-gray-600 truncate">
									{nft.metadata.description}
								</p>
								<p className="text-xs mt-2 text-gray-500">
									ID: {nft.id}
								</p> */}
							</div>
						</div>
					))}
				</div>
			</Card>

			{/* NFT Detail Modal */}
			{selectedNft && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
						<div className="flex justify-between items-center p-4 border-b">
							<h2 className="text-xl font-semibold">
								{selectedNft.metadata.name}
							</h2>
							<button
								onClick={closeModal}
								className="text-gray-500 hover:text-gray-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6"
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

						<div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<img
									src={
										selectedNft.metadata.thumbnail ||
										'https://via.placeholder.com/400x300?text=NFT'
									}
									alt={selectedNft.metadata.name}
									className="w-full h-auto rounded-lg"
								/>
							</div>

							<div>
								<h3 className="font-semibold mb-2">Details</h3>
								<p className="text-gray-600 mb-4">
									{selectedNft.metadata.description}
								</p>

								<div className="mb-4">
									<h4 className="font-semibold text-sm text-gray-500 mb-1">
										ID
									</h4>
									<p>{selectedNft.id}</p>
								</div>

								<div className="mb-4">
									<h4 className="font-semibold text-sm text-gray-500 mb-1">
										Type
									</h4>
									<p>{selectedNft.metadata.type}</p>
								</div>

								{Object.keys(selectedNft.metadata.traits)
									.length > 0 && (
									<div>
										<h4 className="font-semibold text-sm text-gray-500 mb-1">
											Traits
										</h4>
										<div className="grid grid-cols-2 gap-2">
											{Object.entries(
												selectedNft.metadata.traits
											).map(([key, value]) => (
												<div
													key={key}
													className="bg-gray-100 p-2 rounded"
												>
													<span className="text-xs text-gray-500 block">
														{key}
													</span>
													<span className="font-medium">
														{value}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
