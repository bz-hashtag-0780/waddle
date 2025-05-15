import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../../types/auth';
import {
	checkUserLoggedIn,
	loginWithMagic,
	logoutFromMagic,
	initFCL,
} from '../../services/auth';

// Create Auth Context
const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoading: true,
	login: async () => {},
	logout: async () => {},
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Initialize auth state
	useEffect(() => {
		const initAuth = async () => {
			try {
				// Initialize Flow Client Library
				initFCL();

				// Check if user is already logged in
				const loggedInUser = await checkUserLoggedIn();
				setUser(loggedInUser);
			} catch (error) {
				console.error('Error initializing auth:', error);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	// Login with Magic Link
	const login = async (email: string) => {
		try {
			setIsLoading(true);
			const loggedInUser = await loginWithMagic(email);
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

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use Auth Context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
