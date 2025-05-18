import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Hotspot } from '@/types/flow';

interface LeafletMapProps {
	hotspots: Hotspot[];
	initialCenter: [number, number];
	initialZoom: number;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
	hotspots,
	initialCenter,
	initialZoom,
}) => {
	const [isMapReady, setIsMapReady] = useState(false);

	useEffect(() => {
		// Fix the missing icon issue with react-leaflet
		// Define a proper type for the icon prototype
		interface IconPrototype {
			_getIconUrl?: unknown;
		}

		const icon = L.Icon.Default.prototype as IconPrototype;
		delete icon._getIconUrl;

		L.Icon.Default.mergeOptions({
			iconRetinaUrl: '/leaflet/marker-icon-2x.png',
			iconUrl: '/leaflet/marker-icon.png',
			shadowUrl: '/leaflet/marker-shadow.png',
		});

		setIsMapReady(true);
	}, []);

	if (!isMapReady) {
		return null;
	}

	return (
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
					<Marker
						position={[Number(hotspot.lat), Number(hotspot.lng)]}
					>
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
									Uptime: {formatUptime(hotspot.totalUptime)}
								</p>
							</div>
						</Popup>
					</Marker>

					{/* Circle showing coverage area (roughly 300-400m for 5G) */}
					<Circle
						center={[Number(hotspot.lat), Number(hotspot.lng)]}
						radius={hotspot.online ? 400 : 200}
						pathOptions={{
							color: hotspot.online ? '#3b82f6' : '#6b7280',
							fillColor: hotspot.online ? '#93c5fd' : '#d1d5db',
							fillOpacity: 0.3,
						}}
					/>
				</React.Fragment>
			))}
		</MapContainer>
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

export default LeafletMap;
