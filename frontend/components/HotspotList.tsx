import React from 'react';
import Link from 'next/link';
import Card from './Card';
import { Hotspot } from '@/types/flow';

interface HotspotListProps {
	hotspots: Hotspot[];
	loading?: boolean;
}

const HotspotList: React.FC<HotspotListProps> = ({
	hotspots,
	loading = false,
}) => {
	if (loading) {
		return (
			<Card>
				<div className="flex justify-center items-center py-12">
					<svg
						className="animate-spin h-8 w-8 text-[rgb(117,206,254)]"
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
			</Card>
		);
	}

	if (hotspots.length === 0) {
		return (
			<Card>
				<div className="text-center py-12">
					<h3 className="mt-2 text-lg font-medium text-gray-900">
						No hotspots found
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Get started by registering a new hotspot.
					</p>
					<div className="mt-6">
						<Link
							href="/hotspots/register"
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)]"
						>
							Register a Hotspot
						</Link>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{hotspots.map((hotspot) => (
				<Card
					key={hotspot.id}
					className="hover:shadow-md transition-shadow"
				>
					<div className="flex items-start justify-between">
						<div>
							<h3 className="text-lg font-medium text-gray-900">
								Hotspot #{hotspot.id}
							</h3>
							<div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
								<div className="text-gray-500">Status:</div>
								<div>
									{hotspot.online ? (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
											Online
										</span>
									) : (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
											Offline
										</span>
									)}
								</div>
								<div className="text-gray-500">Owner:</div>
								<div
									className="text-gray-900 font-medium truncate"
									title={hotspot.owner}
								>
									{hotspot.owner.slice(0, 8)}...
									{hotspot.owner.slice(-6)}
								</div>
								<div className="text-gray-500">Location:</div>
								<div className="text-gray-900">
									{hotspot.lat !== null
										? hotspot.lat.toFixed(4)
										: 'N/A'}
									,{' '}
									{hotspot.lng !== null
										? hotspot.lng.toFixed(4)
										: 'N/A'}
								</div>
								<div className="text-gray-500">
									Total Uptime:
								</div>
								<div className="text-gray-900">
									{formatUptime(hotspot.totalUptime)}
								</div>
								<div className="text-gray-500">
									Last Updated:
								</div>
								<div className="text-gray-900">
									{formatDate(hotspot.lastUpdated)}
								</div>
							</div>
						</div>
						{/* <Link
							href={`/hotspots/${hotspot.id}`}
							className="text-sm text-[rgb(117,206,254)] hover:text-blue-500"
						>
							View Details
						</Link> */}
					</div>
				</Card>
			))}
		</div>
	);
};

// Helper function to format uptime in seconds to a human-readable format
const formatUptime = (seconds: number): string => {
	if (seconds < 60) {
		return `${seconds} seconds`;
	} else if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	} else if (seconds < 86400) {
		const hours = Math.floor(seconds / 3600);
		return `${hours} hour${hours !== 1 ? 's' : ''}`;
	} else {
		const days = Math.floor(seconds / 86400);
		return `${days} day${days !== 1 ? 's' : ''}`;
	}
};

// Helper function to format date
const formatDate = (timestamp: number): string => {
	return new Date(timestamp).toLocaleString();
};

export default HotspotList;
