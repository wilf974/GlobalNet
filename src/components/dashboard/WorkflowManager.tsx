import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { WorkflowAction, WorkflowStep } from '../../types/devis';
import { useWorkflow } from '../../hooks/useWorkflow';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface WorkflowManagerProps {
  devisId?: string;
  onWorkflowUpdate?: (workflowSteps: WorkflowStep[]) => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({ 
  devisId, 
  onWorkflowUpdate 
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState<WorkflowAction | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    config,
    updateConfig,
    getNextStep,
    canProceedToStep,
    getRequiredApprovals,
    startWorkflow,
    proceedToNextStep,
    approveStep,
    rejectStep,
    loading,
    error,
    success
  } = useWorkflow();

  const workflowSteps = [
    { action: 'creation' as WorkflowAction, label: 'Création', description: 'Création initiale du devis' },
    { action: 'validation_commercial' as WorkflowAction, label: 'Validation Commercial', description: 'Validation par le commercial' },
    { action: 'validation_manager' as WorkflowAction, label: 'Validation Manager', description: 'Validation par le manager' },
    { action: 'validation_directeur' as WorkflowAction, label: 'Validation Directeur', description: 'Validation par le directeur' },
    { action: 'approbation_client' as WorkflowAction, label: 'Approbation Client', description: 'Approbation par le client' },
    { action: 'execution' as WorkflowAction, label: 'Exécution', description: 'Exécution du service' },
    { action: 'facturation' as WorkflowAction, label: 'Facturation', description: 'Création de la facture' },
    { action: 'paiement' as WorkflowAction, label: 'Paiement', description: 'Réception du paiement' }
  ];

  const getStepStatus = (step: WorkflowAction) => {
    // Simulation du statut - dans une vraie app, ce serait basé sur les données réelles
    if (step === 'creation') return 'completed';
    if (step === 'validation_commercial') return 'completed';
    if (step === 'validation_manager') return 'pending';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handleStepAction = async (step: WorkflowAction, action: 'approve' | 'reject') => {
    if (!devisId) return;

    try {
      if (action === 'approve') {
        await approveStep({ id: devisId } as any, step, 'user123', 'Admin');
      } else {
        await rejectStep({ id: devisId } as any, step, 'user123', 'Admin', 'Rejeté');
      }
    } catch (err) {
      console.error('Erreur lors de l\'action:', err);
    }
  };

  const handleConfigUpdate = (newConfig: any) => {
    updateConfig(newConfig);
    setShowConfigModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestion des Workflows</h3>
          <p className="text-sm text-gray-600">Configuration et suivi des processus d'approbation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            size="sm"
          >
            <Edit size={16} className="mr-2" />
            {isEditing ? 'Terminer' : 'Modifier'}
          </Button>
          <Button
            onClick={() => setShowConfigModal(true)}
            variant="outline"
            size="sm"
          >
            <Settings size={16} className="mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Configuration actuelle */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Configuration actuelle</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Auto-approbation:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              config.autoApprove ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {config.autoApprove ? 'Activée' : 'Désactivée'}
            </span>
          </div>
          <div>
            <span className="font-medium">Approbation client:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              config.requireClientApproval ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {config.requireClientApproval ? 'Requis' : 'Non requis'}
            </span>
          </div>
          <div>
            <span className="font-medium">Niveau max d'approbation:</span>
            <span className="ml-2 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
              {config.maxApprovalLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Étapes du workflow */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Étapes du workflow</h4>
        <div className="space-y-3">
          {workflowSteps.map((step, index) => {
            const status = getStepStatus(step.action);
            const isActive = config.steps.includes(step.action);
            const canProceed = canProceedToStep({ id: devisId || '' } as any, step.action);
            
            return (
              <motion.div
                key={step.action}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(status)}`}>
                      {status === 'completed' ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : status === 'rejected' ? (
                        <XCircle size={16} className="text-white" />
                      ) : (
                        <Clock size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{step.label}</h5>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (isActive) {
                            updateConfig({
                              steps: config.steps.filter(s => s !== step.action)
                            });
                          } else {
                            updateConfig({
                              steps: [...config.steps, step.action]
                            });
                          }
                        }}
                        className={isActive ? 'text-red-600 border-red-600' : 'text-green-600 border-green-600'}
                      >
                        {isActive ? <XCircle size={14} /> : <Plus size={14} />}
                      </Button>
                    )}
                    
                    {!isEditing && isActive && devisId && (
                      <div className="flex items-center gap-1">
                        {status === 'pending' && canProceed && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStepAction(step.action, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStepAction(step.action, 'reject')}
                              className="border-red-500 text-red-600"
                            >
                              <XCircle size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'completed' ? 'bg-green-100 text-green-800' :
                      status === 'rejected' ? 'bg-red-100 text-red-800' :
                      status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions globales */}
      {devisId && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Actions globales</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => startWorkflow({ id: devisId } as any)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Play size={16} className="mr-2" />
              Démarrer le workflow
            </Button>
            <Button
              onClick={() => proceedToNextStep({ id: devisId } as any, 'user123', 'Admin')}
              disabled={loading}
              variant="outline"
            >
              <CheckCircle size={16} className="mr-2" />
              Étape suivante
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600"
            >
              <Pause size={16} className="mr-2" />
              Pause
            </Button>
            <Button
              variant="outline"
              className="border-gray-500 text-gray-600"
            >
              <RotateCcw size={16} className="mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      )}

      {/* Modal de configuration */}
      {showConfigModal && (
        <Modal
          isOpen={showConfigModal}
          onClose={() => setShowConfigModal(false)}
          title="Configuration du workflow"
        >
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-approbation
              </label>
              <input
                type="checkbox"
                checked={config.autoApprove}
                onChange={(e) => handleConfigUpdate({ autoApprove: e.target.checked })}
                className="rounded border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Permet l'approbation automatique des étapes simples
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approbation client requise
              </label>
              <input
                type="checkbox"
                checked={config.requireClientApproval}
                onChange={(e) => handleConfigUpdate({ requireClientApproval: e.target.checked })}
                className="rounded border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nécessite l'approbation du client avant exécution
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau maximum d'approbation
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={config.maxApprovalLevel}
                onChange={(e) => handleConfigUpdate({ maxApprovalLevel: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nombre maximum d'approbations requises
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notificationSettings.email}
                    onChange={(e) => handleConfigUpdate({
                      notificationSettings: {
                        ...config.notificationSettings,
                        email: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notificationSettings.push}
                    onChange={(e) => handleConfigUpdate({
                      notificationSettings: {
                        ...config.notificationSettings,
                        push: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 mr-2"
                  />
                  Push
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.notificationSettings.inApp}
                    onChange={(e) => handleConfigUpdate({
                      notificationSettings: {
                        ...config.notificationSettings,
                        inApp: e.target.checked
                      }
                    })}
                    className="rounded border-gray-300 mr-2"
                  />
                  In-App
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfigModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={() => setShowConfigModal(false)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} className="mr-2" />
                Sauvegarder
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
    </div>
  );
};

export default WorkflowManager; 