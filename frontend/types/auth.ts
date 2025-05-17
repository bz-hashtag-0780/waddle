// Auth-related types
export interface User {
	email: string;
	address: string;
	addr?: string; // Flow FCL style address
	loggedIn: boolean;
}

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isInitialized?: boolean;
	isAuthenticated?: boolean;
	login: (email: string) => Promise<void>;
	logout: () => Promise<void>;
}
