'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import { MagicProvider } from '../contexts/MagicContext';
import './globals.css';
import '../services/fcl-config';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className} suppressHydrationWarning={true}>
				<MagicProvider>
					<AuthProvider>{children}</AuthProvider>
				</MagicProvider>
			</body>
		</html>
	);
}
