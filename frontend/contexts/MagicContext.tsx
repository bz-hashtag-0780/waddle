'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { Magic as MagicBase } from 'magic-sdk';
import { FlowExtension } from '@magic-ext/flow';

type Magic = MagicBase<[FlowExtension]>;

interface MagicContextType {
	magic: Magic | null;
	isInitializing: boolean;
}

const MagicContext = createContext<MagicContextType>({
	magic: null,
	isInitializing: true,
});

export const MagicProvider = ({ children }: { children: ReactNode }) => {
	const [magic, setMagic] = useState<Magic | null>(null);
	const [isInitializing, setIsInitializing] = useState(true);

	useEffect(() => {
		// Magic Link should only be initialized client-side
		if (typeof window === 'undefined') return;

		if (!magic) {
			try {
				// Initialize Magic with Flow extension
				const magicInstance = new MagicBase(
					process.env.NEXT_PUBLIC_MAGIC_API_KEY || 'pk_live_demo',
					{
						extensions: [
							new FlowExtension({
								rpcUrl: 'https://rest-testnet.onflow.org',
								network: 'testnet',
							}),
						],
					}
				) as Magic;

				setMagic(magicInstance);
			} catch (error) {
				console.error('Error initializing Magic:', error);
			} finally {
				setIsInitializing(false);
			}
		}
	}, [magic]);

	return (
		<MagicContext.Provider value={{ magic, isInitializing }}>
			{children}
		</MagicContext.Provider>
	);
};

export const useMagic = () => useContext(MagicContext);
