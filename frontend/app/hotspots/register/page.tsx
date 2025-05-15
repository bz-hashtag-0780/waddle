'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import Layout from '../../../components/Layout';
import HotspotRegistrationForm from '../../../components/HotspotRegistrationForm';
import { checkHotspotOperatorNFTOwnership } from '../../../services/flow';

const RegisterHotspotPage = () => {
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const [hasNFT, setHasNFT] = useState<boolean>(false);
	const [isChecking, setIsChecking] = useState<boolean>(true);

	useEffect(() => {
		// Redirect to login if not authenticated
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		const checkNFTOwnership = async () => {
			if (user?.address) {
				try {
					setIsChecking(true);
					const ownsNFT = await checkHotspotOperatorNFTOwnership(
						user.address
					);
					setHasNFT(ownsNFT);
				} catch (error) {
					console.error('Error checking NFT ownership:', error);
				} finally {
					setIsChecking(false);
				}
			}
		};

		if (user) {
			checkNFTOwnership();
		}
	}, [user]);

	const handleRegistrationSuccess = (hotspotId: string) => {
		// Show success message and redirect to the hotspot details page
		alert(`Hotspot #${hotspotId} registered successfully!`);
		router.push(`/hotspots/${hotspotId}`);
	};

	if (authLoading || isChecking) {
		return (
			<Layout>
				<div className="flex justify-center items-center h-64">
					<svg
						className="animate-spin h-8 w-8 text-blue-600"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			</Layout>
		);
	}

	// If user doesn't have an NFT, show error and link to get NFT
	if (!hasNFT) {
		return (
			<Layout>
				<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
					<div className="px-6 py-12 text-center">
						<svg
							className="h-12 w-12 text-red-400 mx-auto"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<h3 className="mt-4 text-lg font-medium text-gray-900">
							Operator NFT Required
						</h3>
						<p className="mt-2 text-sm text-gray-500">
							You need an Operator NFT to register a hotspot. This
							NFT grants you permission to join the network.
						</p>
						<div className="mt-6">
							<button
								type="button"
								onClick={() => router.push('/nft/mint')}
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
							>
								Get Operator NFT
							</button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						Register a Hotspot
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						Add a new 5G hotspot to the network and start earning
						rewards.
					</p>
				</div>

				<HotspotRegistrationForm
					onSuccess={handleRegistrationSuccess}
				/>
			</div>
		</Layout>
	);
};

export default RegisterHotspotPage;
