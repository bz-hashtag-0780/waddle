import { Magic as MagicBase } from 'magic-sdk';
import { FlowExtension } from '@magic-ext/flow';
import * as fcl from '@onflow/fcl';
import { User } from '../types/auth';

// Define Magic type with Flow Extension
export type Magic = MagicBase<FlowExtension[]>;

// Magic Link configuration
let magic: Magic | null = null;

// Initialize Magic Link on client-side only
export const initMagic = () => {
	if (typeof window === 'undefined') return null;

	if (!magic) {
		// Get the Flow network configuration
		const flowAccessNode =
			process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE ||
			'https://rest-testnet.onflow.org';
		const isMainnet = flowAccessNode.includes('mainnet');

		magic = new MagicBase(
			process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_demo',
			{
				extensions: [
					new FlowExtension({
						rpcUrl: flowAccessNode,
						network: isMainnet ? 'mainnet' : 'testnet',
					}),
				],
			}
		) as Magic;
	}

	return magic;
};

// Initialize Flow Client Library
export const initFCL = () => {
	fcl.config()
		.put(
			'accessNode.api',
			process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE ||
				'https://rest-testnet.onflow.org'
		)
		.put(
			'discovery.wallet',
			process.env.NEXT_PUBLIC_FLOW_WALLET_DISCOVERY ||
				'https://fcl-discovery.onflow.org/testnet/authn'
		);
};

// Login with Magic Link
export const loginWithMagic = async (email: string): Promise<User> => {
	const magic = initMagic();
	if (!magic) throw new Error('Magic not initialized');

	// Login with Magic using email
	await magic.auth.loginWithMagicLink({ email });

	// Get Flow address from Magic
	const userInfo = await magic.user.getInfo();

	return {
		email,
		address: userInfo.publicAddress || '',
		loggedIn: true,
	};
};

// Logout from Magic Link
export const logoutFromMagic = async (): Promise<void> => {
	const magic = initMagic();
	if (!magic) throw new Error('Magic not initialized');

	// Logout from Magic
	await magic.user.logout();
};

// Check if user is logged in
export const checkUserLoggedIn = async (): Promise<User | null> => {
	const magic = initMagic();
	if (!magic) return null;

	try {
		// Check if user is logged in
		const isLoggedIn = await magic.user.isLoggedIn();

		if (isLoggedIn) {
			// Get user info
			const userInfo = await magic.user.getInfo();

			return {
				email: userInfo.email || '',
				address: userInfo.publicAddress || '',
				loggedIn: true,
			};
		}

		return null;
	} catch (error) {
		console.error('Error checking user login status:', error);
		return null;
	}
};
