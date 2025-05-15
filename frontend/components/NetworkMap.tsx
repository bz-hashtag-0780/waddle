import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Hotspot } from '@/types/flow';

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
	// Need this state to re-render after Leaflet icons are fixed
	const [isMapReady, setIsMapReady] = useState(false);

	useEffect(() => {
		// This is to fix the missing icon issue with react-leaflet
		if (typeof window !== 'undefined') {
			import('leaflet').then((L) => {
				// Need to use any type here because _getIconUrl is not defined in the type
				const icon = L.Icon.Default.prototype as any;
				delete icon._getIconUrl;

				L.Icon.Default.mergeOptions({
					iconRetinaUrl: '/leaflet/marker-icon-2x.png',
					iconUrl: '/leaflet/marker-icon.png',
					shadowUrl: '/leaflet/marker-shadow.png',
				});

				setIsMapReady(true);
			});
		}
	}, []);

	if (loading) {
		return (
			<div
				style={{ height, width }}
				className="bg-gray-100 flex items-center justify-center"
			>
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
		);
	}

	if (!isMapReady) {
		return null;
	}

	return (
		<div style={{ height, width }}>
			<MapContainer
				center={initialCenter}
				zoom={initialZoom}
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{hotspots.map((hotspot) => (
					<React.Fragment key={hotspot.id}>
						{/* Marker for the hotspot location */}
						<Marker position={[hotspot.lat, hotspot.lng]}>
							<Popup>
								<div className="p-2">
									<h3 className="font-medium">
										Hotspot #{hotspot.id}
									</h3>
									<p className="text-sm mt-1">
										Status:{' '}
										{hotspot.online ? 'Online' : 'Offline'}
									</p>
									<p className="text-sm">
										Owner: {hotspot.owner.slice(0, 8)}...
										{hotspot.owner.slice(-6)}
									</p>
									<p className="text-sm">
										Uptime:{' '}
										{formatUptime(hotspot.totalUptime)}
									</p>
								</div>
							</Popup>
						</Marker>

						{/* Circle showing coverage area (roughly 300-400m for 5G) */}
						<Circle
							center={[hotspot.lat, hotspot.lng]}
							radius={hotspot.online ? 400 : 200}
							pathOptions={{
								color: hotspot.online ? '#3b82f6' : '#6b7280',
								fillColor: hotspot.online
									? '#93c5fd'
									: '#d1d5db',
								fillOpacity: 0.3,
							}}
						/>
					</React.Fragment>
				))}
			</MapContainer>
		</div>
	);
};

// Helper function to format uptime
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

export default NetworkMap;
