'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';

const LoginPage = () => {
	const router = useRouter();
	const { login, isLoading } = useAuth();
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');

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
								No registration needed. We'll send a magic link
								to your email.
							</p>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
