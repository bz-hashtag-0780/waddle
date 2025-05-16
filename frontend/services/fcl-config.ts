import * as fcl from '@onflow/fcl';

// Configure FCL for Flow testnet
fcl.config()
	.put('accessNode.api', 'https://rest-testnet.onflow.org')
	.put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
	.put('app.detail.title', 'WaddleWireless')
	.put('app.detail.icon', 'https://waddlewireless.com/icon.png')
	.put('0xHotspotOperatorNFT', '0x010f2d483a538e7e')
	.put('0xHotspotRegistry', '0x010f2d483a538e7e')
	.put('0xUptimeProof', '0x010f2d483a538e7e')
	.put('0xFIVEGCOIN', '0x010f2d483a538e7e');

export default fcl;
