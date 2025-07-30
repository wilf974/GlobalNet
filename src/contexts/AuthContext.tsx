'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterData, User } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock API functions (à remplacer par de vraies API calls)
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'admin@globalnet.fr' && credentials.password === 'admin123') {
      return {
        id: '1',
        email: 'admin@globalnet.fr',
        nom: 'Administrateur GlobalNet',
        role: 'admin',
        telephone: '+33123456789',
        adresse: '123 Rue de la Propreté, 75001 Paris',
        dateCreation: new Date('2023-01-01'),
        derniereConnexion: new Date(),
        actif: true,
      };
    }
    
    if (credentials.email === 'client@example.fr' && credentials.password === 'client123') {
      return {
        id: '2',
        email: 'client@example.fr',
        nom: 'Jean Dupont',
        role: 'client',
        telephone: '+33987654321',
        adresse: '456 Avenue des Clients, 75002 Paris',
        dateCreation: new Date('2024-01-15'),
        derniereConnexion: new Date(),
        actif: true,
      };
    }
    
    throw new Error('Email ou mot de passe incorrect');
  },

  register: async (data: RegisterData): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Date.now().toString(),
      email: data.email,
      nom: data.nom,
      role: 'client',
      telephone: data.telephone,
      adresse: data.adresse,
      dateCreation: new Date(),
      derniereConnexion: new Date(),
      actif: true,
    };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock update
    return {
      id: userId,
      email: data.email || 'user@example.fr',
      nom: data.nom || 'Utilisateur',
      role: data.role || 'client',
      telephone: data.telephone,
      adresse: data.adresse,
      dateCreation: new Date('2024-01-01'),
      derniereConnexion: new Date(),
      actif: true,
    };
  },

  resetPassword: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock: envoi d'email de réinitialisation
    console.log(`Email de réinitialisation envoyé à ${email}`);
  },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('globalnet_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          // Si pas d'utilisateur stocké, on met isLoading à false
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        dispatch({ type: 'LOGOUT' });
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await mockApi.login(credentials);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('globalnet_user', JSON.stringify(user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Erreur de connexion' });
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const user = await mockApi.register(data);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('globalnet_user', JSON.stringify(user));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Erreur d\'inscription' });
    }
  };

  const logout = () => {
    localStorage.removeItem('globalnet_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = await mockApi.updateProfile(state.user.id, data);
      
      // Mettre à jour localStorage
      localStorage.setItem('globalnet_user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Erreur de mise à jour' });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await mockApi.resetPassword(email);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error instanceof Error ? error.message : 'Erreur de réinitialisation' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 