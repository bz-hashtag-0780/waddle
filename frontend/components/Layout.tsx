/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						{/* Logo and Navigation */}
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<Link href="/" className="flex items-center">
									<img
										src="/waddle_logo.png"
										alt="Waddle Logo"
										className="h-8 w-8 mr-2 rounded-lg"
									/>
									<span className="text-2xl font-bold text-[rgb(117,206,254)]">
										Waddle $5G
									</span>
								</Link>
							</div>
							<nav className="ml-6 flex space-x-8">
								<Link
									href="/dashboard"
									className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
								>
									Dashboard
								</Link>
								<Link
									href="/network"
									className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
								>
									Network Map
								</Link>
								<Link
									href="/nfts"
									className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
								>
									NFTs
								</Link>
								<Link
									href="/account-linking"
									className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
								>
									Account Linking
								</Link>
							</nav>
						</div>

						{/* User menu */}
						<div className="flex items-center">
							{user ? (
								<div className="flex items-center space-x-4">
									<span className="text-sm text-gray-700 truncate max-w-xs">
										{user.email}
									</span>
									<button
										onClick={() => logout()}
										className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)]"
									>
										Logout
									</button>
								</div>
							) : (
								<Link
									href="/login"
									className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[rgb(80,202,255)] hover:bg-[rgb(117,206,254)]"
								>
									Login
								</Link>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main>
				<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
					{children}
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="py-6 md:flex md:items-center md:justify-between">
						<div className="text-center md:text-left">
							<p className="text-sm text-gray-500">
								&copy; 2025 Waddle $5G Network. All rights
								reserved.
							</p>
						</div>
						<div className="mt-4 flex justify-center md:mt-0">
							<p className="text-sm text-gray-500">
								Decentralized 5G Network on Flow Blockchain
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
