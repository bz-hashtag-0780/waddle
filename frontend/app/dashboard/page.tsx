'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import HotspotList from '../../components/HotspotList';
import { Hotspot } from '../../types/flow';
import {
	getAllHotspots,
	checkHotspotOperatorNFTOwnership,
} from '../../services/flow';

const DashboardPage = () => {
	const router = useRouter();
	const { user, isLoading: authLoading } = useAuth();
	const [hotspots, setHotspots] = useState<Hotspot[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasNFT, setHasNFT] = useState<boolean>(false);
	const [totalRewards, setTotalRewards] = useState<number>(0);
	const [pendingRewards, setPendingRewards] = useState<number>(0);

	useEffect(() => {
		// Redirect to login if not authenticated
		if (!authLoading && !user) {
			router.push('/login');
		}
	}, [user, authLoading, router]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// Check if user has a HotspotOperatorNFT
				if (user?.address) {
					const ownsNFT = await checkHotspotOperatorNFTOwnership(
						user.address
					);
					setHasNFT(ownsNFT);
				}

				// Fetch all hotspots
				const fetchedHotspots = await getAllHotspots();

				// Filter hotspots by the current user (for the dashboard)
				const userHotspots = fetchedHotspots.filter(
					(hotspot) => hotspot.owner === user?.address
				);

				setHotspots(userHotspots);

				// Calculate total rewards (simulation for demo)
				const totalHours = userHotspots.reduce(
					(sum, hotspot) => sum + hotspot.totalUptime / 3600,
					0
				);
				setTotalRewards(Math.round(totalHours * 10)); // 10 tokens per hour
				setPendingRewards(Math.round(totalHours * 2.5)); // Pending rewards (25% of total)
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

	if (authLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<svg
					className="animate-spin h-12 w-12 text-blue-600"
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
				<div className="md:flex md:items-center md:justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Dashboard
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Manage your 5G hotspots and view rewards
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
							<Button onClick={() => router.push('/nft/mint')}>
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
								<div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
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
													: `${totalRewards} WADL`}
											</div>
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</Card>

					{/* Pending Rewards Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
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
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Pending Rewards
										</dt>
										<dd>
											<div className="text-lg font-medium text-gray-900">
												{isLoading
													? '...'
													: `${pendingRewards} WADL`}
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
