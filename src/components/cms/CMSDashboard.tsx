'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Building, 
  Mail, 
  HelpCircle, 
  FileImage, 
  Send, 
  FolderOpen,
  Database,
  Shield,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import { CMSSettingsPage } from './CMSSettingsPage';

type CMSTab = 'overview' | 'pages' | 'services' | 'navigation' | 'footer' | 'company' | 'contact' | 'faq' | 'blog' | 'gallery' | 'settings';

export const CMSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CMSTab>('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const tabs = [
    {
      id: 'overview' as CMSTab,
      label: 'Vue d\'ensemble',
      icon: BarChart3,
      description: 'Aperçu général du contenu'
    },
    {
      id: 'pages' as CMSTab,
      label: 'Pages',
      icon: FileText,
      description: 'Gestion des pages du site'
    },
    {
      id: 'services' as CMSTab,
      label: 'Services',
      icon: Settings,
      description: 'Gestion des services'
    },
    {
      id: 'navigation' as CMSTab,
      label: 'Navigation',
      icon: Send,
      description: 'Configuration de la navigation'
    },
    {
      id: 'footer' as CMSTab,
      label: 'Footer',
      icon: FileText,
      description: 'Configuration du pied de page'
    },
    {
      id: 'company' as CMSTab,
      label: 'Entreprise',
      icon: Building,
      description: 'Informations de l\'entreprise'
    },
    {
      id: 'contact' as CMSTab,
      label: 'Contact',
      icon: Mail,
      description: 'Gestion des contacts'
    },
    {
      id: 'faq' as CMSTab,
      label: 'FAQ',
      icon: HelpCircle,
      description: 'Questions fréquentes'
    },
    {
      id: 'blog' as CMSTab,
      label: 'Blog',
      icon: FileText,
      description: 'Gestion du blog'
    },
    {
      id: 'gallery' as CMSTab,
      label: 'Galerie',
      icon: FileImage,
      description: 'Gestion de la galerie'
    },
    {
      id: 'settings' as CMSTab,
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du site'
    }
  ];

  // Afficher les 6 premiers onglets directement, le reste dans le menu
  const visibleTabs = tabs.slice(0, 6);
  const hiddenTabs = tabs.slice(6);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return <CMSSettingsPage />;
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Vue d'ensemble</h2>
                <p className="text-sm text-gray-600">Aperçu général du contenu du site</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pages</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Services</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <Settings className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Articles</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Images</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <FileImage className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {tabs.find(tab => tab.id === activeTab)?.description}
                </p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FolderOpen className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Interface en cours de développement
                  </h3>
                  <p className="text-gray-600">
                    Cette section sera bientôt disponible pour la gestion du contenu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h1>
          <p className="text-sm text-gray-600">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')} {new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans le contenu.."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau
          </button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex items-center">
          {/* Onglets visibles */}
          <div className="flex space-x-8">
            {visibleTabs.map((tab) => {
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
          </div>

          {/* Menu déroulant pour les onglets supplémentaires */}
          {hiddenTabs.length > 0 && (
            <div className="relative ml-8">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`flex items-center gap-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${
                  hiddenTabs.some(tab => tab.id === activeTab)
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MoreHorizontal size={16} />
                <span className="hidden sm:inline">Plus</span>
              </button>

              {/* Menu déroulant */}
              {showMoreMenu && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {hiddenTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setShowMoreMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Overlay pour fermer le menu */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMoreMenu(false)}
        />
      )}
    </div>
  );
}; 