import { config } from '@onflow/fcl';

// Configure FCL for the Flow network
// Set network to emulator for local development, testnet for testing,
// or mainnet for production
const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK || 'testnet';

// FCL configurations
const fclConfig = {
	emulator: {
		'accessNode.api': 'http://localhost:8888',
		'discovery.wallet': 'http://localhost:8701/fcl/authn',
		'0xHybridCustody': '0xf8d6e0586b0a20c7',
		'0xMetadataViews': '0xf8d6e0586b0a20c7',
		'0xViewResolver': '0xf8d6e0586b0a20c7',
		'0xCapabilityFactory': '0xf8d6e0586b0a20c7',
		'0xCapabilityFilter': '0xf8d6e0586b0a20c7',
		'0xCapabilityDelegator': '0xf8d6e0586b0a20c7',
	},
	testnet: {
		'accessNode.api': 'https://rest-testnet.onflow.org',
		'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
		'0xHybridCustody': '0x294e44e1ec6993c6',
		'0xMetadataViews': '0x631e88ae7f1d7c20',
		'0xViewResolver': '0x631e88ae7f1d7c20',
		'0xCapabilityFactory': '0x294e44e1ec6993c6',
		'0xCapabilityFilter': '0x294e44e1ec6993c6',
		'0xCapabilityDelegator': '0x294e44e1ec6993c6',
	},
	mainnet: {
		'accessNode.api': 'https://rest-mainnet.onflow.org',
		'discovery.wallet': 'https://fcl-discovery.onflow.org/authn',
		'0xHybridCustody': '0xd8a7e05a7ac670c0',
		'0xMetadataViews': '0x1d7e57aa55817448',
		'0xViewResolver': '0x1d7e57aa55817448',
		'0xCapabilityFactory': '0xd8a7e05a7ac670c0',
		'0xCapabilityFilter': '0xd8a7e05a7ac670c0',
		'0xCapabilityDelegator': '0xd8a7e05a7ac670c0',
	},
};

const network = fclConfig[flowNetwork];

// Configure FCL
config()
	.put('accessNode.api', network['accessNode.api'])
	.put('discovery.wallet', network['discovery.wallet'])
	.put('0xHybridCustody', network['0xHybridCustody'])
	.put('0xMetadataViews', network['0xMetadataViews'])
	.put('0xViewResolver', network['0xViewResolver'])
	.put('0xCapabilityFactory', network['0xCapabilityFactory'])
	.put('0xCapabilityFilter', network['0xCapabilityFilter'])
	.put('0xCapabilityDelegator', network['0xCapabilityDelegator'])
	.put('app.detail.title', 'Waddle $5G Network')
	.put('app.detail.icon', 'https://waddle-5g.example.com/logo.png')
	.put('flow.network', flowNetwork);
