'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, User, LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';
import { APP_CONFIG } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'À Propos', href: '/about' },
    { name: 'Devis', href: '/devis' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">GN</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GlobalNet</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone size={16} />
              <span>{APP_CONFIG.contact.telephone}</span>
            </div>
            {user ? (
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => window.location.href = '/dashboard'}>
                  <User size={16} className="mr-1" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                >
                  <LogOut size={16} className="mr-1" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = '/auth'}>
                Connexion
              </Button>
            )}
            <Button size="sm" onClick={() => window.location.href = '/devis'}>
              Devis Gratuit
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-primary transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Phone size={16} />
                  <span>{APP_CONFIG.contact.telephone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Mail size={16} />
                  <span>{APP_CONFIG.contact.email}</span>
                </div>
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        window.location.href = '/dashboard';
                        setIsMenuOpen(false);
                      }}
                    >
                      <User size={16} className="mr-1" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full" 
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} className="mr-1" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      window.location.href = '/auth';
                      setIsMenuOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                )}
                <Button 
                  className="w-full mt-2" 
                  onClick={() => {
                    window.location.href = '/devis';
                    setIsMenuOpen(false);
                  }}
                >
                  Devis Gratuit
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}; 