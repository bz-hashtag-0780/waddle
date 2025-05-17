'use client';

import { useState } from 'react';
import { mintNFTComplete } from '../services/flow';
import Button from './Button';
import Card from './Card';
import { useMagic } from '../contexts/MagicContext';

interface NFTMinterProps {
	onSuccess?: (nftId: number) => void;
}

export default function NFTMinter({ onSuccess }: NFTMinterProps) {
	const { magic } = useMagic();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [commitTxId, setCommitTxId] = useState<string | null>(null);
	const [revealTxId, setRevealTxId] = useState<string | null>(null);
	const [step, setStep] = useState<
		'idle' | 'committing' | 'waiting' | 'revealing' | 'complete'
	>('idle');

	const handleMintNFT = async () => {
		if (!magic) {
			setError('Magic not initialized. Please try again.');
			return;
		}

		setIsLoading(true);
		setError(null);
		setStep('committing');

		try {
			// Execute the mint NFT process (commit and reveal)
			const { commitTxId, revealTxId } = await mintNFTComplete(magic);

			// Update state with transaction IDs
			setCommitTxId(commitTxId);
			setRevealTxId(revealTxId);
			setStep('complete');

			// Call onSuccess callback if provided (with mock NFT ID for now)
			if (onSuccess) {
				onSuccess(Date.now()); // Using timestamp as a mock ID
			}
		} catch (error) {
			console.error('Error minting NFT:', error);
			setError(
				error instanceof Error
					? error.message
					: 'Failed to mint NFT. Please try again.'
			);
			setStep('idle');
		} finally {
			setIsLoading(false);
		}
	};

	const renderStepMessage = () => {
		switch (step) {
			case 'committing':
				return 'Submitting commit transaction...';
			case 'waiting':
				return 'Waiting for commit transaction to be sealed...';
			case 'revealing':
				return 'Submitting reveal transaction...';
			case 'complete':
				return 'NFT successfully minted!';
			default:
				return 'Click below to mint your Hotspot Operator NFT';
		}
	};

	const renderTransactionInfo = () => {
		if (!commitTxId && !revealTxId) return null;

		return (
			<div className="mt-4 text-sm">
				{commitTxId && (
					<div>
						<p className="font-semibold">Commit Transaction:</p>
						<p className="text-gray-600 break-all">{commitTxId}</p>
					</div>
				)}
				{revealTxId && (
					<div className="mt-2">
						<p className="font-semibold">Reveal Transaction:</p>
						<p className="text-gray-600 break-all">{revealTxId}</p>
					</div>
				)}
			</div>
		);
	};

	return (
		<Card title="Mint Hotspot Operator NFT">
			<div className="flex flex-col items-center">
				<div className="mb-4 text-center">
					<p className="text-lg mb-2">{renderStepMessage()}</p>
					<p className="text-sm text-gray-600">
						This NFT allows you to register and operate hotspots on
						our 5G network.
					</p>
				</div>

				{error && (
					<div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 w-full">
						{error}
					</div>
				)}

				{step === 'complete' ? (
					<div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 w-full text-center">
						Your NFT has been successfully minted! Check your
						collection to view it.
					</div>
				) : (
					<Button
						onClick={handleMintNFT}
						disabled={isLoading || step !== 'idle' || !magic}
						isLoading={isLoading}
					>
						{isLoading ? 'Minting...' : 'Mint NFT'}
					</Button>
				)}

				{renderTransactionInfo()}
			</div>
		</Card>
	);
}
