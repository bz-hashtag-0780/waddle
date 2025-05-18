'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';

const LoginPage = () => {
	const router = useRouter();
	const { login, isLoading, isAuthenticated, isInitialized } = useAuth();
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [apiKeyStatus, setApiKeyStatus] = useState<string>('Checking...');

	// Check if user is already authenticated and redirect to dashboard
	useEffect(() => {
		if (isInitialized && !isLoading && isAuthenticated) {
			console.log('User already authenticated, redirecting to dashboard');
			router.push('/dashboard');
		}
	}, [isInitialized, isLoading, isAuthenticated, router]);

	useEffect(() => {
		// Check if our Magic Link API key is properly loaded
		const apiKey = process.env.NEXT_PUBLIC_MAGIC_API_KEY;
		if (apiKey) {
			// We don't want to show the full API key for security reasons
			// Just show the first few characters to confirm it's loaded
			setApiKeyStatus(
				`Magic API Key loaded: ${apiKey.substring(0, 5)}...`
			);
		} else {
			setApiKeyStatus(
				'Magic API Key not found in environment variables!'
			);
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email) {
			setError('Please enter your email address.');
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError('Please enter a valid email address.');
			return;
		}

		try {
			setError('');
			await login(email);
			router.push('/dashboard');
		} catch (err) {
			console.error('Login error:', err);
			setError('Failed to login. Please try again.');
		}
	};

	// Show loading spinner if auth is initializing or checking
	if (isLoading || !isInitialized) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="inline-block">
						<svg
							className="animate-spin h-10 w-10 text-[rgb(117,206,254)]"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					</div>
					<p className="mt-2 text-sm text-gray-500">
						Checking authentication...
					</p>
				</div>
			</div>
		);
	}

	// Only show login form if user is not authenticated
	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="w-full max-w-md">
				<div className="text-center mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						Waddle 5G Network
					</h1>
					<p className="mt-2 text-sm text-gray-600">
						Sign in to manage your 5G hotspots and earn rewards
					</p>
				</div>

				<Card>
					<form onSubmit={handleSubmit} className="space-y-6">
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-md p-4">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<Input
							label="Email address"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							required
							fullWidth
						/>

						<Button
							type="submit"
							variant="primary"
							fullWidth
							isLoading={isLoading}
							disabled={isLoading}
						>
							Sign in with Magic Link
						</Button>

						<div className="text-sm text-center">
							<p className="text-gray-500">
								No registration needed. We&apos;ll send a magic
								link to your email.
							</p>
						</div>
					</form>
				</Card>

				{/* API Key Status */}
				<div className="mt-4 text-center">
					<p
						className={`text-sm ${
							apiKeyStatus.includes('not found')
								? 'text-red-500'
								: 'text-green-500'
						}`}
					>
						{apiKeyStatus}
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
