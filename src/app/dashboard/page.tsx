'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DevisDetails from '@/components/dashboard/DevisDetails';
import NotificationCenter from '@/components/ui/NotificationCenter';
import ExportTools from '@/components/dashboard/ExportTools';
import { useNotifications } from '@/hooks/useNotifications';
import { Devis } from '@/types/devis';

// Mock data pour les devis
const mockDevis: Devis[] = [
  {
    id: '1',
    client: 'Marie Dubois',
    email: 'marie.dubois@example.fr',
    telephone: '+33123456789',
    service: 'Nettoyage de Bureaux',
    superficie: 500,
    prix: 2500,
    statut: 'En attente',
    dateCreation: '2024-01-15',
    dateIntervention: '2024-02-01',
    adresse: '123 Rue de la Paix, 75001 Paris',
    notes: 'Nettoyage hebdomadaire des bureaux et sanitaires'
  },
  {
    id: '2',
    client: 'Jean Martin',
    email: 'jean.martin@example.fr',
    telephone: '+33987654321',
    service: 'Nettoyage Industriel',
    superficie: 1200,
    prix: 4800,
    statut: 'Validé',
    dateCreation: '2024-01-10',
    dateIntervention: '2024-01-25',
    adresse: '456 Avenue des Champs, 75008 Paris',
    notes: 'Nettoyage complet de l\'entrepôt et des zones de production'
  },
  {
    id: '3',
    client: 'Sophie Bernard',
    email: 'sophie.bernard@example.fr',
    telephone: '+33555666777',
    service: 'Nettoyage Résidentiel',
    superficie: 150,
    prix: 750,
    statut: 'Terminé',
    dateCreation: '2024-01-05',
    dateIntervention: '2024-01-20',
    adresse: '789 Boulevard Saint-Germain, 75006 Paris',
    notes: 'Nettoyage complet de l\'appartement après déménagement'
  }
];

const DashboardPage = () => {
  const { user, logout, isLoading } = useAuth();
  const [devis, setDevis] = useState<Devis[]>(mockDevis);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hook de notifications
  const {
    notifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Rediriger si pas connecté (seulement après le chargement)
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, isLoading]);

  // Ajouter quelques notifications de démonstration
  useEffect(() => {
    if (user) {
      // Notification de bienvenue
      addInfoNotification(
        'Bienvenue !',
        `Bonjour ${user.nom}, votre dashboard est prêt.`,
        {
          label: 'Voir les devis',
          onClick: () => console.log('Voir les devis')
        }
      );

      // Notification de devis en attente
      const pendingDevis = devis.filter(d => d.statut === 'En attente').length;
      if (pendingDevis > 0) {
        addWarningNotification(
          'Devis en attente',
          `${pendingDevis} devis nécessitent votre attention.`,
          {
            label: 'Voir les devis',
            onClick: () => setFilterStatus('En attente')
          }
        );
      }
    }
  }, [user, devis, addInfoNotification, addWarningNotification]);

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher le contenu si pas connecté (redirection en cours)
  if (!user) {
    return null;
  }

  const stats = [
    {
      title: 'Devis Total',
      value: devis.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'En Attente',
      value: devis.filter(d => d.statut === 'En attente').length,
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Validés',
      value: devis.filter(d => d.statut === 'Validé').length,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: `${devis.reduce((sum, d) => sum + d.prix, 0).toLocaleString()}€`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const filteredDevis = devis.filter(devis => {
    const matchesSearch = devis.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         devis.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || devis.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleViewDevis = (devis: Devis) => {
    setSelectedDevis(devis);
    setIsModalOpen(true);
    addInfoNotification(
      'Devis consulté',
      `Vous avez consulté le devis de ${devis.client}.`
    );
  };

  const handleEditDevis = (devis: Devis) => {
    addWarningNotification(
      'Modification de devis',
      `Modification du devis de ${devis.client} en cours...`,
      {
        label: 'Voir les détails',
        onClick: () => handleViewDevis(devis)
      }
    );
    console.log('Modifier devis:', devis);
  };

  const handleDeleteDevis = (devisId: string) => {
    const devisToDelete = devis.find(d => d.id === devisId);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      setDevis(devis.filter(d => d.id !== devisId));
      addSuccessNotification(
        'Devis supprimé',
        `Le devis de ${devisToDelete?.client} a été supprimé avec succès.`
      );
    }
  };

  const handleDownloadDevis = (devis: Devis) => {
    addInfoNotification(
      'Téléchargement',
      `Génération du PDF pour le devis de ${devis.client}...`,
      {
        label: 'Voir le devis',
        onClick: () => handleViewDevis(devis)
      }
    );
    console.log('Télécharger devis:', devis);
  };

  const handleNewDevis = () => {
    addInfoNotification(
      'Nouveau devis',
      'Redirection vers le formulaire de création de devis...'
    );
    // Rediriger vers le formulaire de devis
    window.location.href = '/devis';
  };

  const handleExport = (type: 'pdf' | 'excel' | 'csv', filters?: any) => {
    addSuccessNotification(
      'Export réussi',
      `Export ${type.toUpperCase()} généré avec succès.`,
      {
        label: 'Télécharger',
        onClick: () => console.log('Télécharger export')
      }
    );
    console.log('Export:', type, filters);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDevis(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                onMarkAllAsRead={markAllAsRead}
              />
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.nom.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.nom}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Devis */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl font-semibold text-gray-900">Gestion des Devis</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un devis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="Validé">Validé</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <ExportTools devis={devis} onExport={handleExport} />
                <Button size="sm" onClick={handleNewDevis}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Devis
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Superficie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevis.map((devis) => (
                  <motion.tr
                    key={devis.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{devis.client}</div>
                        <div className="text-sm text-gray-500">{devis.email}</div>
                        <div className="text-sm text-gray-500">{devis.telephone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {devis.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {devis.superficie} m²
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {devis.prix.toLocaleString()}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        devis.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                        devis.statut === 'Validé' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {devis.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(devis.dateCreation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-primary hover:text-primary-600 transition-colors"
                          onClick={() => handleViewDevis(devis)}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          onClick={() => handleEditDevis(devis)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleDeleteDevis(devis.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-800 transition-colors"
                          onClick={() => handleDownloadDevis(devis)}
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal pour les détails du devis */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Détails du Devis"
        size="lg"
      >
        {selectedDevis && <DevisDetails devis={selectedDevis} />}
      </Modal>
    </div>
  );
};

export default DashboardPage; 