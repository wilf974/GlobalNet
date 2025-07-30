export interface User {
  id: string;
  email: string;
  nom: string;
  role: 'admin' | 'client' | 'employee';
  telephone?: string;
  adresse?: string;
  dateCreation: Date;
  derniereConnexion?: Date;
  actif: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  telephone?: string;
  adresse?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
} 