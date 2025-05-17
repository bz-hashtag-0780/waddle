'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMagic } from '../../contexts/MagicContext';
import NFTMinter from '../../components/NFTMinter';
import NFTCollectionViewer from '../../components/NFTCollectionViewer';

export default function NFTsPage() {
	const { user, isInitialized, isAuthenticated } = useAuth();
	const { magic, isInitializing } = useMagic();
	const [userAddress, setUserAddress] = useState<string>('');
	const [showRefresh, setShowRefresh] = useState(false);

	useEffect(() => {
		if (isAuthenticated && user?.addr) {
			setUserAddress(user.addr);
		}
	}, [isAuthenticated, user]);

	const handleMintSuccess = () => {
		// Show refresh button to reload the collection after minting
		setShowRefresh(true);
	};

	const handleRefreshCollection = () => {
		// Force re-render of collection by updating the key
		setShowRefresh(false);
		// Small timeout to ensure state updates properly
		setTimeout(() => {
			setUserAddress((prev) =>
				prev ? `${prev}_refreshed_${Date.now()}` : ''
			);
			// Re-set the actual address after the refresh
			setTimeout(() => {
				if (user?.addr) {
					setUserAddress(user.addr);
				}
			}, 100);
		}, 100);
	};

	if (!isInitialized || isInitializing) {
		return (
			<div className="container mx-auto p-4">
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto p-4">
				<div className="bg-yellow-50 p-4 rounded-md text-center">
					<h2 className="text-xl font-semibold text-yellow-800 mb-2">
						Authentication Required
					</h2>
					<p className="text-yellow-700">
						Please log in to access this page.
					</p>
				</div>
			</div>
		);
	}

	if (!magic) {
		return (
			<div className="container mx-auto p-4">
				<div className="bg-red-50 p-4 rounded-md text-center">
					<h2 className="text-xl font-semibold text-red-800 mb-2">
						Magic.link Not Available
					</h2>
					<p className="text-red-700">
						Magic.link is not initialized. Please refresh the page
						or try again later.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Hotspot Operator NFTs</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<div>
					<NFTMinter onSuccess={handleMintSuccess} />
				</div>

				<div>
					<div className="bg-white rounded-lg shadow-md p-4 mb-4">
						<h2 className="text-xl font-semibold mb-2">
							How It Works
						</h2>
						<p className="text-gray-700 mb-3">
							Hotspot Operator NFTs are special tokens that grant
							you the ability to operate hotspots on our
							decentralized 5G network.
						</p>
						<ol className="list-decimal pl-5 space-y-2 text-gray-700">
							<li>Mint your NFT using the form on the left</li>
							<li>
								Wait for both transactions to complete (commit
								and reveal)
							</li>
							<li>
								Your new NFT will appear in your collection
								below
							</li>
							<li>
								Use your NFT to register a hotspot and start
								earning rewards
							</li>
						</ol>
					</div>
				</div>
			</div>

			{showRefresh && (
				<div className="flex justify-end mb-4">
					<button
						onClick={handleRefreshCollection}
						className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
					>
						Refresh Collection
					</button>
				</div>
			)}

			{userAddress && <NFTCollectionViewer userAddress={userAddress} />}
		</div>
	);
}
