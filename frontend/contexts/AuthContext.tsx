'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types/auth';
import {
	checkUserLoggedIn,
	loginWithMagic,
	logoutFromMagic,
	initFCL,
} from '../services/auth';
import { useMagic } from './MagicContext';

// Create Auth Context
const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoading: true,
	isInitialized: false,
	isAuthenticated: false,
	login: async () => {},
	logout: async () => {},
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { magic, isInitializing } = useMagic();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isInitialized, setIsInitialized] = useState<boolean>(false);

	// Initialize auth state
	useEffect(() => {
		const initAuth = async () => {
			try {
				// Initialize Flow Client Library
				initFCL();

				// Don't proceed until Magic is ready
				if (isInitializing || !magic) return;

				// Check if user is already logged in
				const loggedInUser = await checkUserLoggedIn();

				// If we get a user from FCL, also add the addr field
				// for compatibility with components expecting FCL user format
				if (loggedInUser) {
					loggedInUser.addr = loggedInUser.address;
				}

				setUser(loggedInUser);
			} catch (error) {
				console.error('Error initializing auth:', error);
			} finally {
				setIsLoading(false);
				setIsInitialized(true);
			}
		};

		initAuth();
	}, [isInitializing, magic]);

	// Login with Magic Link
	const login = async (email: string) => {
		try {
			setIsLoading(true);
			const loggedInUser = await loginWithMagic(email);

			// Add addr field for compatibility with FCL components
			loggedInUser.addr = loggedInUser.address;

			setUser(loggedInUser);
		} catch (error) {
			console.error('Error logging in:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Logout from Magic Link
	const logout = async () => {
		try {
			setIsLoading(true);
			await logoutFromMagic();
			setUser(null);
		} catch (error) {
			console.error('Error logging out:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Compute isAuthenticated based on user state
	const isAuthenticated = user !== null && user.loggedIn;

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isInitialized,
				isAuthenticated,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
