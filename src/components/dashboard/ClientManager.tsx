import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  TrendingUp,
  Calendar,
  Euro
} from 'lucide-react';
import { Client, Contact } from '../../types/devis';
import { ClientData } from '../../utils/dataService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

interface ClientManagerProps {
  onClientCreate?: (client: Client) => void;
  onClientUpdate?: (client: Client) => void;
  onClientDelete?: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({
  onClientCreate,
  onClientUpdate,
  onClientDelete
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'particulier' | 'professionnel' | 'entreprise'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'A' | 'B' | 'C' | 'D'>('all');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour adapter ClientData vers Client
  const adaptClientDataToClient = (clientData: ClientData): Client => ({
    id: clientData.id,
    nom: clientData.name,
    email: clientData.email,
    telephone: clientData.phone,
    adresse: clientData.address,
    siret: undefined,
    tva: undefined,
    type: clientData.company ? 'entreprise' : 'particulier',
    categorie: 'B',
    commercialId: 'default',
    dateCreation: new Date().toISOString(),
    derniereActivite: clientData.lastContact,
    caTotal: clientData.totalRevenue,
    devisTotal: clientData.totalDevis,
    devisValides: Math.floor(clientData.totalDevis * 0.7),
    tauxConversion: clientData.totalDevis > 0 ? (Math.floor(clientData.totalDevis * 0.7) / clientData.totalDevis) * 100 : 0,
    notes: clientData.notes,
    tags: [],
    contacts: []
  });

  // Fonction pour adapter Client vers ClientData
  const adaptClientToClientData = (client: Client): ClientData => ({
    id: client.id,
    name: client.nom,
    email: client.email,
    phone: client.telephone,
    address: client.adresse,
    company: client.type === 'entreprise' ? client.nom : undefined,
    totalDevis: client.devisTotal,
    totalRevenue: client.caTotal,
    lastContact: client.derniereActivite,
    status: 'active',
    notes: client.notes
  });

  // Charger les clients depuis l'API
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des clients');
        }
        const data = await response.json();
        const adaptedClients = data.clients.map(adaptClientDataToClient);
        setClients(adaptedClients);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du chargement des clients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const [formData, setFormData] = useState<Partial<Client>>({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    type: 'particulier',
    categorie: 'B',
    notes: '',
    tags: []
  });

  const handleCreateClient = async () => {
    try {
      const newClient: Client = {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nom: formData.nom || '',
        email: formData.email || '',
        telephone: formData.telephone || '',
        adresse: formData.adresse || '',
        siret: formData.siret,
        tva: formData.tva,
        type: formData.type || 'particulier',
        categorie: formData.categorie || 'B',
        commercialId: 'commercial_1',
        dateCreation: new Date().toISOString(),
        derniereActivite: new Date().toISOString(),
        caTotal: 0,
        devisTotal: 0,
        devisValides: 0,
        tauxConversion: 0,
        notes: formData.notes,
        tags: formData.tags || [],
        contacts: []
      };

      // Créer le client via l'API
      const clientData = adaptClientToClientData(newClient);
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du client');
      }

      const createdClientData = await response.json();
      const createdClient = adaptClientDataToClient(createdClientData.client);

      setClients(prev => [...prev, createdClient]);
      onClientCreate?.(createdClient);
      setShowCreateModal(false);
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        type: 'particulier',
        categorie: 'B',
        notes: '',
        tags: []
      });
    } catch (err) {
      console.error('Erreur lors de la création du client:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;

    try {
      const updatedClient: Client = {
        ...selectedClient,
        ...formData,
        derniereActivite: new Date().toISOString()
      };

      // Mettre à jour le client via l'API
      const clientData = adaptClientToClientData(updatedClient);
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du client');
      }

      const updatedClientData = await response.json();
      const adaptedUpdatedClient = adaptClientDataToClient(updatedClientData);

      setClients(prev => prev.map(c => c.id === selectedClient.id ? adaptedUpdatedClient : c));
      onClientUpdate?.(adaptedUpdatedClient);
      setShowEditModal(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du client:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du client');
      }

      setClients(prev => prev.filter(c => c.id !== selectedClient.id));
      onClientDelete?.(selectedClient.id);
      setShowDeleteModal(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesCategory = filterCategory === 'all' || client.categorie === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const getTypeColor = (type: Client['type']) => {
    switch (type) {
      case 'particulier': return 'bg-blue-100 text-blue-800';
      case 'professionnel': return 'bg-green-100 text-green-800';
      case 'entreprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Client['categorie']) => {
    switch (category) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Clients</h3>
          <p className="text-sm text-gray-600">Créer et gérer vos clients</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Nouveau Client
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">Tous les types</option>
            <option value="particulier">Particuliers</option>
            <option value="professionnel">Professionnels</option>
            <option value="entreprise">Entreprises</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">Toutes catégories</option>
            <option value="A">Catégorie A</option>
            <option value="B">Catégorie B</option>
            <option value="C">Catégorie C</option>
            <option value="D">Catégorie D</option>
          </select>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* États de chargement et d'erreur */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Chargement des clients...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Liste des clients */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type/Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CA Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.nom}</div>
                      <div className="text-sm text-gray-500">{client.adresse}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.telephone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                        {client.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(client.categorie)}`}>
                        {client.categorie}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {client.caTotal.toLocaleString()} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {client.devisValides}/{client.devisTotal} ({client.tauxConversion.toFixed(1)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(client.derniereActivite).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedClient(client);
                          setFormData(client);
                          setShowEditModal(true);
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedClient(client);
                          setFormData(client);
                          setShowEditModal(true);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Modal de création */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nouveau Client"
        >
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom / Raison sociale *
                </label>
                <Input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <Input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <Input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de client
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="particulier">Particulier</option>
                  <option value="professionnel">Professionnel</option>
                  <option value="entreprise">Entreprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value as any }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="A">A - Premium</option>
                  <option value="B">B - Standard</option>
                  <option value="C">C - Basique</option>
                  <option value="D">D - Risque</option>
                </select>
              </div>
            </div>
            
            {formData.type === 'entreprise' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SIRET
                  </label>
                  <Input
                    type="text"
                    value={formData.siret}
                    onChange={(e) => setFormData(prev => ({ ...prev, siret: e.target.value }))}
                    placeholder="123 456 789 00012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro TVA
                  </label>
                  <Input
                    type="text"
                    value={formData.tva}
                    onChange={(e) => setFormData(prev => ({ ...prev, tva: e.target.value }))}
                    placeholder="FR12345678901"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Informations complémentaires..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateClient}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer le client
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedClient && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Modifier le client"
        >
          <div className="p-6 space-y-4">
            {/* Même formulaire que pour la création */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom / Raison sociale *
                </label>
                <Input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  placeholder="Nom du client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemple.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <Input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <Input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  placeholder="Adresse complète"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateClient}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sauvegarder
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && selectedClient && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmer la suppression"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer le client "{selectedClient.nom}" ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteClient}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientManager; 