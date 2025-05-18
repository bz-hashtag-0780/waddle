import React from 'react';
import 'leaflet/dist/leaflet.css';
import { Hotspot } from '@/types/flow';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components with ssr: false to prevent "window is not defined" errors
const MapWithNoSSR = dynamic(() => import('./LeafletMap'), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full w-full bg-gray-100">
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
	),
});

interface NetworkMapProps {
	hotspots: Hotspot[];
	loading?: boolean;
	height?: string;
	width?: string;
	initialCenter?: [number, number];
	initialZoom?: number;
}

const NetworkMap: React.FC<NetworkMapProps> = ({
	hotspots,
	loading = false,
	height = '500px',
	width = '100%',
	initialCenter = [37.7749, -122.4194], // San Francisco by default
	initialZoom = 11,
}) => {
	if (loading) {
		return (
			<div
				style={{ height, width }}
				className="bg-gray-100 flex items-center justify-center"
			>
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
		);
	}

	// Filter out hotspots without valid coordinates
	const validHotspots = hotspots.filter(
		(hotspot) => hotspot.lat !== null && hotspot.lng !== null
	);

	if (validHotspots.length === 0) {
		return (
			<div
				style={{ height, width }}
				className="bg-gray-100 flex flex-col items-center justify-center text-center"
			>
				<p className="text-gray-500 mb-2">
					No hotspots with location data available
				</p>
				<p className="text-sm text-gray-400">
					Hotspots will appear on the map once their location is
					assigned
				</p>
			</div>
		);
	}

	return (
		<div style={{ height, width }}>
			<MapWithNoSSR
				hotspots={validHotspots}
				initialCenter={initialCenter}
				initialZoom={initialZoom}
			/>
		</div>
	);
};

export default NetworkMap;
