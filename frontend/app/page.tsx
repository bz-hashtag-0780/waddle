'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';

export default function Home() {
	const { user } = useAuth();

	return (
		<div className="bg-white">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div
					className="absolute inset-y-0 h-full w-full"
					aria-hidden="true"
				>
					<div className="relative h-full">
						<svg
							className="absolute right-full translate-y-1/3 translate-x-1/4 transform sm:translate-x-1/2 md:translate-y-1/2 lg:translate-x-full"
							width="404"
							height="784"
							fill="none"
							viewBox="0 0 404 784"
						>
							<defs>
								<pattern
									id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
									x="0"
									y="0"
									width="20"
									height="20"
									patternUnits="userSpaceOnUse"
								>
									<rect
										x="0"
										y="0"
										width="4"
										height="4"
										className="text-gray-200"
										fill="currentColor"
									/>
								</pattern>
							</defs>
							<rect
								width="404"
								height="784"
								fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)"
							/>
						</svg>
						<svg
							className="absolute left-full -translate-y-3/4 -translate-x-1/4 transform sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
							width="404"
							height="784"
							fill="none"
							viewBox="0 0 404 784"
						>
							<defs>
								<pattern
									id="d2a68204-c383-44b1-b99f-42ccff4e5365"
									x="0"
									y="0"
									width="20"
									height="20"
									patternUnits="userSpaceOnUse"
								>
									<rect
										x="0"
										y="0"
										width="4"
										height="4"
										className="text-gray-200"
										fill="currentColor"
									/>
								</pattern>
							</defs>
							<rect
								width="404"
								height="784"
								fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
							/>
						</svg>
					</div>
				</div>

				<div className="relative pt-6 pb-16 sm:pb-24">
					{/* Header */}
					<div className="mx-auto max-w-7xl px-4 sm:px-6">
						<nav
							className="relative flex items-center justify-between sm:h-10 md:justify-center"
							aria-label="Global"
						>
							<div className="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
								<div className="flex w-full items-center justify-between md:w-auto">
									<Link
										href="/"
										className="text-2xl font-bold text-[rgb(117,206,254)]"
									>
										Waddle $5G
									</Link>
									<div className="-mr-2 flex items-center md:hidden">
										<button
											type="button"
											className="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
											aria-expanded="false"
										>
											<span className="sr-only">
												Open main menu
											</span>
											<svg
												className="h-6 w-6"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M4 6h16M4 12h16M4 18h16"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
							<div className="hidden md:flex md:space-x-10">
								<Link
									href="/network"
									className="font-medium text-gray-500 hover:text-gray-900"
								>
									Network Map
								</Link>
								<Link
									href="#features"
									className="font-medium text-gray-500 hover:text-gray-900"
								>
									Features
								</Link>
							</div>
							<div className="hidden md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end">
								{user ? (
									<Link
										href="/dashboard"
										className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)]"
									>
										Dashboard
									</Link>
								) : (
									<Link
										href="/login"
										className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)]"
									>
										Log in
									</Link>
								)}
							</div>
						</nav>
					</div>

					{/* Hero Content */}
					<div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
						<div className="text-center">
							<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
								<span className="block">
									Decentralized 5G Network
								</span>
								<span className="block text-[rgb(117,206,254)]">
									on Flow Blockchain
								</span>
							</h1>
							<p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
								Deploy mini 5G hotspots, prove uptime, and earn
								rewards through transparent smart contracts.
							</p>
							<div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
								<div className="rounded-md shadow">
									<Link
										href={user ? '/dashboard' : '/login'}
										className="flex w-full items-center justify-center rounded-md border border-transparent bg-[rgb(80,202,255)] px-8 py-3 text-base font-medium text-white hover:bg-[rgb(117,206,254)] md:py-4 md:px-10 md:text-lg"
									>
										{user
											? 'Go to Dashboard'
											: 'Join the Network'}
									</Link>
								</div>
								<div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
									<Link
										href="/network"
										className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-[rgb(117,206,254)] hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
									>
										View Network Map
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Feature Section */}
			<div className="bg-gray-50 py-16 sm:py-24" id="features">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-base font-semibold uppercase tracking-wide text-[rgb(117,206,254)]">
							Features
						</h2>
						<p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
							How it Works
						</p>
						<p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
							Transforming 5G infrastructure from centralized to
							community-powered
						</p>
					</div>

					<div className="mt-12">
						<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
							<div className="pt-6">
								<div className="flow-root bg-white rounded-lg px-6 pb-8">
									<div className="-mt-6">
										<div>
											<span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
												<svg
													className="h-6 w-6 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
													/>
												</svg>
											</span>
										</div>
										<h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
											NFT Hotspot Ownership
										</h3>
										<p className="mt-5 text-base text-gray-500">
											Acquire a unique NFT that grants you
											the right to operate a 5G hotspot on
											our network.
										</p>
									</div>
								</div>
							</div>

							<div className="pt-6">
								<div className="flow-root bg-white rounded-lg px-6 pb-8">
									<div className="-mt-6">
										<div>
											<span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
												<svg
													className="h-6 w-6 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
													/>
												</svg>
											</span>
										</div>
										<h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
											Transparent Uptime Tracking
										</h3>
										<p className="mt-5 text-base text-gray-500">
											Your hotspot submits proof of
											availability to smart contracts,
											ensuring fair and transparent
											rewards.
										</p>
									</div>
								</div>
							</div>

							<div className="pt-6">
								<div className="flow-root bg-white rounded-lg px-6 pb-8">
									<div className="-mt-6">
										<div>
											<span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
												<svg
													className="h-6 w-6 text-white"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</span>
										</div>
										<h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
											Automated Rewards
										</h3>
										<p className="mt-5 text-base text-gray-500">
											Earn tokens automatically based on
											your hotspot's uptime and coverage
											quality.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-[rgb(117,206,254)]">
				<div className="mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-extrabold text-white sm:text-4xl">
						<span className="block">
							Transform 5G infrastructure
						</span>
						<span className="block">Join our network today</span>
					</h2>
					<p className="mt-4 text-lg leading-6 text-blue-200">
						Be part of the decentralized 5G revolution and earn
						rewards while providing essential connectivity.
					</p>
					<Link
						href={user ? '/dashboard' : '/login'}
						className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-[rgb(117,206,254)] hover:bg-blue-50 sm:w-auto"
					>
						{user ? 'Go to Dashboard' : 'Get Started'}
					</Link>
				</div>
			</div>
		</div>
	);
}
