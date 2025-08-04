'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  FileText, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Settings,
  Workflow
} from 'lucide-react';
import { useDashboard } from '../../../hooks/useDashboard';
import { DevisData, ClientData, RevenueData, CAnalyticsData } from '../../../types/dashboard';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';
import ClientManager from '../ClientManager';
// import { DevisDetails } from './DevisDetails';
// import { WorkflowManager } from './WorkflowManager';
// import { InvoiceGenerator } from './InvoiceGenerator';

type CATab = 'devis' | 'clients' | 'revenue' | 'analytics' | 'workflow' | 'invoices';

export const CAModule: React.FC = () => {
  const {
    caData,
    addDevis,
    updateDevis,
    deleteDevis,
    addClient,
    updateClient,
    deleteClient
  } = useDashboard();



  const [activeTab, setActiveTab] = useState<CATab>('devis');
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState<DevisData | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // État pour le formulaire de création de devis
  const [devisFormData, setDevisFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    superficie: 0,
    dateIntervention: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // État pour la création de client depuis le formulaire de devis
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });

  // Fonction pour créer un client depuis le formulaire de devis
  const handleCreateClientFromDevis = async () => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      const createdClient = await response.json();
      
      // Mettre à jour le formulaire de devis avec le nouveau client
      setDevisFormData(prev => ({
        ...prev,
        clientId: createdClient.client.id,
        clientName: createdClient.client.name,
        clientEmail: createdClient.client.email,
        clientPhone: createdClient.client.phone
      }));

      // Fermer la modal de création de client
      setShowClientModal(false);
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        notes: ''
      });

      // Recharger la liste des clients
      // Note: Dans un vrai projet, on devrait mettre à jour l'état global
      window.location.reload();
    } catch (err) {
      console.error('Erreur lors de la création du client:', err);
    }
  };

  const tabs = [
    {
      id: 'devis' as CATab,
      label: 'Devis',
      icon: FileText,
      count: caData.devis.length
    },
    {
      id: 'clients' as CATab,
      label: 'Clients',
      icon: Users,
      count: caData.clients.length
    },
    {
      id: 'revenue' as CATab,
      label: 'Chiffre d\'Affaires',
      icon: DollarSign,
      count: caData.revenue.total
    },
    {
      id: 'analytics' as CATab,
      label: 'Analytics',
      icon: TrendingUp,
      count: caData.analytics.conversionRate
    },
    {
      id: 'workflow' as CATab,
      label: 'Workflow',
      icon: Workflow,
      count: 0
    },
    {
      id: 'invoices' as CATab,
      label: 'Factures',
      icon: FileText,
      count: 0
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateDevis = () => {
    setSelectedDevis(null);
    setShowDevisModal(true);
  };

  const handleEditDevis = (devis: any) => {
    // Convertir les dates string en Date objects si nécessaire
    const devisWithDates = {
      ...devis,
      createdAt: typeof devis.createdAt === 'string' ? new Date(devis.createdAt) : devis.createdAt,
      updatedAt: typeof devis.updatedAt === 'string' ? new Date(devis.updatedAt) : devis.updatedAt,
      approvedAt: devis.approvedAt ? (typeof devis.approvedAt === 'string' ? new Date(devis.approvedAt) : devis.approvedAt) : undefined,
      completedAt: devis.completedAt ? (typeof devis.completedAt === 'string' ? new Date(devis.completedAt) : devis.completedAt) : undefined
    };
    setSelectedDevis(devisWithDates);
    setShowDevisModal(true);
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client: ClientData) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleCreateInvoice = (devis: any) => {
    // Convertir les dates string en Date objects si nécessaire
    const devisWithDates = {
      ...devis,
      createdAt: typeof devis.createdAt === 'string' ? new Date(devis.createdAt) : devis.createdAt,
      updatedAt: typeof devis.updatedAt === 'string' ? new Date(devis.updatedAt) : devis.updatedAt,
      approvedAt: devis.approvedAt ? (typeof devis.approvedAt === 'string' ? new Date(devis.approvedAt) : devis.approvedAt) : undefined,
      completedAt: devis.completedAt ? (typeof devis.completedAt === 'string' ? new Date(devis.completedAt) : devis.completedAt) : undefined
    };
    setSelectedDevis(devisWithDates);
    setShowInvoiceModal(true);
  };

  const filteredDevis = caData.devis.filter(devis => {
    const matchesSearch = devis.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         devis.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || devis.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = caData.clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDevisTab = () => (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher un devis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
            <option value="completed">Terminé</option>
          </select>
        </div>
        <Button
          onClick={handleCreateDevis}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Devis</span>
        </Button>
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
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
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {devis.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {devis.clientEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(devis.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(devis.status)}`}>
                      {getStatusIcon(devis.status)}
                      <span className="ml-1">
                        {devis.status === 'approved' && 'Approuvé'}
                        {devis.status === 'pending' && 'En attente'}
                        {devis.status === 'rejected' && 'Rejeté'}
                        {devis.status === 'completed' && 'Terminé'}
                        {devis.status === 'draft' && 'Brouillon'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(typeof devis.createdAt === 'string' ? new Date(devis.createdAt) : devis.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDevis(devis)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDevis(devis)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {devis.status === 'approved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateInvoice(devis)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDevis(devis.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Fonctions d'adaptation pour convertir entre les types Client et ClientData
  const adaptClientToClientData = (client: any): ClientData => ({
    id: client.id,
    name: client.nom,
    email: client.email,
    phone: client.telephone,
    address: client.adresse || '',
    company: client.type === 'entreprise' ? client.nom : undefined,
    totalDevis: client.devisTotal || 0,
    totalRevenue: client.caTotal || 0,
    lastContact: new Date(client.derniereActivite || client.dateCreation),
    status: 'active' as const,
    notes: client.notes
  });

  const adaptClientDataToClient = (clientData: ClientData): any => ({
    id: clientData.id,
    nom: clientData.name,
    email: clientData.email,
    telephone: clientData.phone,
    adresse: clientData.address,
    type: clientData.company ? 'entreprise' : 'particulier',
    categorie: 'B',
    commercialId: 'default',
    dateCreation: new Date().toISOString(),
    derniereActivite: new Date().toISOString(),
    caTotal: clientData.totalRevenue,
    devisTotal: clientData.totalDevis,
    devisValides: Math.floor(clientData.totalDevis * 0.7),
    tauxConversion: 70,
    notes: clientData.notes,
    tags: [],
    contacts: []
  });

  const handleClientCreate = (client: any) => {
    const clientData = adaptClientToClientData(client);
    addClient(clientData);
  };

  const handleClientUpdate = (client: any) => {
    const clientData = adaptClientToClientData(client);
    updateClient(client.id, clientData);
  };

  const handleClientDelete = (id: string) => {
    deleteClient(id);
  };

  const renderClientsTab = () => (
    <div className="space-y-6">
      <ClientManager
        onClientCreate={handleClientCreate}
        onClientUpdate={handleClientUpdate}
        onClientDelete={handleClientDelete}
      />
    </div>
  );

  const renderRevenueTab = () => (
    <div className="space-y-6">
      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(caData.revenue.total)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA Mensuel</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(caData.revenue.monthly)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">CA Annuel</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(caData.revenue.yearly)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des revenus par mois */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution du CA</h3>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">Graphique d'évolution du CA</p>
        </div>
      </div>

      {/* Top services */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
        <div className="space-y-4">
          {caData.revenue.byService.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900">{service.service}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(service.revenue)}
                </p>
                <p className="text-xs text-gray-500">{service.count} devis</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
          <p className="text-2xl font-bold text-green-600">
            {caData.analytics.conversionRate}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Devis Moyen</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(caData.analytics.averageDevisValue)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Rétention Clients</p>
          <p className="text-2xl font-bold text-purple-600">
            {caData.analytics.clientRetention}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">Taux de Croissance</p>
          <p className="text-2xl font-bold text-orange-600">
            {caData.analytics.growthRate}%
          </p>
        </div>
      </div>

      {/* Prédictions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Prédictions CA</h3>
        <div className="space-y-4">
          {caData.analytics.projections.map((projection, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{projection.month}</span>
              <span className="text-sm font-medium text-green-600">
                {formatCurrency(projection.projectedRevenue)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWorkflowTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion du Workflow</h3>
        <p className="text-gray-600">Module WorkflowManager en cours d'intégration...</p>
      </div>
    </div>
  );

  const renderInvoicesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Gestion des Factures</h3>
          <Button
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Facture</span>
          </Button>
        </div>
        
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune facture générée
          </h3>
          <p className="text-gray-500 mb-6">
            Les factures seront générées à partir des devis approuvés
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveTab('devis')}
          >
            Voir les devis
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'devis':
        return renderDevisTab();
      case 'clients':
        return renderClientsTab();
      case 'revenue':
        return renderRevenueTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'workflow':
        return renderWorkflowTab();
      case 'invoices':
        return renderInvoicesTab();
      default:
        return renderDevisTab();
    }
  };

  return (
    <div className="space-y-6">
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
              {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.id === 'revenue' ? formatCurrency(tab.count) : tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu de l'onglet actif */}
      {renderTabContent()}

      {/* Modales */}
      {showDevisModal && (
        <Modal
          isOpen={showDevisModal}
          onClose={() => setShowDevisModal(false)}
          title={selectedDevis ? "Détails du Devis" : "Nouveau Devis"}
          size="lg"
        >
          <div className="space-y-4">
            {selectedDevis ? (
              <p className="text-gray-600">Module DevisDetails en cours d'intégration...</p>
                         ) : (
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                   {/* Sélection du client existant */}
                   <div className="col-span-2">
                     <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-gray-700">
                         Client
                       </label>
                       <button
                         type="button"
                         onClick={() => setShowClientModal(true)}
                         className="text-sm text-blue-600 hover:text-blue-800"
                       >
                         + Nouveau client
                       </button>
                     </div>
                     <select 
                       className="w-full border border-gray-300 rounded-md px-3 py-2"
                       value={devisFormData.clientId}
                       onChange={(e) => {
                         const selectedClient = caData.clients.find(c => c.id === e.target.value);
                         setDevisFormData(prev => ({
                           ...prev,
                           clientId: e.target.value,
                           clientName: selectedClient?.name || '',
                           clientEmail: selectedClient?.email || '',
                           clientPhone: selectedClient?.phone || ''
                         }));
                       }}
                     >
                       <option value="">Sélectionner un client existant</option>
                       {caData.clients.map(client => (
                         <option key={client.id} value={client.id}>
                           {client.name} - {client.email}
                         </option>
                       ))}
                     </select>
                   </div>
                   
                   {/* Informations client */}
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Nom du client
                     </label>
                     <Input
                       type="text"
                       placeholder="Nom du client"
                       value={devisFormData.clientName}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, clientName: e.target.value }))}
                       className="w-full"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Email
                     </label>
                     <Input
                       type="email"
                       placeholder="email@exemple.com"
                       value={devisFormData.clientEmail}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                       className="w-full"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Téléphone
                     </label>
                     <Input
                       type="tel"
                       placeholder="01 23 45 67 89"
                       value={devisFormData.clientPhone}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                       className="w-full"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Service
                     </label>
                     <select 
                       className="w-full border border-gray-300 rounded-md px-3 py-2"
                       value={devisFormData.service}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, service: e.target.value }))}
                     >
                       <option value="">Sélectionner un service</option>
                       <option value="nettoyage-bureaux">Nettoyage de bureaux</option>
                       <option value="nettoyage-industriel">Nettoyage industriel</option>
                       <option value="nettoyage-residentiel">Nettoyage résidentiel</option>
                       <option value="nettoyage-vitrines">Nettoyage de vitrines</option>
                       <option value="nettoyage-specifique">Nettoyage spécifique</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Surface (m²)
                     </label>
                     <Input
                       type="number"
                       placeholder="100"
                       value={devisFormData.superficie}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, superficie: Number(e.target.value) }))}
                       className="w-full"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                       Date d'intervention
                     </label>
                     <Input
                       type="date"
                       value={devisFormData.dateIntervention}
                       onChange={(e) => setDevisFormData(prev => ({ ...prev, dateIntervention: e.target.value }))}
                       className="w-full"
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Notes
                   </label>
                   <textarea
                     className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                     placeholder="Informations supplémentaires..."
                     value={devisFormData.notes}
                     onChange={(e) => setDevisFormData(prev => ({ ...prev, notes: e.target.value }))}
                   />
                 </div>
                 
                 <div className="flex justify-end space-x-3 pt-4">
                   <Button
                     variant="outline"
                     onClick={() => {
                       setShowDevisModal(false);
                       setDevisFormData({
                         clientId: '',
                         clientName: '',
                         clientEmail: '',
                         clientPhone: '',
                         service: '',
                         superficie: 0,
                         dateIntervention: new Date().toISOString().split('T')[0],
                         notes: ''
                       });
                     }}
                   >
                     Annuler
                   </Button>
                   <Button
                     onClick={() => {
                       // Validation et création du devis
                       if (!devisFormData.clientName || !devisFormData.clientEmail || !devisFormData.service) {
                         alert('Veuillez remplir tous les champs obligatoires');
                         return;
                       }
                       
                       // Créer le nouveau devis
                       const newDevis = {
                         clientName: devisFormData.clientName,
                         clientEmail: devisFormData.clientEmail,
                         clientPhone: devisFormData.clientPhone,
                         services: [{
                           id: `service_${Date.now()}`,
                           name: devisFormData.service,
                           description: `Service de ${devisFormData.service}`,
                           quantity: 1,
                           unitPrice: devisFormData.superficie * 0.5, // Prix exemple
                           totalPrice: devisFormData.superficie * 0.5,
                           category: devisFormData.service
                         }],
                         totalAmount: devisFormData.superficie * 0.5,
                         status: 'draft' as const,
                         notes: devisFormData.notes,
                         discount: 0,
                         tax: 20,
                         finalAmount: devisFormData.superficie * 0.5 * 1.2
                       };
                       
                       addDevis(newDevis);
                       setShowDevisModal(false);
                       setDevisFormData({
                         clientId: '',
                         clientName: '',
                         clientEmail: '',
                         clientPhone: '',
                         service: '',
                         superficie: 0,
                         dateIntervention: new Date().toISOString().split('T')[0],
                         notes: ''
                       });
                     }}
                   >
                     Créer le devis
                   </Button>
                 </div>
               </div>
             )}
          </div>
        </Modal>
      )}

      {showClientModal && (
        <Modal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          title="Nouveau Client"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom / Raison sociale *
                </label>
                <Input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <Input
                  type="tel"
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <Input
                  type="text"
                  value={newClientData.address}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entreprise
                </label>
                <Input
                  type="text"
                  value={newClientData.company}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newClientData.notes}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Informations complémentaires..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowClientModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateClientFromDevis}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!newClientData.name || !newClientData.email || !newClientData.phone}
              >
                Créer le client
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showInvoiceModal && selectedDevis && (
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          title="Générer une Facture"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-600">Module InvoiceGenerator en cours d'intégration...</p>
          </div>
        </Modal>
      )}
    </div>
  );
}; 