'use client';

import { useState, useEffect } from 'react';
import { registerHotspotComplete, getUserNFTs } from '@/services/flow';
import { useMagic } from '@/contexts/MagicContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from './Button';
import Card from './Card';

interface HotspotRegistrationProps {
	onSuccess?: (hotspotId: string) => void;
}

interface NFT {
	id: number | string | { id: string; uuid: string };
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

type StepState = 'idle' | 'registering' | 'complete';

export default function HotspotRegistration({
	onSuccess,
}: HotspotRegistrationProps) {
	const { magic } = useMagic();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [txId, setTxId] = useState<string | null>(null);
	const [hotspotId, setHotspotId] = useState<string | null>(null);
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
	const [isLoadingNFTs, setIsLoadingNFTs] = useState<boolean>(true);
	const [step, setStep] = useState<StepState>('idle');

	// Fetch user's NFTs
	useEffect(() => {
		const fetchNFTs = async () => {
			if (!user?.address) return;

			try {
				setIsLoadingNFTs(true);
				const userNFTs = await getUserNFTs(user.address);
				setNfts(userNFTs);
				if (userNFTs.length > 0) {
					setSelectedNftId(Number(userNFTs[0].id));
				}
			} catch (err) {
				console.error('Error fetching NFTs:', err);
				setError('Failed to load your NFTs. Please try again.');
			} finally {
				setIsLoadingNFTs(false);
			}
		};

		if (user) {
			fetchNFTs();
		}
	}, [user]);

	const handleRegisterHotspot = async () => {
		if (!magic) {
			setError('Magic not initialized. Please try again.');
			return;
		}

		if (selectedNftId === null) {
			setError('Please select an NFT to use for hotspot registration.');
			return;
		}

		setIsLoading(true);
		setError(null);
		setStep('registering');

		try {
			// Execute the registration process
			const result = await registerHotspotComplete(magic, selectedNftId);

			// Update state with transaction ID and hotspot ID if available
			setTxId(result.transactionId);
			if (result.hotspotId) {
				setHotspotId(result.hotspotId);
			}
			setStep('complete');

			// Call onSuccess callback if provided
			if (onSuccess && result.hotspotId) {
				onSuccess(result.hotspotId);
				console.log(
					'Hotspot registration completed successfully, new hotspot ID:',
					result.hotspotId
				);
			}
		} catch (error) {
			console.error('Error registering hotspot:', error);
			setError(
				error instanceof Error
					? error.message
					: 'Failed to register hotspot. Please try again.'
			);
			setStep('idle');
		} finally {
			setIsLoading(false);
		}
	};

	const renderStepMessage = () => {
		switch (step) {
			case 'registering':
				return 'Registering your hotspot...';
			case 'complete':
				return 'Hotspot registration successful!';
			default:
				return 'Select an NFT to register a new hotspot';
		}
	};

	const renderTransactionInfo = () => {
		if (!txId) return null;

		return (
			<div className="mt-4 text-sm">
				<p className="text-gray-900 font-semibold">Transaction ID:</p>
				<p className="text-gray-600 break-all">{txId}</p>
				{hotspotId && (
					<div className="mt-2">
						<p className="text-gray-900 font-semibold">
							Hotspot ID:
						</p>
						<p className="text-gray-600 break-all">{hotspotId}</p>
					</div>
				)}
			</div>
		);
	};

	const renderForm = () => {
		if (step === ('complete' as StepState)) {
			return (
				<div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 w-full text-center">
					Your hotspot has been successfully registered! You can now
					view it in your dashboard.
				</div>
			);
		}

		return (
			<div className="space-y-4">
				<div>
					<label
						htmlFor="nft"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Select NFT for Registration
					</label>
					{isLoadingNFTs ? (
						<div className="animate-pulse bg-gray-200 rounded h-10 w-full"></div>
					) : nfts.length === 0 ? (
						<div className="bg-yellow-50 text-yellow-600 p-3 rounded-md mb-4 w-full">
							You don&apos;t have any NFTs to register. Please
							mint an NFT first.
						</div>
					) : (
						<select
							id="nft"
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							value={selectedNftId || ''}
							onChange={(e) =>
								setSelectedNftId(Number(e.target.value))
							}
							disabled={
								isLoading || step === ('complete' as StepState)
							}
						>
							<option value="">Select an NFT</option>
							{nfts.map((nft) => {
								// Convert complex ID objects to string for use as option value and key
								const nftId =
									typeof nft.id === 'object'
										? nft.id.id
										: nft.id;
								return (
									<option key={String(nftId)} value={nftId}>
										{nft.metadata?.name || `NFT #${nftId}`}
									</option>
								);
							})}
						</select>
					)}
				</div>

				<div className="mt-2 text-sm text-gray-600">
					<p>
						The admin will assign location details to this hotspot
						later.
					</p>
				</div>

				<div className="pt-4">
					<Button
						onClick={handleRegisterHotspot}
						disabled={
							isLoading ||
							step === ('complete' as StepState) ||
							!magic ||
							nfts.length === 0 ||
							!selectedNftId
						}
						isLoading={isLoading}
					>
						{isLoading ? 'Registering...' : 'Register Hotspot'}
					</Button>
				</div>
			</div>
		);
	};

	return (
		<Card title="Register New Hotspot">
			<div className="flex flex-col items-center">
				<div className="mb-4 text-center">
					<p className="text-gray-900 text-lg mb-2">
						{renderStepMessage()}
					</p>
					<p className="text-sm text-gray-600">
						You must own a Hotspot Operator NFT to register a
						hotspot on the network.
					</p>
				</div>

				{error && (
					<div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 w-full">
						{error}
					</div>
				)}

				{renderForm()}
				{renderTransactionInfo()}
			</div>
		</Card>
	);
}
