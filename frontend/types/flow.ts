// Flow-related types
export interface Hotspot {
	id: number;
	owner: string;
	lat: number | null;
	lng: number | null;
	online: boolean;
	lastUpdated: number;
	totalUptime: number;
}

export interface UptimeProof {
	hotspotID: number;
	timestamp: number;
	duration: number;
	signalStrength: number;
	submitter: string;
}

export interface UptimeStats {
	totalUptime: number;
	averageSignalStrength: number | null;
	proofCount: number;
}

export interface NFTMetadata {
	name: string;
	description: string;
	thumbnail: string;
	createdAt: number;
}
