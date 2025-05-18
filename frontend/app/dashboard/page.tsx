'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import HotspotList from '@/components/HotspotList';
import { Hotspot } from '@/types/flow';
import {
	getAllHotspots,
	checkHotspotOperatorNFTOwnership,
	getFIVEGCOINBalance,
	getFlowBalance,
} from '@/services/flow';

const DashboardPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, isLoading: authLoading, isInitialized } = useAuth();
	const [hotspots, setHotspots] = useState<Hotspot[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasNFT, setHasNFT] = useState<boolean>(false);
	const [totalRewards, setTotalRewards] = useState<number>(0);
	const [flowBalance, setFlowBalance] = useState<number>(0);
	const [showSuccessMessage, setShowSuccessMessage] =
		useState<boolean>(false);
	const [registeredHotspotId, setRegisteredHotspotId] = useState<
		string | null
	>(null);
	const [lastChecked, setLastChecked] = useState<string>('');
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	useEffect(() => {
		// Check for registration success parameter
		const registration = searchParams.get('registration');
		const hotspotId = searchParams.get('hotspotId');

		if (registration === 'success' && hotspotId) {
			setShowSuccessMessage(true);
			setRegisteredHotspotId(hotspotId);

			// Clear the URL parameters after 5 seconds
			const timer = setTimeout(() => {
				window.history.replaceState({}, '', '/dashboard');
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	useEffect(() => {
		// Only redirect to login if auth is fully initialized AND user is not logged in
		// This prevents redirection during the initialization process
		if (isInitialized && !authLoading && !user) {
			console.log(
				'Auth is initialized and user is not logged in. Redirecting to login.'
			);
			router.push('/login');
		}
	}, [user, authLoading, isInitialized, router]);

	const refreshNFTStatus = async () => {
		try {
			if (!user?.address) return;

			setIsRefreshing(true);
			console.log('Manually checking NFT ownership for:', user.address);

			const ownsNFT = await checkHotspotOperatorNFTOwnership(
				user.address
			);
			console.log('NFT ownership check result:', ownsNFT);

			setHasNFT(ownsNFT);
			setLastChecked(new Date().toLocaleTimeString());
		} catch (error) {
			console.error('Error refreshing NFT status:', error);
		} finally {
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Check if user has a HotspotOperatorNFT
				if (user?.address) {
					const ownsNFT = await checkHotspotOperatorNFTOwnership(
						user.address
					);
					console.log('Initial NFT ownership check result:', ownsNFT);
					setHasNFT(ownsNFT);
					setLastChecked(new Date().toLocaleTimeString());

					// Get user's token balance
					const tokenBalance = await getFIVEGCOINBalance(
						user.address
					);
					setTotalRewards(tokenBalance);

					// Get user's FLOW token balance
					const flowTokenBalance = await getFlowBalance(user.address);
					setFlowBalance(flowTokenBalance);
				}

				// Fetch all hotspots
				const fetchedHotspots = await getAllHotspots();

				// Filter hotspots by the current user (for the dashboard)
				const userHotspots = fetchedHotspots.filter(
					(hotspot) => hotspot.owner === user?.address
				);

				setHotspots(userHotspots);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (user) {
			fetchData();
		}
	}, [user]);

	// Show loading state if auth is still loading or not fully initialized
	if (authLoading || !isInitialized) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<svg
					className="animate-spin h-12 w-12 text-[rgb(117,206,254)]"
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
		);
	}

	return (
		<Layout>
			<div className="space-y-6">
				{showSuccessMessage && (
					<div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-green-400"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-green-800">
									Hotspot Registered Successfully!
								</h3>
								<div className="mt-2 text-sm text-green-700">
									<p>
										Your new hotspot (ID:{' '}
										{registeredHotspotId}) has been
										registered. It will appear in your list
										below.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="md:flex md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Dashboard
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Manage your 5G hotspots and view rewards
						</p>
						<p className="mt-1 text-xs text-gray-400">
							NFT Status: {hasNFT ? 'Has NFT' : 'No NFT'} (Last
							checked: {lastChecked})
							<button
								onClick={refreshNFTStatus}
								disabled={isRefreshing}
								className="ml-2 text-blue-500 underline"
							>
								{isRefreshing ? 'Checking...' : 'Refresh'}
							</button>
						</p>
					</div>
					<div className="mt-4 md:mt-0">
						{hasNFT ? (
							<Button
								onClick={() =>
									router.push('/hotspots/register')
								}
							>
								Register New Hotspot
							</Button>
						) : (
							<Button onClick={() => router.push('/nfts')}>
								Get Operator NFT
							</Button>
						)}
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{/* Hotspots Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0 bg-[rgb(117,206,254)] rounded-md p-3">
									<svg
										className="h-6 w-6 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Total Hotspots
										</dt>
										<dd>
											<div className="text-lg font-medium text-gray-900">
												{isLoading
													? '...'
													: hotspots.length}
											</div>
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</Card>

					{/* Total Rewards Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0 bg-green-500 rounded-md p-3">
									<svg
										className="h-6 w-6 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Total Rewards Earned
										</dt>
										<dd>
											<div className="text-lg font-medium text-gray-900">
												{isLoading
													? '...'
													: `${totalRewards} $5G`}
											</div>
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</Card>

					{/* FLOW Balance Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
									<svg
										className="h-6 w-6 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											FLOW Balance
										</dt>
										<dd>
											<div className="text-lg font-medium text-gray-900">
												{isLoading
													? '...'
													: `${flowBalance.toFixed(
															4
													  )} FLOW`}
											</div>
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Hotspots List */}
				<div className="mt-8">
					<h2 className="text-lg font-medium text-gray-900">
						Your Hotspots
					</h2>
					<div className="mt-4">
						<HotspotList hotspots={hotspots} loading={isLoading} />
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
