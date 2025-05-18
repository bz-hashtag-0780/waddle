import React, { useState, useEffect } from 'react';
import Button from './Button';
import Card from './Card';
import { getUserNFTs, registerHotspotComplete } from '@/services/flow';
import { useMagic } from '@/contexts/MagicContext';
import { useAuth } from '@/contexts/AuthContext';

interface HotspotRegistrationFormProps {
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

const HotspotRegistrationForm: React.FC<HotspotRegistrationFormProps> = ({
	onSuccess,
}) => {
	const { user } = useAuth();
	const { magic } = useMagic();
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [selectedNftId, setSelectedNftId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');
	const [transactionId, setTransactionId] = useState<string | null>(null);
	const [hotspotId, setHotspotId] = useState<string | null>(null);

	// Fetch user's NFTs
	useEffect(() => {
		const fetchNFTs = async () => {
			if (!user?.address) return;

			try {
				setIsLoading(true);
				const userNFTs = await getUserNFTs(user.address);
				setNfts(userNFTs);
				if (userNFTs.length > 0) {
					// Get the ID from the first NFT, handling object case
					const firstNftId =
						typeof userNFTs[0].id === 'object'
							? userNFTs[0].id.id
							: userNFTs[0].id;
					// Select first NFT by default
					setSelectedNftId(Number(firstNftId));
				}
			} catch (err) {
				console.error('Error fetching NFTs:', err);
				setError('Failed to load your NFTs. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			fetchNFTs();
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!magic) {
			setError('Magic is not initialized. Please try again later.');
			return;
		}

		// Form validation
		if (selectedNftId === null) {
			setError('Please select an NFT to use for hotspot registration.');
			return;
		}

		try {
			setIsSubmitting(true);
			setError('');

			console.log(
				'Registering hotspot using selected NFT ID:',
				selectedNftId
			);

			// Register hotspot with Magic authorization
			const result = await registerHotspotComplete(magic, selectedNftId);

			setTransactionId(result.transactionId);

			if (result.hotspotId) {
				setHotspotId(result.hotspotId);

				// Call onSuccess callback if provided
				if (onSuccess) {
					onSuccess(result.hotspotId);
				}
			} else {
				console.warn(
					'Hotspot registered but no ID was returned. Transaction ID:',
					result.transactionId
				);
			}

			// Reset selected NFT
			setSelectedNftId(null);
		} catch (err) {
			console.error('Error registering hotspot:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to register hotspot. Please try again.'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Display transaction details if available
	const renderTransactionInfo = () => {
		if (!transactionId) return null;

		return (
			<div className="mt-4 border-t pt-4">
				<h4 className="text-sm font-medium text-gray-900">
					Transaction Details
				</h4>
				<div className="mt-2 text-sm text-gray-600">
					<p>
						<span className="font-medium">Transaction ID:</span>{' '}
						<span className="break-all">{transactionId}</span>
					</p>
					{hotspotId && (
						<p className="mt-1">
							<span className="font-medium">Hotspot ID:</span>{' '}
							{hotspotId}
						</p>
					)}
				</div>
			</div>
		);
	};

	return (
		<Card
			title="Register a New Hotspot"
			description="Select an NFT to register a new hotspot on the network."
		>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-4">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Select NFT for Registration
						</label>
						{isLoading ? (
							<div className="animate-pulse bg-gray-200 rounded h-10 w-full"></div>
						) : nfts.length === 0 ? (
							<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
								<p className="text-sm text-yellow-600">
									You don&apos;t have any NFTs to register.
									Please mint an NFT first.
								</p>
							</div>
						) : (
							<select
								className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
								value={selectedNftId || ''}
								onChange={(e) =>
									setSelectedNftId(Number(e.target.value))
								}
								required
							>
								<option value="">Select an NFT</option>
								{nfts.map((nft) => {
									// Convert complex ID objects to string for use as option value and key
									const nftId =
										typeof nft.id === 'object'
											? nft.id.id
											: nft.id;
									return (
										<option
											key={String(nftId)}
											value={nftId}
										>
											{nft.metadata?.name ||
												'Unnamed NFT'}{' '}
											(ID: {nftId})
										</option>
									);
								})}
							</select>
						)}
					</div>

					<div className="mt-2 text-sm text-gray-600">
						<p>
							The admin will assign location details to this
							hotspot later.
						</p>
					</div>

					{renderTransactionInfo()}

					<div className="flex justify-end">
						<Button
							type="submit"
							isLoading={isSubmitting}
							disabled={
								isSubmitting ||
								!magic ||
								nfts.length === 0 ||
								!selectedNftId
							}
						>
							{isSubmitting
								? 'Registering...'
								: 'Register Hotspot'}
						</Button>
					</div>
				</div>
			</form>
		</Card>
	);
};

export default HotspotRegistrationForm;
