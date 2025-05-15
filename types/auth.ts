// Auth-related types
export interface User {
	email: string;
	address: string;
	loggedIn: boolean;
}

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (email: string) => Promise<void>;
	logout: () => Promise<void>;
}
