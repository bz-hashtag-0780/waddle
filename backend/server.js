const express = require('express');
const morgan = require('morgan');
const flowService = require('./services/flowService');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8001;

app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
	res.send('Hello, Express with JavaScript!');
});

// Utility function to normalize longitude for contract
function normalizeLongitude(longitude) {
	// If the longitude is negative (Western Hemisphere), add 360 to get positive value
	return longitude < 0 ? 360 + longitude : longitude;
}

// Function to generate random coordinates within USA/Canada
function generateRandomLocation() {
	// Random latitude (24° to 60° N)
	const lat = (Math.random() * (60 - 24) + 24).toFixed(8);

	// Random longitude (-170° to -50° W in standard format)
	const standardLng = (Math.random() * (-50 - -170) + -170).toFixed(8);

	// Normalize longitude for contract (will be between 190° and 310°)
	const normalizedLng = normalizeLongitude(parseFloat(standardLng)).toFixed(
		8
	);

	return { lat, lng: normalizedLng };
}

async function processHotspotsLocations() {
	try {
		console.log('Starting hotspot location processing...');

		// 1. Fetch all hotspots
		const allHotspots = await flowService.getAllHotspots();
		console.log(`Retrieved ${allHotspots.length} hotspots`);

		// 2. Filter hotspots without locations
		const hotspotsWithoutLocation = allHotspots.filter(
			(hotspot) => hotspot.lat === null || hotspot.lng === null
		);

		console.log(
			`Found ${hotspotsWithoutLocation.length} hotspots without location data`
		);

		// 3. Process each hotspot without location
		for (const hotspot of hotspotsWithoutLocation) {
			// Generate random location in USA/Canada
			const { lat, lng } = generateRandomLocation();

			console.log(
				`Assigning location (${lat}, ${lng}) to hotspot ID: ${hotspot.id}`
			);

			// 4. Update the hotspot location on blockchain
			try {
				flowService.updateHotspotLocation(hotspot.id, lat, lng);
				console.log(
					`Successfully updated location for hotspot ID: ${hotspot.id}`
				);
			} catch (updateError) {
				console.error(
					`Failed to update location for hotspot ID: ${hotspot.id}`,
					updateError
				);
				// Continue with next hotspot even if one fails
			}
		}

		console.log('Hotspot location processing completed');
	} catch (error) {
		console.error('Error in processHotspotsLocations:', error);
	}
}

async function processHotspotsOnlineStatus() {
	const allHotspots = await flowService.getAllHotspots();
	console.log(allHotspots);
}

// Set up recurring process every 10 minutes
function setupLocationProcessingScheduler() {
	// Run immediately on startup
	processHotspotsLocations();

	// Then schedule to run every 10 minutes (600000 ms)
	setInterval(processHotspotsLocations, 10 * 60 * 1000);

	console.log('Hotspot location processor scheduled to run every 10 minutes');
}

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	// await flowService.addKeys(500);
	hotspots = await flowService.getAllHotspots();
	console.log(hotspots);
	// await flowService.updateHotspotLocation(
	// 	'27487790823746',
	// 	'49.246292',
	// 	'123.116226'
	// );
	// await flowService.updateHotspotStatus('27487790823746', false);
	// setupLocationProcessingScheduler();

	//// Prove admin key rotation cycling works
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
	// flowService.adminTxnTest();
});
