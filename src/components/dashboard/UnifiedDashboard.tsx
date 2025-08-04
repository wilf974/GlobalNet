'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  Settings, 
  TrendingUp,
  Users,
  Building,
  Mail,
  HelpCircle,
  FileImage,
  Send,
  MoreHorizontal,
  Bell,
  Download,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardModule } from '../../types/dashboard';
import { CAModule } from './CA/CAModule';
import { CMSModule } from './CMS/CMSModule';
import { AnalyticsModule } from './Analytics/AnalyticsModule';
import { OverviewModule } from './Overview/OverviewModule';
import { SettingsModule } from './Settings/SettingsModule';
import { NotificationCenter } from '../ui/NotificationCenter';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface UnifiedDashboardProps {
  className?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({ className = '' }) => {
  const {
    activeModule,
    isLoading,
    error,
    stats,
    setActiveModule,
    loadDashboardData,
    exportData,
    notificationSettings,
    userPermissions
  } = useDashboard();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Configuration des modules
  const modules = [
    {
      id: 'overview' as DashboardModule,
      label: 'Vue d\'ensemble',
      icon: BarChart3,
      description: 'Aperçu général de l\'activité',
      color: 'bg-blue-500',
      requiresPermission: 'canViewDashboard'
    },
    {
      id: 'ca' as DashboardModule,
      label: 'CA & Devis',
      icon: DollarSign,
      description: 'Gestion des devis et chiffre d\'affaires',
      color: 'bg-green-500',
      requiresPermission: 'canManageDevis'
    },
    {
      id: 'cms' as DashboardModule,
      label: 'Contenu',
      icon: FileText,
      description: 'Gestion du contenu du site',
      color: 'bg-purple-500',
      requiresPermission: 'canManageContent'
    },
    {
      id: 'analytics' as DashboardModule,
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Analyses et statistiques',
      color: 'bg-orange-500',
      requiresPermission: 'canViewAnalytics'
    },
    {
      id: 'settings' as DashboardModule,
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration du système',
      color: 'bg-gray-500',
      requiresPermission: 'canManageSettings'
    }
  ];

  // Filtrer les modules selon les permissions
  const availableModules = modules.filter(module => 
    userPermissions[module.requiresPermission as keyof typeof userPermissions]
  );

  const handleModuleChange = (moduleId: DashboardModule) => {
    setActiveModule(moduleId);
  };

  const handleExport = async () => {
    const result = await exportData({
      format: 'pdf',
      dateRange: {
        start: new Date(new Date().getFullYear(), 0, 1),
        end: new Date()
      },
      filters: {},
      includeCharts: true
    });

    if (result.success) {
      // Afficher une notification de succès
      console.log('Export réussi');
    }
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewModule />;
      case 'ca':
        return <CAModule />;
      case 'cms':
        return <CMSModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <OverviewModule />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo et titre */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  GlobalNet Dashboard
                </h1>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Filtres */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificationSettings.email && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <NotificationCenter />
                  </div>
                )}
              </div>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </Button>

              {/* Actualiser */}
              <Button
                variant="ghost"
                size="sm"
                onClick={loadDashboardData}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation des modules */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {availableModules.map((module) => (
              <button
                key={module.id}
                onClick={() => handleModuleChange(module.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeModule === module.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <module.icon className="w-5 h-5" />
                <span>{module.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Statistiques rapides */}
      {activeModule === 'overview' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Devis Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalDevis)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">CA Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                <p className="text-2xl font-bold text-blue-600">{stats.conversionRate}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.activeClients)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Pages Publiées</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(stats.publishedContent)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Vues Mensuelles</p>
                <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.monthlyViews)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-teal-600">{stats.performanceScore}/100</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Devis Moyen</p>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(stats.averageDevisValue)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* État de chargement */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="text-gray-600">Chargement des données...</span>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Contenu du module actif */}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderModuleContent()}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Filtres */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Filtres</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  ×
                </Button>
              </div>
              
              {/* Contenu des filtres */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option>7 derniers jours</option>
                    <option>30 derniers jours</option>
                    <option>3 derniers mois</option>
                    <option>Année en cours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Approuvés</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">En attente</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Rejetés</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant minimum
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="w-full"
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 