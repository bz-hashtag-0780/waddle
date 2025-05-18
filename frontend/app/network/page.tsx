'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import NetworkMap from '@/components/NetworkMap';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Hotspot } from '@/types/flow';
import { getAllHotspots } from '@/services/flow';

const NetworkPage = () => {
	const [hotspots, setHotspots] = useState<Hotspot[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [stats, setStats] = useState({
		total: 0,
		online: 0,
		coverage: 0,
	});

	const fetchHotspotsData = async () => {
		try {
			setIsLoading(true);
			setError(null);
			console.log('Fetching hotspot data...');

			// Fetch all hotspots
			const fetchedHotspots = await getAllHotspots();
			console.log(
				`Received ${fetchedHotspots.length} hotspots from the API`
			);
			setHotspots(fetchedHotspots);
			setLastRefreshed(new Date());

			// Calculate statistics
			const onlineCount = fetchedHotspots.filter((h) => h.online).length;

			// Filter out hotspots without location data for coverage calculation
			const hotspotsWithLocation = fetchedHotspots.filter(
				(h) => h.lat !== null && h.lng !== null
			);

			// Rough estimation of coverage area (pi * r^2 * count)
			// 5G range is about 400m, so a single hotspot covers ~0.5 sq km
			const coverageArea = hotspotsWithLocation.reduce((sum, hotspot) => {
				return sum + (hotspot.online ? 0.5 : 0.25); // Online hotspots have full coverage, offline have half
			}, 0);

			setStats({
				total: fetchedHotspots.length,
				online: onlineCount,
				coverage: coverageArea,
			});
		} catch (error) {
			console.error('Error fetching network data:', error);
			setError('Failed to load hotspot data. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Initial data load
	useEffect(() => {
		fetchHotspotsData();
	}, []);

	const handleRefresh = () => {
		fetchHotspotsData();
	};

	return (
		<Layout>
			<div className="space-y-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Network Map
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							View the current coverage of our decentralized 5G
							network
						</p>
					</div>
					<div className="flex items-center gap-4">
						{lastRefreshed && (
							<div className="text-sm text-gray-500">
								Last updated:{' '}
								{lastRefreshed.toLocaleTimeString()}
							</div>
						)}
						<Button
							onClick={handleRefresh}
							disabled={isLoading}
							className="whitespace-nowrap"
						>
							{isLoading ? 'Refreshing...' : 'Refresh Data'}
						</Button>
					</div>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				)}

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
					{/* Total Hotspots Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6 text-center">
							<dt className="text-sm font-medium text-gray-500">
								Total Hotspots
							</dt>
							<dd className="mt-1 text-3xl font-semibold text-gray-900">
								{isLoading ? '...' : stats.total}
							</dd>
						</div>
					</Card>

					{/* Online Hotspots Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6 text-center">
							<dt className="text-sm font-medium text-gray-500">
								Online Hotspots
							</dt>
							<dd className="mt-1 text-3xl font-semibold text-gray-900">
								{isLoading ? '...' : stats.online}
								<span className="text-sm text-gray-500 ml-2">
									(
									{isLoading || stats.total === 0
										? '0'
										: Math.round(
												(stats.online / stats.total) *
													100
										  )}
									%)
								</span>
							</dd>
						</div>
					</Card>

					{/* Coverage Area Card */}
					<Card>
						<div className="px-4 py-5 sm:p-6 text-center">
							<dt className="text-sm font-medium text-gray-500">
								Coverage Area
							</dt>
							<dd className="mt-1 text-3xl font-semibold text-gray-900">
								{isLoading
									? '...'
									: `${stats.coverage.toFixed(1)} km²`}
							</dd>
						</div>
					</Card>
				</div>

				{/* Map Component */}
				<Card className="overflow-hidden">
					<div className="h-[600px]">
						<NetworkMap
							hotspots={hotspots}
							loading={isLoading}
							height="600px"
							width="100%"
						/>
					</div>
				</Card>

				{/* Map Legend */}
				<Card>
					<div className="px-4 py-5 sm:p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Map Legend
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center">
								<div className="h-4 w-4 rounded-full bg-[rgb(117,206,254)] mr-2"></div>
								<span className="text-sm text-gray-700">
									Online Hotspot
								</span>
							</div>
							<div className="flex items-center">
								<div className="h-4 w-4 rounded-full bg-gray-500 mr-2"></div>
								<span className="text-sm text-gray-700">
									Offline Hotspot
								</span>
							</div>
							<div className="flex items-center">
								<div className="h-3 w-6 bg-blue-200 opacity-60 mr-2 border border-blue-500"></div>
								<span className="text-sm text-gray-700">
									Active Coverage (400m)
								</span>
							</div>
							<div className="flex items-center">
								<div className="h-3 w-6 bg-gray-200 opacity-60 mr-2 border border-gray-500"></div>
								<span className="text-sm text-gray-700">
									Inactive Coverage (200m)
								</span>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</Layout>
	);
};

export default NetworkPage;
