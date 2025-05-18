import { Magic as MagicBase } from 'magic-sdk';
import { FlowExtension } from '@magic-ext/flow';
// Import FCL configuration
import './fcl-config';
import { User } from '../types/auth';

// Define Magic type with Flow Extension
export type Magic = MagicBase<[FlowExtension]>;

// Magic Link configuration
let magic: Magic | null = null;

// Initialize Magic Link on client-side only
export const initMagic = () => {
	if (typeof window === 'undefined') return null;

	if (!magic) {
		// Get the Flow network configuration - we're using testnet
		const flowAccessNode = 'https://rest-testnet.onflow.org';

		magic = new MagicBase(
			process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_demo',
			{
				extensions: [
					new FlowExtension({
						rpcUrl: flowAccessNode,
						network: 'testnet',
					}),
				],
			}
		) as Magic;
	}

	return magic;
};

// Initialize Flow Client Library - Now using our FCL config
export const initFCL = () => {
	// Configuration is already loaded from fcl-config.ts
	// No need to configure here
};

// Login with Magic Link
export const loginWithMagic = async (email: string): Promise<User> => {
	const magic = initMagic();
	if (!magic) throw new Error('Magic not initialized');

	// Login with Magic using email
	await magic.auth.loginWithMagicLink({ email });

	// Get Flow address from Magic
	const userInfo = await magic.user.getInfo();
	const address = userInfo.publicAddress || '';

	const user = {
		email,
		address,
		loggedIn: true,
	};

	return user;
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
