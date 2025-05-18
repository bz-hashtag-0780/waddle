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

async function processHotspotsLocations() {
	const allHotspots = await flowService.getAllHotspots();
	console.log(allHotspots);
}

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	// await flowService.addKeys(500);

	await processHotspotsLocations();
});
