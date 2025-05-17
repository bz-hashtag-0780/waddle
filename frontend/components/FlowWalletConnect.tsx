import React, { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import Button from './Button';

type FlowWalletConnectProps = {
	onConnect?: (address: string) => void;
	onError?: (error: Error) => void;
	buttonText?: string;
	className?: string;
	buttonClassName?: string;
	showAddress?: boolean;
};

const FlowWalletConnect: React.FC<FlowWalletConnectProps> = ({
	onConnect,
	onError,
	buttonText = 'Connect Flow Wallet',
	className = '',
	buttonClassName = '',
	showAddress = true,
}) => {
	const [user, setUser] = useState<{
		addr: string | null;
		loggedIn: boolean | null;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Subscribe to user authentication changes
		const unsubscribe = fcl.currentUser.subscribe(setUser);
		return () => unsubscribe();
	}, []);

	const handleConnect = async () => {
		setIsLoading(true);
		try {
			// Authenticate with FCL
			const authenticatedUser = await fcl.authenticate();
			if (authenticatedUser.addr) {
				// If callback provided, call it with the address
				onConnect?.(authenticatedUser.addr);
			} else {
				throw new Error('Failed to get Flow wallet address');
			}
		} catch (error) {
			console.error('Error connecting to Flow wallet:', error);
			onError?.(
				error instanceof Error
					? error
					: new Error('Unknown error connecting to Flow wallet')
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDisconnect = async () => {
		setIsLoading(true);
		try {
			await fcl.unauthenticate();
		} catch (error) {
			console.error('Error disconnecting from Flow wallet:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`flow-wallet-connect ${className}`}>
			{user?.loggedIn ? (
				<div className="flex flex-col items-center">
					{showAddress && (
						<div className="mb-2 text-sm font-mono bg-gray-100 p-2 rounded break-all">
							{user.addr}
						</div>
					)}
					<Button
						onClick={handleDisconnect}
						disabled={isLoading}
						isLoading={isLoading}
						className={buttonClassName}
					>
						Disconnect Wallet
					</Button>
				</div>
			) : (
				<Button
					onClick={handleConnect}
					disabled={isLoading}
					isLoading={isLoading}
					className={buttonClassName}
				>
					{isLoading ? 'Connecting...' : buttonText}
				</Button>
			)}
		</div>
	);
};

export default FlowWalletConnect;
