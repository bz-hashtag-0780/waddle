'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMagic } from '@/contexts/MagicContext';
import * as fcl from '@onflow/fcl';
import Layout from '@/components/Layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import FlowWalletConnect from '@/components/FlowWalletConnect';

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
	const { magic } = useMagic();
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
		// Reset linking status when moving to a new step
		setLinkingStatus('idle');

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

	// Step 3: Create capability from Magic account to Flow Wallet
	const handleCreateCapability = async () => {
		console.log('====== STEP 3: CREATE CAPABILITY ======');
		console.log('handleCreateCapability called, flowAddress:', flowAddress);
		setLinkingStatus('loading');
		try {
			// Reset error state
			setErrorMessage('');

			// Validate Magic instance
			if (!magic) {
				console.error('Magic is not initialized!');
				throw new Error('Magic is not initialized. Please try again.');
			}

			// Log Magic instance details
			console.log('Magic instance available:', !!magic);
			console.log('Magic user info:', await magic.user.getInfo());
			console.log('Magic flow extension:', !!magic.flow);

			// Log FCL current user
			console.log(
				'FCL current user:',
				await fcl.currentUser().snapshot()
			);

			// FIRST TRANSACTION: Setup Child Account
			// ----------------------------------------
			console.log('STARTING TRANSACTION 1: Setup Child Account');
			console.log('Preparing transaction...');

			let setupTxId;
			try {
				setupTxId = await fcl.mutate({
					cadence: `
						import HybridCustody from 0x294e44e1ec6993c6
						import MetadataViews from 0x1d7e57aa55817448
						
						transaction {
							prepare(acct: AuthAccount) {
								// Debug logging
								log("Starting setup transaction...")
								log("Account address: ".concat(acct.address.toString()))
								
								// Check if ChildAccount already exists
								if acct.borrow<&HybridCustody.ChildAccount>(from: HybridCustody.ChildAccountStoragePath) != nil {
									log("ChildAccount already set up, skipping setup")
									return
								}
								
								// Create a ChildAccount resource
								log("Creating ChildAccount resource...")
								let childAccount <- HybridCustody.createChildAccount()
								
								// Save it to storage
								log("Saving ChildAccount to storage...")
								acct.save(<-childAccount, to: HybridCustody.ChildAccountStoragePath)
								
								// Create public capability
								log("Creating public capability...")
								let cap = acct.capabilities.storage.issue<&HybridCustody.ChildAccount{HybridCustody.ChildAccountPublic}>(HybridCustody.ChildAccountStoragePath)
								acct.capabilities.publish(cap, at: HybridCustody.ChildAccountPublicPath)
								
								log("ChildAccount setup complete")
							}
						}
					`,
					proposer: magic.flow.authorization,
					authorizations: [magic.flow.authorization],
					payer: magic.flow.authorization,
					limit: 999,
				});
				console.log('Setup transaction submitted with ID:', setupTxId);
			} catch (txError: unknown) {
				console.error('Error submitting setup transaction:', txError);
				throw new Error(
					`Setup transaction failed: ${
						txError instanceof Error
							? txError.message
							: 'Unknown error'
					}`
				);
			}

			// Wait for transaction to be sealed
			console.log('Waiting for setup transaction to be sealed...');
			try {
				const setupResult = await fcl.tx(setupTxId).onceSealed();
				console.log('Setup transaction sealed result:', setupResult);
			} catch (sealError) {
				console.error(
					'Error waiting for setup transaction to be sealed:',
					sealError
				);
				throw new Error(
					'Transaction failed to complete. Please try again.'
				);
			}

			// SECOND TRANSACTION: Publish to Parent
			// ----------------------------------------
			console.log('STARTING TRANSACTION 2: Publish to Parent');
			console.log('Preparing publish transaction...');

			let publishTxId;
			try {
				publishTxId = await fcl.mutate({
					cadence: `
						import HybridCustody from 0x294e44e1ec6993c6
						
						transaction(parentAddress: Address) {
							prepare(acct: AuthAccount) {
								// Debug logging
								log("Starting publish transaction...")
								log("Account address: ".concat(acct.address.toString()))
								log("Parent address: ".concat(parentAddress.toString()))
								
								// Borrow child account
								let childAccount = acct.borrow<&HybridCustody.ChildAccount>(from: HybridCustody.ChildAccountStoragePath)
									?? panic("Could not borrow ChildAccount - did you run setup first?")
								
								// Add parent account to list of authorized parents
								log("Publishing to parent...")
								childAccount.publishToParent(parentAddress: parentAddress)
								
								log("Capability published to parent successfully")
							}
						}
					`,
					args: (arg, t) => [arg(flowAddress, t.Address)],
					proposer: magic.flow.authorization,
					authorizations: [magic.flow.authorization],
					payer: magic.flow.authorization,
					limit: 999,
				});
				console.log(
					'Publish transaction submitted with ID:',
					publishTxId
				);
			} catch (txError: unknown) {
				console.error('Error submitting publish transaction:', txError);
				throw new Error(
					`Publish transaction failed: ${
						txError instanceof Error
							? txError.message
							: 'Unknown error'
					}`
				);
			}

			// Wait for transaction to be sealed
			console.log('Waiting for publish transaction to be sealed...');
			try {
				const publishResult = await fcl.tx(publishTxId).onceSealed();
				console.log(
					'Publish transaction sealed result:',
					publishResult
				);
			} catch (sealError) {
				console.error(
					'Error waiting for publish transaction to be sealed:',
					sealError
				);
				throw new Error(
					'Transaction failed to complete. Please try again.'
				);
			}

			setTxId(publishTxId);
			setLinkingStatus('success');
			console.log('Moving to next step');
			nextStep();
		} catch (error: unknown) {
			console.error('Error creating capability (detailed):', error);
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Failed to create capability. Please try again.'
			);
			setLinkingStatus('error');
		}
	};

	// Step 4: Claim capability from Flow Wallet
	const handleClaimCapability = async () => {
		console.log('====== STEP 4: CLAIM CAPABILITY ======');
		console.log(
			'handleClaimCapability called, user address:',
			user?.address
		);
		setLinkingStatus('loading');
		try {
			// Reset error state
			setErrorMessage('');

			// Ensure we have the Magic.link account address
			if (!user?.address) {
				console.error('User address not found');
				throw new Error(
					'Magic.link account address not found. Please reconnect.'
				);
			}

			// Log the current FCL authentication state
			const authState = await fcl.currentUser().snapshot();
			console.log('Current FCL authentication state:', authState);

			if (!authState.loggedIn) {
				console.log(
					'User not logged in to Flow wallet. Prompting login...'
				);
				await fcl.authenticate();
				console.log(
					'User logged in status:',
					(await fcl.currentUser().snapshot()).loggedIn
				);
			}

			// FIRST TRANSACTION: Setup Parent Account
			// ----------------------------------------
			console.log('STARTING TRANSACTION 1: Setup Parent Account');
			console.log('Preparing setup parent transaction...');

			let setupTxId;
			try {
				setupTxId = await fcl.mutate({
					cadence: `
						import HybridCustody from 0x294e44e1ec6993c6
						
						transaction {
							prepare(acct: AuthAccount) {
								// Debug logging
								log("Starting parent setup transaction...")
								log("Parent account address: ".concat(acct.address.toString()))
								
								// Check if parent account already exists
								if acct.borrow<&HybridCustody.ParentAccount>(from: HybridCustody.ParentAccountStoragePath) != nil {
									log("ParentAccount already set up, skipping setup")
									return
								}
								
								// Create new parent account
								log("Creating ParentAccount resource...")
								let parentAccount <- HybridCustody.createParentAccount()
								
								// Save it to storage
								log("Saving ParentAccount to storage...")
								acct.save(<-parentAccount, to: HybridCustody.ParentAccountStoragePath)
								
								log("ParentAccount setup complete")
							}
						}
					`,
					proposer: fcl.authz,
					authorizations: [fcl.authz],
					payer: fcl.authz,
					limit: 999,
				});
				console.log(
					'Setup parent transaction submitted with ID:',
					setupTxId
				);
			} catch (txError: unknown) {
				console.error(
					'Error submitting setup parent transaction:',
					txError
				);
				throw new Error(
					`Setup parent transaction failed: ${
						txError instanceof Error
							? txError.message
							: 'Unknown error'
					}`
				);
			}

			// Wait for transaction to be sealed
			console.log('Waiting for setup parent transaction to be sealed...');
			try {
				const setupResult = await fcl.tx(setupTxId).onceSealed();
				console.log(
					'Setup parent transaction sealed result:',
					setupResult
				);
			} catch (sealError) {
				console.error(
					'Error waiting for setup parent transaction to be sealed:',
					sealError
				);
				throw new Error(
					'Transaction failed to complete. Please try again.'
				);
			}

			// SECOND TRANSACTION: Claim Capability
			// ----------------------------------------
			console.log('STARTING TRANSACTION 2: Claim Capability');
			console.log('Preparing claim transaction...');
			console.log('Using child address for claim:', user.address);

			let claimTxId;
			try {
				claimTxId = await fcl.mutate({
					cadence: `
						import HybridCustody from 0x294e44e1ec6993c6
						
						transaction(childAddress: Address) {
							prepare(acct: AuthAccount) {
								// Debug logging
								log("Starting claim transaction...")
								log("Parent account address: ".concat(acct.address.toString()))
								log("Child address to claim: ".concat(childAddress.toString()))
								
								// Borrow parent account
								let parentAccount = acct.borrow<&HybridCustody.ParentAccount>(from: HybridCustody.ParentAccountStoragePath)
									?? panic("Could not borrow ParentAccount - did you run setup first?")
								
								// Claim child account capability
								log("Claiming child account capability...")
								parentAccount.claimChildAccount(childAddress: childAddress)
								
								log("Capability claimed successfully")
							}
						}
					`,
					args: (arg, t) => [arg(user.address, t.Address)],
					proposer: fcl.authz,
					authorizations: [fcl.authz],
					payer: fcl.authz,
					limit: 999,
				});
				console.log('Claim transaction submitted with ID:', claimTxId);
			} catch (txError: unknown) {
				console.error('Error submitting claim transaction:', txError);
				throw new Error(
					`Claim transaction failed: ${
						txError instanceof Error
							? txError.message
							: 'Unknown error'
					}`
				);
			}

			// Wait for transaction to be sealed
			console.log('Waiting for claim transaction to be sealed...');
			try {
				const claimResult = await fcl.tx(claimTxId).onceSealed();
				console.log('Claim transaction sealed result:', claimResult);
			} catch (sealError) {
				console.error(
					'Error waiting for claim transaction to be sealed:',
					sealError
				);
				throw new Error(
					'Transaction failed to complete. Please try again.'
				);
			}

			setLinkingStatus('success');
			console.log('Moving to next step');
			nextStep();
		} catch (error: unknown) {
			console.error('Error claiming capability (detailed):', error);
			setErrorMessage(
				error instanceof Error
					? error.message
					: 'Failed to claim capability. Please try again.'
			);
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
						<div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left">
							<h3 className="font-medium text-yellow-700 mb-2">
								Before you begin:
							</h3>
							<ul className="list-disc pl-5 text-yellow-600 space-y-1">
								<li>
									Make sure you have a Flow Wallet installed
									(like Blocto or Lilico)
								</li>
								<li>
									You&apos;ll need to approve several
									transactions during the process
								</li>
								<li>
									The linking process is secure and
									doesn&apos;t transfer any assets
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
							<FlowWalletConnect
								onConnect={(address) => {
									setFlowAddress(address);
									setLinkingStatus('success');
									nextStep();
								}}
								onError={(error) => {
									console.error(
										'Error connecting wallet:',
										error
									);
									setErrorMessage(
										error.message ||
											'Failed to connect to Flow Wallet. Please try again.'
									);
									setLinkingStatus('error');
								}}
								buttonText="Connect Flow Wallet"
								showAddress={false}
							/>
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
							your Flow Wallet. This step authorizes your Flow
							wallet to access assets in your Magic.link account.
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

						<div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
							<h3 className="font-medium text-blue-700 mb-2">
								What happens in this step:
							</h3>
							<ol className="list-decimal pl-5 text-blue-600 space-y-1">
								<li>
									Your Magic.link account will be prepared for
									linking
								</li>
								<li>
									You&apos;ll sign a transaction that creates
									the capability
								</li>
								<li>
									This will allow your Flow wallet to access
									your assets
								</li>
							</ol>
						</div>

						{/* Success state */}
						{linkingStatus === 'success' && (
							<div className="bg-green-50 p-4 rounded-lg mb-6">
								<p className="text-green-600 font-medium mb-2">
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
						)}

						{/* Loading state */}
						{linkingStatus === 'loading' && (
							<div className="space-y-4">
								<div className="animate-pulse flex space-x-4 items-center justify-center">
									<div className="rounded-full bg-blue-400 h-8 w-8"></div>
									<div className="h-4 bg-blue-400 rounded w-48"></div>
								</div>
								<div className="text-blue-600">
									{!txId ? (
										<>
											Creating capability, please approve
											transactions in your wallet...
										</>
									) : (
										<>
											Waiting for transaction to be sealed
											on the blockchain...
										</>
									)}
								</div>
								<button
									disabled={true}
									className="opacity-50 cursor-not-allowed py-2 px-4 bg-blue-100 text-blue-400 rounded-md"
								>
									Creating...
								</button>
							</div>
						)}

						{/* Idle state */}
						{linkingStatus === 'idle' && (
							<>
								<Button
									onClick={handleCreateCapability}
									disabled={false}
									isLoading={false}
								>
									Create Capability
								</Button>
								<p className="text-sm text-gray-500 mt-2">
									You&apos;ll need to approve two transactions
									in your Magic.link wallet
								</p>
							</>
						)}

						{/* Error state */}
						{linkingStatus === 'error' && (
							<div className="mt-4 p-3 bg-red-50 rounded-lg text-red-500 text-left">
								<p className="font-medium mb-1">Error:</p>
								<p>{errorMessage}</p>
								<p className="mt-2 text-sm">
									Please try again. If the error persists,
									refresh the page and reconnect your wallet.
								</p>
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
							complete the linking process. This step finalizes
							the connection between your accounts.
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

						<div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
							<h3 className="font-medium text-blue-700 mb-2">
								What happens in this step:
							</h3>
							<ol className="list-decimal pl-5 text-blue-600 space-y-1">
								<li>
									Your Flow wallet will accept the capability
									created in the previous step
								</li>
								<li>
									You&apos;ll need to sign a transaction from
									your Flow wallet
								</li>
								<li>
									This completes the link between your
									accounts
								</li>
							</ol>
						</div>

						{/* Success state */}
						{linkingStatus === 'success' && (
							<div className="bg-green-50 p-4 rounded-lg mb-6">
								<p className="text-green-600">
									Capability claimed successfully!
								</p>
								<Button onClick={nextStep} className="mt-4">
									Continue
								</Button>
							</div>
						)}

						{/* Loading state */}
						{linkingStatus === 'loading' && (
							<div className="space-y-4">
								<div className="animate-pulse flex space-x-4 items-center justify-center">
									<div className="rounded-full bg-blue-400 h-8 w-8"></div>
									<div className="h-4 bg-blue-400 rounded w-48"></div>
								</div>
								<div className="text-blue-600">
									Processing transaction with Flow wallet...
								</div>
								<button
									disabled={true}
									className="opacity-50 cursor-not-allowed py-2 px-4 bg-blue-100 text-blue-400 rounded-md"
								>
									Claiming...
								</button>
							</div>
						)}

						{/* Idle state */}
						{linkingStatus === 'idle' && (
							<Button
								onClick={handleClaimCapability}
								disabled={false}
								isLoading={false}
							>
								Claim Capability
							</Button>
						)}

						{/* Error state */}
						{linkingStatus === 'error' && (
							<div className="mt-4 p-3 bg-red-50 rounded-lg text-red-500 text-left">
								<p className="font-medium mb-1">Error:</p>
								<p>{errorMessage}</p>
								<p className="mt-2 text-sm">
									Please try again. If the error persists,
									refresh the page and reconnect your wallet.
								</p>
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
							<div className="bg-white p-4 rounded-lg mb-6">
								<p className="text-gray-600">
									Flow Wallet address:
								</p>
								<p className="font-mono text-sm break-all">
									{flowAddress}
								</p>
							</div>

							<div className="bg-blue-50 p-4 rounded-lg text-left">
								<h3 className="font-medium text-blue-700 mb-2">
									What you can do now:
								</h3>
								<ul className="list-disc pl-5 text-blue-600 space-y-1">
									<li>
										Access your Hotspot Operator NFTs from
										both accounts
									</li>
									<li>
										Use your Flow wallet with other dApps
										while maintaining access
									</li>
									<li>
										Manage your assets using either account
									</li>
								</ul>
							</div>
						</div>

						<div className="flex space-x-4 justify-center">
							<Button onClick={handleFinish}>
								Return to Dashboard
							</Button>
							<Button
								onClick={() =>
									window.open(
										'https://flowscan.org',
										'_blank'
									)
								}
								variant="outline"
							>
								View on FlowScan
							</Button>
						</div>
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
