import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Euro, 
  Calendar, 
  User, 
  Building, 
  Download, 
  Send, 
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Printer
} from 'lucide-react';
import { Devis, Client } from '../../types/devis';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';

interface InvoiceGeneratorProps {
  devis: Devis;
  client?: Client;
  onInvoiceCreate?: (invoice: any) => void;
  onClose?: () => void;
}

interface Invoice {
  id: string;
  numero: string;
  devisId: string;
  clientId: string;
  dateCreation: string;
  dateEcheance: string;
  montantHT: number;
  montantTTC: number;
  tva: number;
  statut: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  conditions: string[];
  notes: string;
  modePaiement: 'virement' | 'cheque' | 'especes' | 'carte';
  delaiPaiement: number; // en jours
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  devis,
  client,
  onInvoiceCreate,
  onClose
}) => {
  const [showModal, setShowModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Partial<Invoice>>({
    numero: `FACT-${Date.now()}`,
    devisId: devis.id,
    clientId: devis.clientId,
    dateCreation: new Date().toISOString(),
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 jours
    montantHT: devis.montantHT || 0,
    montantTTC: devis.montantTTC || 0,
    tva: devis.tva || 20,
    statut: 'draft',
    conditions: [
      'Paiement à 30 jours',
      'Pas d'escompte en cas de paiement anticipé',
      'En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée'
    ],
    notes: '',
    modePaiement: 'virement',
    delaiPaiement: 30
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const handleCreateInvoice = async () => {
    try {
      const newInvoice: Invoice = {
        id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        numero: invoiceData.numero || `FACT-${Date.now()}`,
        devisId: devis.id,
        clientId: devis.clientId,
        dateCreation: new Date().toISOString(),
        dateEcheance: invoiceData.dateEcheance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        montantHT: invoiceData.montantHT || devis.montantHT || 0,
        montantTTC: invoiceData.montantTTC || devis.montantTTC || 0,
        tva: invoiceData.tva || devis.tva || 20,
        statut: 'draft',
        conditions: invoiceData.conditions || [],
        notes: invoiceData.notes || '',
        modePaiement: invoiceData.modePaiement || 'virement',
        delaiPaiement: invoiceData.delaiPaiement || 30
      };

      onInvoiceCreate?.(newInvoice);
      setShowModal(false);
      onClose?.();
    } catch (err) {
      console.error('Erreur lors de la création de la facture:', err);
    }
  };

  const handleSendInvoice = async () => {
    try {
      // Simulation d'envoi de facture
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSendModal(false);
      // Ici on pourrait mettre à jour le statut de la facture
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la facture:', err);
    }
  };

  const calculateTTC = () => {
    const ht = invoiceData.montantHT || 0;
    const tva = invoiceData.tva || 20;
    return ht * (1 + tva / 100);
  };

  const getStatusColor = (status: Invoice['statut']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Invoice['statut']) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'sent': return 'Envoyée';
      case 'paid': return 'Payée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Générer une Facture</h3>
          <p className="text-sm text-gray-600">Transformer le devis #{devis.id} en facture</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowPreview(true)}
            variant="outline"
          >
            <Eye size={16} className="mr-2" />
            Aperçu
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FileText size={16} className="mr-2" />
            Générer Facture
          </Button>
        </div>
      </div>

      {/* Informations du devis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4">Informations du devis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-gray-500" />
              <span className="font-medium">Client:</span>
              <span>{devis.client}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-gray-500" />
              <span className="font-medium">Service:</span>
              <span>{devis.service}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="font-medium">Date création:</span>
              <span>{new Date(devis.dateCreation).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Euro size={16} className="text-gray-500" />
              <span className="font-medium">Montant HT:</span>
              <span>{devis.montantHT?.toFixed(2)} €</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Euro size={16} className="text-gray-500" />
              <span className="font-medium">Montant TTC:</span>
              <span>{devis.montantTTC?.toFixed(2)} €</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Building size={16} className="text-gray-500" />
              <span className="font-medium">Superficie:</span>
              <span>{devis.superficie} m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration de la facture */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4">Configuration de la facture</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de facture
            </label>
            <Input
              type="text"
              value={invoiceData.numero}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, numero: e.target.value }))}
              placeholder="FACT-2024-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'échéance
            </label>
            <Input
              type="date"
              value={invoiceData.dateEcheance ? new Date(invoiceData.dateEcheance).toISOString().split('T')[0] : ''}
              onChange={(e) => setInvoiceData(prev => ({ 
                ...prev, 
                dateEcheance: new Date(e.target.value).toISOString() 
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de paiement
            </label>
            <select
              value={invoiceData.modePaiement}
              onChange={(e) => setInvoiceData(prev => ({ 
                ...prev, 
                modePaiement: e.target.value as any 
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="virement">Virement bancaire</option>
              <option value="cheque">Chèque</option>
              <option value="especes">Espèces</option>
              <option value="carte">Carte bancaire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai de paiement (jours)
            </label>
            <Input
              type="number"
              value={invoiceData.delaiPaiement}
              onChange={(e) => setInvoiceData(prev => ({ 
                ...prev, 
                delaiPaiement: parseInt(e.target.value) 
              }))}
              min="0"
              max="90"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes additionnelles
          </label>
          <textarea
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Notes pour la facture..."
          />
        </div>
      </div>

      {/* Calculs */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-medium text-gray-900 mb-4">Calculs</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Montant HT</div>
            <div className="text-lg font-semibold text-gray-900">
              {invoiceData.montantHT?.toFixed(2)} €
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">TVA ({invoiceData.tva}%)</div>
            <div className="text-lg font-semibold text-gray-900">
              {((invoiceData.montantHT || 0) * (invoiceData.tva || 20) / 100).toFixed(2)} €
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600">Montant TTC</div>
            <div className="text-lg font-semibold text-blue-900">
              {calculateTTC().toFixed(2)} €
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText size={16} className="mr-2" />
          Générer la facture
        </Button>
      </div>

      {/* Modal de création */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Créer la facture"
        >
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-blue-600" />
                <span className="font-medium text-blue-900">Facture prête à être créée</span>
              </div>
              <div className="text-sm text-blue-700">
                <p>Numéro: {invoiceData.numero}</p>
                <p>Client: {devis.client}</p>
                <p>Montant TTC: {calculateTTC().toFixed(2)} €</p>
                <p>Échéance: {invoiceData.dateEcheance ? new Date(invoiceData.dateEcheance).toLocaleDateString() : 'Non définie'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateInvoice}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer la facture
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'aperçu */}
      {showPreview && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Aperçu de la facture"
        >
          <div className="p-6 space-y-4">
            <div className="bg-white border rounded-lg p-6">
              {/* En-tête facture */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">FACTURE</h2>
                  <p className="text-gray-600">Numéro: {invoiceData.numero}</p>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-900">GlobalNet Services</h3>
                  <p className="text-sm text-gray-600">123 Rue de la Propreté</p>
                  <p className="text-sm text-gray-600">75001 Paris, France</p>
                  <p className="text-sm text-gray-600">SIRET: 123 456 789 00012</p>
                </div>
              </div>

              {/* Informations client */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Facturé à:</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{devis.client}</p>
                  <p className="text-sm text-gray-600">{devis.adresse}</p>
                  <p className="text-sm text-gray-600">{devis.email}</p>
                  <p className="text-sm text-gray-600">{devis.telephone}</p>
                </div>
              </div>

              {/* Détails de la prestation */}
              <div className="mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Quantité</th>
                      <th className="text-right py-2">Prix unitaire</th>
                      <th className="text-right py-2">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">{devis.service}</td>
                      <td className="text-right py-2">{devis.superficie} m²</td>
                      <td className="text-right py-2">
                        {((devis.montantHT || 0) / (devis.superficie || 1)).toFixed(2)} €/m²
                      </td>
                      <td className="text-right py-2 font-medium">
                        {devis.montantHT?.toFixed(2)} €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Total HT:</span>
                    <span>{devis.montantHT?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>TVA ({devis.tva}%):</span>
                    <span>{((devis.montantHT || 0) * (devis.tva || 20) / 100).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-semibold">
                    <span>Total TTC:</span>
                    <span>{devis.montantTTC?.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Conditions de paiement */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Conditions de paiement:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {invoiceData.conditions?.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Fermer
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer la facture
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal d'envoi */}
      {showSendModal && (
        <Modal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          title="Envoyer la facture"
        >
          <div className="p-6 space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-yellow-600" />
                <span className="font-medium text-yellow-900">Envoi de facture</span>
              </div>
              <p className="text-sm text-yellow-700">
                La facture sera envoyée par email au client {devis.client}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSendModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendInvoice}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send size={16} className="mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InvoiceGenerator; 