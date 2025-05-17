'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMagic } from '@/contexts/MagicContext';
import NFTMinter from '@/components/NFTMinter';
import NFTCollectionViewer, {
	NFTCollectionViewerRef,
} from '@/components/NFTCollectionViewer';
import Layout from '@/components/Layout';

export default function NFTsPage() {
	const { user, isInitialized, isAuthenticated } = useAuth();
	const { magic, isInitializing } = useMagic();
	const [userAddress, setUserAddress] = useState<string>('');
	const [showRefresh, setShowRefresh] = useState(false);
	// Create a ref to access the NFTCollectionViewer methods
	const collectionViewerRef = useRef<NFTCollectionViewerRef>(null);

	useEffect(() => {
		if (isAuthenticated && user?.addr) {
			setUserAddress(user.addr);
		}
	}, [isAuthenticated, user]);

	const handleMintSuccess = () => {
		// Show refresh button after minting
		setShowRefresh(true);

		// Try to refresh the collection automatically after minting
		if (collectionViewerRef.current) {
			// Small delay to ensure transaction has time to be processed
			setTimeout(() => {
				collectionViewerRef.current?.refreshCollection();
			}, 2000);
		}
	};

	const handleRefreshCollection = () => {
		console.log('Refresh collection button clicked');
		// Use the ref method to refresh the collection
		if (collectionViewerRef.current) {
			collectionViewerRef.current.refreshCollection();
		}
	};

	if (!isInitialized || isInitializing) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<Layout>
				<div className="bg-yellow-50 p-4 rounded-md text-center">
					<h2 className="text-xl font-semibold text-yellow-800 mb-2">
						Authentication Required
					</h2>
					<p className="text-yellow-700">
						Please log in to access this page.
					</p>
				</div>
			</Layout>
		);
	}

	if (!magic) {
		return (
			<Layout>
				<div className="bg-red-50 p-4 rounded-md text-center">
					<h2 className="text-xl font-semibold text-red-800 mb-2">
						Magic.link Not Available
					</h2>
					<p className="text-red-700">
						Magic.link is not initialized. Please refresh the page
						or try again later.
					</p>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				<div className="md:flex md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Hotspot Operator NFTs
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Mint and manage your hotspot operator NFTs
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					<div>
						<NFTMinter onSuccess={handleMintSuccess} />
					</div>

					<div>
						<div className="bg-white rounded-lg shadow-md p-4 mb-4">
							<h2 className="text-gray-900 text-xl font-semibold mb-2">
								How It Works
							</h2>
							<p className="text-gray-700 mb-3">
								Hotspot Operator NFTs are special tokens that
								grant you the ability to operate hotspots on our
								decentralized 5G network.
							</p>
							<ol className="list-decimal pl-5 space-y-2 text-gray-700">
								<li>
									Mint your NFT using the form on the left
								</li>
								<li>
									Wait for both transactions to complete
									(commit and reveal)
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

				{userAddress && (
					<NFTCollectionViewer
						ref={collectionViewerRef}
						userAddress={userAddress}
					/>
				)}
			</div>
		</Layout>
	);
}
