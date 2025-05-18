import * as fcl from '@onflow/fcl';

// Configure FCL for Flow mainnet
fcl.config()
	.put('accessNode.api', 'https://rest-mainnet.onflow.org')
	.put('discovery.wallet', 'https://fcl-discovery.onflow.org/mainnet/authn')
	.put('app.detail.title', 'Waddle 5G')
	.put(
		'app.detail.icon',
		'https://raw.githubusercontent.com/bz-hashtag-0780/waddle/refs/heads/main/images/waddle_logo.png'
	)
	.put('0xHotspotOperatorNFT', '0xefc9bea2fda54f34')
	.put('0xHotspotRegistry', '0xefc9bea2fda54f34')
	.put('0xHybridCustody', '0xd8a7e05a7ac670c0')
	.put('0xMetadataViews', '0x1d7e57aa55817448')
	.put('0xViewResolver', '0x1d7e57aa55817448')
	.put('0xCapabilityFactory', '0xd8a7e05a7ac670c0')
	.put('0xCapabilityFilter', '0xd8a7e05a7ac670c0')
	.put('0xCapabilityDelegator', '0xd8a7e05a7ac670c0')
	.put('0xNonFungibleToken', '0x1d7e57aa55817448')
	.put('0xNFTCollectionPublicFactory', '0xd8a7e05a7ac670c0')
	.put('0xNFTProviderAndCollectionFactory', '0xd8a7e05a7ac670c0')
	.put('0xNFTProviderFactory', '0xd8a7e05a7ac670c0');

export default fcl;
