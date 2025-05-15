import React, { useState } from 'react';
import Input from './Input';
import Button from '../frontend/components/Button';
import Card from '../frontend/components/Card';
import { registerHotspot } from '../services/flow';

interface HotspotRegistrationFormProps {
	onSuccess?: (hotspotId: string) => void;
}

const HotspotRegistrationForm: React.FC<HotspotRegistrationFormProps> = ({
	onSuccess,
}) => {
	const [lat, setLat] = useState<string>('');
	const [lng, setLng] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Form validation
		if (!lat || !lng) {
			setError('Please provide both latitude and longitude.');
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

			// Register hotspot
			const hotspotId = await registerHotspot(latNum, lngNum);

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
			description="Add a new 5G hotspot to the network."
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

					<div className="flex justify-end">
						<Button
							type="submit"
							isLoading={isSubmitting}
							disabled={isSubmitting}
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
