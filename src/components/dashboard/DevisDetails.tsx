'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Euro, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Download,
  Send,
  History,
  TrendingUp,
  Tag,
  Document,
  Users,
  Settings
} from 'lucide-react';
import { Devis, WorkflowStep, Approval, Document as DevisDocument } from '../../types/devis';
import { useDevisActions } from '../../hooks/useDevisActions';
import { useWorkflow } from '../../hooks/useWorkflow';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface DevisDetailsProps {
  devis: Devis;
  onClose: () => void;
  onUpdate: (devis: Devis) => void;
  onDelete: (id: string) => void;
}

const DevisDetails: React.FC<DevisDetailsProps> = ({ 
  devis, 
  onClose, 
  onUpdate, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'workflow' | 'calculs' | 'documents' | 'notifications'>('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentaire, setCommentaire] = useState('');

  const { 
    approveDevis, 
    rejectDevis, 
    completeDevis, 
    cancelDevis,
    calculateDevis,
    loading,
    error,
    success
  } = useDevisActions();

  const {
    getNextStep,
    canProceedToStep,
    getRequiredApprovals,
    proceedToNextStep,
    approveStep,
    rejectStep,
    config: workflowConfig
  } = useWorkflow();

  const getStatusColor = (status: Devis['statut']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'expired': return 'bg-orange-500';
      case 'cancelled': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Devis['statut']) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'completed': return 'Terminé';
      case 'expired': return 'Expiré';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priorite: Devis['priorite']) => {
    switch (priorite) {
      case 'basse': return 'bg-gray-100 text-gray-800';
      case 'normale': return 'bg-blue-100 text-blue-800';
      case 'haute': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async () => {
    try {
      const updatedDevis = await approveDevis(devis.id, 'user123', 'Admin', commentaire);
      onUpdate(updatedDevis);
      setCommentaire('');
    } catch (err) {
      console.error('Erreur lors de l\'approbation:', err);
    }
  };

  const handleReject = async () => {
    try {
      const updatedDevis = await rejectDevis(devis.id, 'user123', 'Admin', commentaire);
      onUpdate(updatedDevis);
      setCommentaire('');
    } catch (err) {
      console.error('Erreur lors du rejet:', err);
    }
  };

  const handleComplete = async () => {
    try {
      const updatedDevis = await completeDevis(devis.id, 'user123', 'Admin');
      onUpdate(updatedDevis);
    } catch (err) {
      console.error('Erreur lors de la finalisation:', err);
    }
  };

  const handleCancel = async () => {
    try {
      const updatedDevis = await cancelDevis(devis.id, 'user123', 'Admin', commentaire);
      onUpdate(updatedDevis);
      setCommentaire('');
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(devis.id);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  const nextStep = getNextStep(devis);
  const requiredApprovals = getRequiredApprovals(devis);

  const tabs = [
    { id: 'details', label: 'Détails', icon: FileText },
    { id: 'workflow', label: 'Workflow', icon: History },
    { id: 'calculs', label: 'Calculs', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: Document },
    { id: 'notifications', label: 'Notifications', icon: Users },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Devis #{devis.id}</h2>
              <p className="text-blue-100">{devis.client} - {devis.service}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(devis.statut)}`}>
                {getStatusText(devis.statut)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(devis.priorite)}`}>
                {devis.priorite}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations client */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User size={20} />
                  Informations client
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-500" />
                    <span className="font-medium">{devis.client}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-500" />
                    <span>{devis.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-500" />
                    <span>{devis.telephone}</span>
                  </div>
                  {devis.adresse && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{devis.adresse}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations devis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText size={20} />
                  Informations devis
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-500" />
                    <span className="font-medium">{devis.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-gray-500" />
                    <span>{devis.superficie} m²</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Créé le {new Date(devis.dateCreation).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />
                    <span>Intervention le {new Date(devis.dateIntervention).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Calculs financiers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Euro size={20} />
                  Calculs financiers
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span>Montant HT:</span>
                    <span className="font-medium">{devis.montantHT?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA ({devis.tva}%):</span>
                    <span className="font-medium">{((devis.montantHT || 0) * (devis.tva || 20) / 100).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant TTC:</span>
                    <span className="font-medium">{devis.montantTTC?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marge:</span>
                    <span className="font-medium">{devis.marge?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taux de marge:</span>
                    <span className="font-medium">{devis.tauxMarge?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Tags et conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Tag size={20} />
                  Tags et conditions
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {devis.tags && devis.tags.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {devis.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {devis.conditions && devis.conditions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Conditions:</span>
                      <ul className="mt-2 space-y-1">
                        {devis.conditions.map((condition, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Historique du workflow</h3>
                {nextStep && (
                  <Button
                    onClick={() => proceedToNextStep(devis, 'user123', 'Admin')}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Passer à l'étape suivante
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {devis.workflowHistory.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : step.status === 'rejected' ? (
                        <XCircle size={16} className="text-white" />
                      ) : (
                        <Clock size={16} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{step.action}</h4>
                          <p className="text-sm text-gray-600">
                            Par {step.userName} le {new Date(step.date).toLocaleDateString()}
                          </p>
                          {step.commentaire && (
                            <p className="text-sm text-gray-700 mt-1">{step.commentaire}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          step.status === 'completed' ? 'bg-green-100 text-green-800' :
                          step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions de workflow */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Actions disponibles</h4>
                <div className="flex flex-wrap gap-2">
                  {devis.statut === 'pending' && (
                    <>
                      <Button
                        onClick={handleApprove}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approuver
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={loading}
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XCircle size={16} className="mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  {devis.statut === 'approved' && (
                    <Button
                      onClick={handleComplete}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Terminer
                    </Button>
                  )}
                  {devis.statut !== 'completed' && devis.statut !== 'cancelled' && (
                    <Button
                      onClick={handleCancel}
                      disabled={loading}
                      variant="outline"
                      className="border-gray-500 text-gray-600 hover:bg-gray-50"
                    >
                      <XCircle size={16} className="mr-2" />
                      Annuler
                    </Button>
                  )}
                </div>
                <div className="mt-3">
                  <textarea
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculs' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Calculs détaillés</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Calculs de base */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Calculs de base</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Prix unitaire:</span>
                      <span className="font-medium">{(devis.montantHT || 0) / (devis.superficie || 1)} €/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant HT:</span>
                      <span className="font-medium">{devis.montantHT?.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA ({devis.tva}%):</span>
                      <span className="font-medium">{((devis.montantHT || 0) * (devis.tva || 20) / 100).toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Montant TTC:</span>
                      <span>{devis.montantTTC?.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Calculs de marge */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Calculs de marge</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Coût estimé:</span>
                      <span className="font-medium">{(devis.montantHT || 0) * 0.7} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marge brute:</span>
                      <span className="font-medium">{devis.marge?.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux de marge:</span>
                      <span className="font-medium">{devis.tauxMarge?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rentabilité:</span>
                      <span className={`font-medium ${
                        (devis.tauxMarge || 0) > 30 ? 'text-green-600' : 
                        (devis.tauxMarge || 0) > 20 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(devis.tauxMarge || 0) > 30 ? 'Excellente' : 
                         (devis.tauxMarge || 0) > 20 ? 'Bonne' : 'Faible'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Documents associés</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Document size={16} className="mr-2" />
                  Ajouter un document
                </Button>
              </div>

              {devis.documents && devis.documents.length > 0 ? (
                <div className="space-y-3">
                  {devis.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Document size={20} className="text-gray-500" />
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.nom}</h4>
                          <p className="text-sm text-gray-600">
                            {doc.type} - {(doc.taille / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Download size={14} />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Document size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Aucun document associé à ce devis</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              
              {devis.notifications && devis.notifications.length > 0 ? (
                <div className="space-y-3">
                  {devis.notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                      notification.priorite === 'urgente' ? 'border-red-500 bg-red-50' :
                      notification.priorite === 'haute' ? 'border-orange-500 bg-orange-50' :
                      notification.priorite === 'normale' ? 'border-blue-500 bg-blue-50' :
                      'border-gray-500 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.titre}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.priorite === 'urgente' ? 'bg-red-100 text-red-800' :
                            notification.priorite === 'haute' ? 'bg-orange-100 text-orange-800' :
                            notification.priorite === 'normale' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.priorite}
                          </span>
                          {!notification.lue && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Aucune notification pour ce devis</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowEditModal(true)}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Edit size={16} className="mr-2" />
                Modifier
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Exporter PDF
              </Button>
              <Button variant="outline">
                <Send size={16} className="mr-2" />
                Envoyer par email
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Confirmer la suppression"
          >
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Messages d'état */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {success}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DevisDetails; 