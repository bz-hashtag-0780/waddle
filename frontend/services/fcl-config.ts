import * as fcl from '@onflow/fcl';

// Configure FCL for Flow testnet
fcl.config()
	.put('accessNode.api', 'https://rest-testnet.onflow.org')
	.put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
	.put('app.detail.title', 'WaddleWireless')
	.put('app.detail.icon', 'https://waddlewireless.com/icon.png')
	.put('0xHotspotOperatorNFT', '0xcc6a3536f37381a2')
	.put('0xHotspotRegistry', '0xcc6a3536f37381a2')
	.put('0xUptimeProof', '0xcc6a3536f37381a2')
	.put('0xFIVEGCOIN', '0xcc6a3536f37381a2');

export default fcl;
