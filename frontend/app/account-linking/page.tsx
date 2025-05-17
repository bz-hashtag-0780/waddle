'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

// Define step types
type Step =
	| 'intro'
	| 'connect-wallet'
	| 'create-capability'
	| 'claim-capability'
	| 'success';

// Linking status
type LinkingStatus = 'idle' | 'loading' | 'error' | 'success';

export default function AccountLinkingPage() {
	const router = useRouter();
	const { user, isLoading: authLoading, isAuthenticated } = useAuth();
	const [currentStep, setCurrentStep] = useState<Step>('intro');
	const [linkingStatus, setLinkingStatus] = useState<LinkingStatus>('idle');
	const [flowAddress, setFlowAddress] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [txId, setTxId] = useState<string>('');

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [authLoading, isAuthenticated, router]);

	// Progress to next step
	const nextStep = () => {
		switch (currentStep) {
			case 'intro':
				setCurrentStep('connect-wallet');
				break;
			case 'connect-wallet':
				setCurrentStep('create-capability');
				break;
			case 'create-capability':
				setCurrentStep('claim-capability');
				break;
			case 'claim-capability':
				setCurrentStep('success');
				break;
			default:
				break;
		}
	};

	// Step 1: Start the process - check if user is already authenticated
	const handleStart = () => {
		if (isAuthenticated) {
			nextStep();
		} else {
			router.push('/login');
		}
	};

	// Step 2: Connect Flow Wallet
	const handleConnectWallet = async () => {
		setLinkingStatus('loading');
		try {
			// TODO: Implement FCL wallet connection
			// This will be replaced with actual FCL connection code
			console.log('Connecting to Flow Wallet...');

			// Simulate successful connection
			setTimeout(() => {
				setFlowAddress('0x1234567890abcdef'); // Placeholder address
				setLinkingStatus('success');
				nextStep();
			}, 2000);
		} catch (error) {
			console.error('Error connecting wallet:', error);
			setErrorMessage(
				'Failed to connect to Flow Wallet. Please try again.'
			);
			setLinkingStatus('error');
		}
	};

	// Step 3: Create capability from Magic account to Flow Wallet
	const handleCreateCapability = async () => {
		setLinkingStatus('loading');
		try {
			// TODO: Implement capability creation transaction
			console.log('Creating capability...');

			// Simulate successful capability creation
			setTimeout(() => {
				setTxId('0x9876543210fedcba'); // Placeholder transaction ID
				setLinkingStatus('success');
				nextStep();
			}, 2000);
		} catch (error) {
			console.error('Error creating capability:', error);
			setErrorMessage('Failed to create capability. Please try again.');
			setLinkingStatus('error');
		}
	};

	// Step 4: Claim capability from Flow Wallet
	const handleClaimCapability = async () => {
		setLinkingStatus('loading');
		try {
			// TODO: Implement capability claiming transaction
			console.log('Claiming capability...');

			// Simulate successful capability claiming
			setTimeout(() => {
				setLinkingStatus('success');
				nextStep();
			}, 2000);
		} catch (error) {
			console.error('Error claiming capability:', error);
			setErrorMessage('Failed to claim capability. Please try again.');
			setLinkingStatus('error');
		}
	};

	// Return to dashboard
	const handleFinish = () => {
		router.push('/dashboard');
	};

	// Render the current step
	const renderStep = () => {
		switch (currentStep) {
			case 'intro':
				return (
					<div className="text-center">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Link Your Accounts
						</h2>
						<p className="text-gray-600 mb-6">
							Link your Magic.link account to your Flow Wallet to
							gain full control of your assets.
						</p>
						<div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
							<h3 className="font-medium text-blue-700 mb-2">
								What does account linking do?
							</h3>
							<ul className="list-disc pl-5 text-blue-600 space-y-1">
								<li>
									Gives you full control over your assets from
									your Flow Wallet
								</li>
								<li>
									Access your Hotspot Operator NFTs across
									multiple apps
								</li>
								<li>
									Maintain your assets even if you can&apos;t
									access this app
								</li>
								<li>
									Enhanced security through multi-account
									ownership
								</li>
							</ul>
						</div>
						<Button onClick={handleStart}>
							Start Linking Process
						</Button>
					</div>
				);

			case 'connect-wallet':
				return (
					<div className="text-center">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Connect Your Flow Wallet
						</h2>
						<p className="text-gray-600 mb-6">
							Connect your Flow Wallet to link it with your
							Magic.link account.
						</p>
						<div className="bg-gray-100 p-4 rounded-lg mb-6">
							<p className="text-gray-600">
								Your Magic.link address:
							</p>
							<p className="font-mono text-sm break-all">
								{user?.address || 'Loading...'}
							</p>
						</div>
						{linkingStatus === 'success' ? (
							<div className="bg-green-50 p-4 rounded-lg mb-6">
								<p className="text-green-600">
									Flow Wallet connected successfully!
								</p>
								<p className="font-mono text-sm break-all mt-2">
									{flowAddress}
								</p>
								<Button onClick={nextStep} className="mt-4">
									Continue
								</Button>
							</div>
						) : (
							<Button
								onClick={handleConnectWallet}
								disabled={linkingStatus === 'loading'}
								isLoading={linkingStatus === 'loading'}
							>
								{linkingStatus === 'loading'
									? 'Connecting...'
									: 'Connect Flow Wallet'}
							</Button>
						)}
						{linkingStatus === 'error' && (
							<div className="mt-4 text-red-500">
								{errorMessage}
							</div>
						)}
					</div>
				);

			case 'create-capability':
				return (
					<div className="text-center">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Create Capability
						</h2>
						<p className="text-gray-600 mb-6">
							Create a capability from your Magic.link account to
							your Flow Wallet.
						</p>
						<div className="flex items-center justify-center mb-6">
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-gray-600">Magic.link</p>
								<p className="font-mono text-sm truncate max-w-xs">
									{user?.address || 'Loading...'}
								</p>
							</div>
							<div className="mx-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-blue-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-gray-600">Flow Wallet</p>
								<p className="font-mono text-sm truncate max-w-xs">
									{flowAddress}
								</p>
							</div>
						</div>
						{linkingStatus === 'success' ? (
							<div className="bg-green-50 p-4 rounded-lg mb-6">
								<p className="text-green-600">
									Capability created successfully!
								</p>
								<p className="text-sm mt-2">Transaction ID:</p>
								<p className="font-mono text-xs break-all mt-1">
									{txId}
								</p>
								<Button onClick={nextStep} className="mt-4">
									Continue
								</Button>
							</div>
						) : (
							<Button
								onClick={handleCreateCapability}
								disabled={linkingStatus === 'loading'}
								isLoading={linkingStatus === 'loading'}
							>
								{linkingStatus === 'loading'
									? 'Creating...'
									: 'Create Capability'}
							</Button>
						)}
						{linkingStatus === 'error' && (
							<div className="mt-4 text-red-500">
								{errorMessage}
							</div>
						)}
					</div>
				);

			case 'claim-capability':
				return (
					<div className="text-center">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							Claim Capability
						</h2>
						<p className="text-gray-600 mb-6">
							Claim the capability from your Flow Wallet to
							complete the linking process.
						</p>
						<div className="flex items-center justify-center mb-6">
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-gray-600">Magic.link</p>
								<p className="font-mono text-sm truncate max-w-xs">
									{user?.address || 'Loading...'}
								</p>
							</div>
							<div className="mx-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-blue-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 7l5 5m0 0l-5 5m5-5H6"
									/>
								</svg>
							</div>
							<div className="bg-gray-100 p-4 rounded-lg">
								<p className="text-gray-600">Flow Wallet</p>
								<p className="font-mono text-sm truncate max-w-xs">
									{flowAddress}
								</p>
							</div>
						</div>
						{linkingStatus === 'success' ? (
							<div className="bg-green-50 p-4 rounded-lg mb-6">
								<p className="text-green-600">
									Capability claimed successfully!
								</p>
								<Button onClick={nextStep} className="mt-4">
									Continue
								</Button>
							</div>
						) : (
							<Button
								onClick={handleClaimCapability}
								disabled={linkingStatus === 'loading'}
								isLoading={linkingStatus === 'loading'}
							>
								{linkingStatus === 'loading'
									? 'Claiming...'
									: 'Claim Capability'}
							</Button>
						)}
						{linkingStatus === 'error' && (
							<div className="mt-4 text-red-500">
								{errorMessage}
							</div>
						)}
					</div>
				);

			case 'success':
				return (
					<div className="text-center">
						<div className="bg-green-50 p-8 rounded-lg mb-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-16 w-16 text-green-500 mx-auto mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<h2 className="text-2xl font-semibold text-green-700 mb-4">
								Account Linking Complete!
							</h2>
							<p className="text-green-600 mb-6">
								Your Magic.link account has been successfully
								linked to your Flow Wallet.
							</p>
							<div className="bg-white p-4 rounded-lg mb-4">
								<p className="text-gray-600">
									Magic.link address:
								</p>
								<p className="font-mono text-sm break-all">
									{user?.address || 'Loading...'}
								</p>
							</div>
							<div className="bg-white p-4 rounded-lg">
								<p className="text-gray-600">
									Flow Wallet address:
								</p>
								<p className="font-mono text-sm break-all">
									{flowAddress}
								</p>
							</div>
						</div>
						<Button onClick={handleFinish}>
							Return to Dashboard
						</Button>
					</div>
				);

			default:
				return null;
		}
	};

	// Render the step progress bar
	const renderProgressBar = () => {
		const steps = [
			{ id: 'intro', label: 'Intro' },
			{ id: 'connect-wallet', label: 'Connect Wallet' },
			{ id: 'create-capability', label: 'Create Capability' },
			{ id: 'claim-capability', label: 'Claim Capability' },
			{ id: 'success', label: 'Success' },
		];

		return (
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{steps.map((step, index) => (
						<React.Fragment key={step.id}>
							<div className="flex flex-col items-center">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${
										currentStep === step.id
											? 'bg-blue-500 text-white'
											: steps.indexOf(
													steps.find(
														(s) =>
															s.id === currentStep
													)!
											  ) > index
											? 'bg-green-500 text-white'
											: 'bg-gray-200 text-gray-600'
									}`}
								>
									{steps.indexOf(
										steps.find((s) => s.id === currentStep)!
									) > index ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									) : (
										index + 1
									)}
								</div>
								<div className="text-xs mt-1">{step.label}</div>
							</div>
							{index < steps.length - 1 && (
								<div
									className={`flex-1 h-1 mx-2 ${
										steps.indexOf(
											steps.find(
												(s) => s.id === currentStep
											)!
										) > index
											? 'bg-green-500'
											: 'bg-gray-200'
									}`}
								></div>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
		);
	};

	// If still loading auth state, show loading indicator
	if (authLoading) {
		return (
			<Layout>
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</Layout>
		);
	}

	// If not authenticated, we'll redirect in the useEffect
	if (!isAuthenticated) {
		return null;
	}

	return (
		<Layout>
			<div className="max-w-4xl mx-auto">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Account Linking
				</h1>
				<p className="text-gray-600 mb-6">
					Link your Magic.link account to your Flow Wallet for
					enhanced ownership.
				</p>

				{renderProgressBar()}

				<Card>
					<div className="p-6">{renderStep()}</div>
				</Card>
			</div>
		</Layout>
	);
}
