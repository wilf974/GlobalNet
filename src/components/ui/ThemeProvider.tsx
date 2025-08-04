'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  enableAnimations?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'globalnet-theme',
  enableSystem = true,
  enableAnimations = true
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Détecter le thème système
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Appliquer le thème au DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const actualTheme = newTheme === 'system' ? getSystemTheme() : newTheme;
    
    // Supprimer les classes existantes
    root.classList.remove('light', 'dark');
    
    // Ajouter la nouvelle classe
    root.classList.add(actualTheme);
    
    // Mettre à jour l'état
    setIsDark(actualTheme === 'dark');
    
    // Mettre à jour les meta tags
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#1f2937' : '#ffffff');
    }
  }, [getSystemTheme]);

  // Charger le thème depuis le stockage
  const loadTheme = useCallback(() => {
    if (typeof window === 'undefined') return defaultTheme;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'system')) {
        return stored as Theme;
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du thème:', error);
    }
    
    return defaultTheme;
  }, [defaultTheme, storageKey]);

  // Sauvegarder le thème
  const saveTheme = useCallback((newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du thème:', error);
    }
  }, [storageKey]);

  // Initialisation
  useEffect(() => {
    const savedTheme = loadTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
    setMounted(true);
  }, [loadTheme, applyTheme]);

  // Écouter les changements de thème système
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem, applyTheme]);

  // Appliquer le thème quand il change
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    saveTheme(theme);
  }, [theme, mounted, applyTheme, saveTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return enableSystem ? 'system' : 'light';
      return 'light';
    });
  }, [enableSystem]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {enableAnimations && (
        <AnimatePresence>
          {mounted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-4 left-4 z-50"
            >
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le thème
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Composant de toggle du thème
const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'system':
        return 'Système';
      default:
        return 'Clair';
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={toggleTheme}
        className={`
          p-3 rounded-full shadow-lg border transition-colors
          ${isDark 
            ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700' 
            : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'
          }
        `}
        title={`Thème actuel: ${getThemeLabel()}`}
      >
        {getThemeIcon()}
      </motion.button>

      {/* Menu déroulant pour sélection directe */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          >
            <div className="space-y-1">
              <button
                onClick={() => setTheme('light')}
                className={`
                  w-full px-3 py-2 text-sm rounded flex items-center space-x-2 transition-colors
                  ${theme === 'light' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Sun className="w-4 h-4" />
                <span>Clair</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`
                  w-full px-3 py-2 text-sm rounded flex items-center space-x-2 transition-colors
                  ${theme === 'dark' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Moon className="w-4 h-4" />
                <span>Sombre</span>
              </button>
              
              <button
                onClick={() => setTheme('system')}
                className={`
                  w-full px-3 py-2 text-sm rounded flex items-center space-x-2 transition-colors
                  ${theme === 'system' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Monitor className="w-4 h-4" />
                <span>Système</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeProvider; 