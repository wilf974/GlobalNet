'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Navigation, 
  Save, 
  Eye, 
  X, 
  Plus,
  Trash2,
  Move,
  Link,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

interface CMSNavigationEditorProps {
  navigationItems: NavigationItem[];
  contactInfo: ContactInfo;
  onSave: (navigation: NavigationItem[], contact: ContactInfo) => void;
  onCancel: () => void;
  className?: string;
}

export function CMSNavigationEditor({ 
  navigationItems, 
  contactInfo, 
  onSave, 
  onCancel, 
  className = '' 
}: CMSNavigationEditorProps) {
  const [navItems, setNavItems] = useState<NavigationItem[]>(navigationItems);
  const [contact, setContact] = useState<ContactInfo>(contactInfo);
  const [isPreview, setIsPreview] = useState(false);
  const [newItem, setNewItem] = useState({ label: '', url: '' });

  const handleAddNavItem = () => {
    if (newItem.label.trim() && newItem.url.trim()) {
      const newNavItem: NavigationItem = {
        id: crypto.randomUUID(),
        label: newItem.label.trim(),
        url: newItem.url.trim(),
        order: navItems.length + 1,
        isActive: true,
      };
      setNavItems([...navItems, newNavItem]);
      setNewItem({ label: '', url: '' });
    }
  };

  const handleRemoveNavItem = (id: string) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const handleUpdateNavItem = (id: string, field: keyof NavigationItem, value: any) => {
    setNavItems(navItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(navItems, contact);
  };

  const renderNavigationEditor = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Éléments de Navigation
        </h3>
        
        {/* Add new navigation item */}
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Label (ex: Accueil)"
            value={newItem.label}
            onChange={(e) => setNewItem(prev => ({ ...prev, label: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="URL (ex: /)"
            value={newItem.url}
            onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddNavItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
            >
              <Move className="w-4 h-4 text-gray-400 cursor-move" />
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleUpdateNavItem(item.id, 'label', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={item.url}
                onChange={(e) => handleUpdateNavItem(item.id, 'url', e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => handleUpdateNavItem(item.id, 'isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">Actif</span>
              </label>
              <button
                onClick={() => handleRemoveNavItem(item.id)}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Téléphone
            </label>
            <input
              type="text"
              value={contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="01 23 45 67 89"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@globalnet-services.fr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Adresse
            </label>
            <input
              type="text"
              value={contact.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="123 Rue de la Propreté, 75001 Paris"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Horaires de travail
            </label>
            <input
              type="text"
              value={contact.workingHours}
              onChange={(e) => handleContactChange('workingHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lun-Ven: 8h-18h"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Prévisualisation de la Navigation</h3>
        
        {/* Navigation Preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {navItems.filter(item => item.isActive).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{contact.phone}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Preview */}
        <div className="bg-blue-900 text-white p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2">GlobalNet Services</h4>
              <p className="text-sm text-gray-300">
                Leader du nettoyage professionnel depuis plus de 10 ans. Qualité, fiabilité et satisfaction client garanties.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{contact.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{contact.workingHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Navigation className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Éditeur de Navigation
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Prévisualiser</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isPreview ? renderPreview() : renderNavigationEditor()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Annuler</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 