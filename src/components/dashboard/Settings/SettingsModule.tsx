'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Shield, 
  Bell, 
  Mail, 
  Database,
  Users,
  Globe,
  Lock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

type SettingsTab = 'general' | 'security' | 'notifications' | 'email' | 'backup' | 'users';

export const SettingsModule: React.FC = () => {
  const { cmsData, updateSiteSettings } = useDashboard();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const tabs = [
    {
      id: 'general' as SettingsTab,
      label: 'Général',
      icon: Settings,
      description: 'Paramètres généraux du site'
    },
    {
      id: 'security' as SettingsTab,
      label: 'Sécurité',
      icon: Shield,
      description: 'Configuration de la sécurité'
    },
    {
      id: 'notifications' as SettingsTab,
      label: 'Notifications',
      icon: Bell,
      description: 'Gestion des notifications'
    },
    {
      id: 'email' as SettingsTab,
      label: 'Email',
      icon: Mail,
      description: 'Configuration email'
    },
    {
      id: 'backup' as SettingsTab,
      label: 'Sauvegarde',
      icon: Database,
      description: 'Sauvegarde et restauration'
    },
    {
      id: 'users' as SettingsTab,
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion des utilisateurs'
    }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveStatus('success');
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du Site</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <Input
              type="text"
              defaultValue={cmsData.settings.siteName}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL du site
            </label>
            <Input
              type="text"
              defaultValue={cmsData.settings.siteUrl}
              className="w-full"
              placeholder="https://example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du site
            </label>
            <textarea
              defaultValue={cmsData.settings.siteDescription}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mode Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Activer le mode maintenance</p>
              <p className="text-sm text-gray-500">Le site sera inaccessible aux visiteurs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={cmsData.settings.maintenanceMode} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message de maintenance
            </label>
            <textarea
              defaultValue={cmsData.settings.maintenanceMessage}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Site en maintenance. Nous serons de retour bientôt."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">HTTPS activé</p>
                <p className="text-sm text-gray-500">Connexion sécurisée</p>
              </div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Lock className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-500">Recommandé pour la sécurité</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configurer
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sessions actives</p>
                <p className="text-sm text-gray-500">2 sessions ouvertes</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Gérer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notifications push</p>
              <p className="text-sm text-gray-500">Notifications dans le navigateur</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Notifications SMS</p>
              <p className="text-sm text-gray-500">Notifications par SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Email</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serveur SMTP
            </label>
            <Input
              type="text"
              defaultValue={cmsData.settings.emailSettings.smtpHost}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Port SMTP
            </label>
            <Input
              type="number"
              defaultValue={cmsData.settings.emailSettings.smtpPort}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Utilisateur SMTP
            </label>
            <Input
              type="text"
              defaultValue={cmsData.settings.emailSettings.smtpUser}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe SMTP
            </label>
            <Input
              type="password"
              defaultValue={cmsData.settings.emailSettings.smtpPassword}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email d'expédition
            </label>
            <Input
              type="email"
              defaultValue={cmsData.settings.emailSettings.fromEmail}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'expédition
            </label>
            <Input
              type="text"
              defaultValue={cmsData.settings.emailSettings.fromName}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" size="sm">
            Tester la configuration
          </Button>
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sauvegarde</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Dernière sauvegarde</p>
                <p className="text-sm text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Sauvegarder maintenant
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Globe className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Sauvegarde automatique</p>
                <p className="text-sm text-gray-500">Tous les jours à 2h00</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion des Utilisateurs</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Utilisateurs actifs</p>
                <p className="text-sm text-gray-500">3 utilisateurs connectés</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Gérer
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Permissions</p>
                <p className="text-sm text-gray-500">Gérer les rôles et permissions</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configurer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'email':
        return renderEmailTab();
      case 'backup':
        return renderBackupTab();
      case 'users':
        return renderUsersTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        <div className="flex items-center space-x-4">
          {saveStatus === 'success' && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Sauvegardé</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">Erreur</span>
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </Button>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      {renderTabContent()}
    </div>
  );
}; 