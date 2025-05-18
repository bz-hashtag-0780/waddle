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
	.put('0xFIVEGCOIN', '0xcc6a3536f37381a2')
	.put('0xHybridCustody', '0x294e44e1ec6993c6')
	.put('0xMetadataViews', '0x631e88ae7f1d7c20')
	.put('0xViewResolver', '0x631e88ae7f1d7c20')
	.put('0xCapabilityFactory', '0x294e44e1ec6993c6')
	.put('0xCapabilityFilter', '0x294e44e1ec6993c6')
	.put('0xCapabilityDelegator', '0x294e44e1ec6993c6')
	.put('0xNonFungibleToken', '0x631e88ae7f1d7c20');

export default fcl;
