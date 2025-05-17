import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';
import { registerHotspot, getUserNFTs } from '@/services/flow';
import { useAuth } from '@/contexts/AuthContext';

interface HotspotRegistrationFormProps {
	onSuccess?: (hotspotId: string) => void;
}

interface NFT {
	id: number;
	name: string;
}

const HotspotRegistrationForm: React.FC<HotspotRegistrationFormProps> = ({
	onSuccess,
}) => {
	const { user } = useAuth();
	const [lat, setLat] = useState<string>('');
	const [lng, setLng] = useState<string>('');
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [selectedNft, setSelectedNft] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	// Fetch user's NFTs
	useEffect(() => {
		const fetchNFTs = async () => {
			if (!user?.address) return;

			try {
				setIsLoading(true);
				const userNFTs = await getUserNFTs(user.address);
				setNfts(userNFTs);
				if (userNFTs.length > 0) {
					setSelectedNft(userNFTs[0].id);
				}
			} catch (err) {
				console.error('Error fetching NFTs:', err);
				setError('Failed to load your NFTs. Please try again.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchNFTs();
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Form validation
		if (!lat || !lng) {
			setError('Please provide both latitude and longitude.');
			return;
		}

		if (selectedNft === null) {
			setError('Please select an NFT for this hotspot.');
			return;
		}

		try {
			setIsSubmitting(true);
			setError('');

			// Convert lat/lng to numbers
			const latNum = parseFloat(lat);
			const lngNum = parseFloat(lng);

			// Validate coordinates
			if (isNaN(latNum) || isNaN(lngNum)) {
				setError('Please provide valid coordinates.');
				return;
			}

			if (latNum < -90 || latNum > 90) {
				setError('Latitude must be between -90 and 90 degrees.');
				return;
			}

			if (lngNum < -180 || lngNum > 180) {
				setError('Longitude must be between -180 and 180 degrees.');
				return;
			}

			// Register hotspot with NFT
			const hotspotId = await registerHotspot(
				latNum,
				lngNum,
				selectedNft
			);

			// Clear form
			setLat('');
			setLng('');

			// Call onSuccess callback if provided
			if (onSuccess) {
				onSuccess(hotspotId);
			}
		} catch (err) {
			console.error('Error registering hotspot:', err);
			setError('Failed to register hotspot. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card
			title="Register a New Hotspot"
			description="Add a new 5G hotspot to the network using your NFT."
		>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-md p-4">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Latitude"
							type="text"
							value={lat}
							onChange={(e) => setLat(e.target.value)}
							placeholder="e.g., 37.7749"
							required
							fullWidth
						/>

						<Input
							label="Longitude"
							type="text"
							value={lng}
							onChange={(e) => setLng(e.target.value)}
							placeholder="e.g., -122.4194"
							required
							fullWidth
						/>
					</div>

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
								value={selectedNft || ''}
								onChange={(e) =>
									setSelectedNft(Number(e.target.value))
								}
								required
							>
								<option value="">Select an NFT</option>
								{nfts.map((nft) => (
									<option key={nft.id} value={nft.id}>
										{nft.name} (ID: {nft.id})
									</option>
								))}
							</select>
						)}
					</div>

					<div className="flex justify-end">
						<Button
							type="submit"
							isLoading={isSubmitting}
							disabled={
								isSubmitting || isLoading || nfts.length === 0
							}
						>
							Register Hotspot
						</Button>
					</div>
				</div>
			</form>
		</Card>
	);
};

export default HotspotRegistrationForm;
