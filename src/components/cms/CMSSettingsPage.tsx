'use client';

import React, { useState } from 'react';
import { Settings, FileText, Database, Shield, Globe, Bell } from 'lucide-react';
import { CMSRobotsSection } from './CMSRobotsSection';

type SettingsTab = 'general' | 'robots' | 'database' | 'security' | 'notifications';

export const CMSSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const tabs = [
    {
      id: 'general' as SettingsTab,
      label: 'Général',
      icon: Settings,
      description: 'Paramètres généraux du site'
    },
    {
      id: 'robots' as SettingsTab,
      label: 'Robots.txt',
      icon: FileText,
      description: 'Configuration des moteurs de recherche'
    },
    {
      id: 'database' as SettingsTab,
      label: 'Base de données',
      icon: Database,
      description: 'Gestion des données'
    },
    {
      id: 'security' as SettingsTab,
      label: 'Sécurité',
      icon: Shield,
      description: 'Paramètres de sécurité'
    },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notifications',
      icon: Bell,
      description: 'Configuration des notifications'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'robots':
        return <CMSRobotsSection />;
      case 'general':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Paramètres généraux</h2>
                <p className="text-sm text-gray-600">Configuration générale du site</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">Configuration des paramètres généraux en cours de développement...</p>
            </div>
          </div>
        );
      case 'database':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Base de données</h2>
                <p className="text-sm text-gray-600">Gestion des données du site</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">Configuration de la base de données en cours de développement...</p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                <p className="text-sm text-gray-600">Paramètres de sécurité du site</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">Configuration de la sécurité en cours de développement...</p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Configuration des notifications</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">Configuration des notifications en cours de développement...</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-600">Configurez les paramètres du site</p>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}; 