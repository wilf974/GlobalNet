import { useState, useCallback } from 'react';
import { Devis, WorkflowStep, WorkflowAction, NotificationItem, NotificationType } from '../types/devis';

interface WorkflowConfig {
  steps: WorkflowAction[];
  autoApprove: boolean;
  requireClientApproval: boolean;
  maxApprovalLevel: number;
  notificationSettings: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

interface UseWorkflowReturn {
  // Configuration du workflow
  config: WorkflowConfig;
  updateConfig: (config: Partial<WorkflowConfig>) => void;
  
  // Gestion des étapes
  getNextStep: (devis: Devis) => WorkflowAction | null;
  canProceedToStep: (devis: Devis, step: WorkflowAction) => boolean;
  getRequiredApprovals: (devis: Devis) => string[];
  
  // Actions de workflow
  startWorkflow: (devis: Devis) => Promise<Devis>;
  proceedToNextStep: (devis: Devis, userId: string, userName: string, commentaire?: string) => Promise<Devis>;
  approveStep: (devis: Devis, step: WorkflowAction, userId: string, userName: string, commentaire?: string) => Promise<Devis>;
  rejectStep: (devis: Devis, step: WorkflowAction, userId: string, userName: string, raison: string) => Promise<Devis>;
  
  // Notifications automatiques
  createWorkflowNotification: (devis: Devis, step: WorkflowAction, type: 'approval' | 'rejection' | 'completion') => NotificationItem;
  sendWorkflowNotifications: (devis: Devis, notifications: NotificationItem[]) => Promise<void>;
  
  // États
  loading: boolean;
  error: string | null;
  success: string | null;
}

const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
  steps: [
    'creation',
    'validation_commercial',
    'validation_manager',
    'approbation_client',
    'execution',
    'facturation',
    'paiement'
  ],
  autoApprove: false,
  requireClientApproval: true,
  maxApprovalLevel: 3,
  notificationSettings: {
    email: true,
    push: true,
    inApp: true,
  },
};

export const useWorkflow = (): UseWorkflowReturn => {
  const [config, setConfig] = useState<WorkflowConfig>(DEFAULT_WORKFLOW_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mettre à jour la configuration
  const updateConfig = useCallback((newConfig: Partial<WorkflowConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Obtenir la prochaine étape du workflow
  const getNextStep = useCallback((devis: Devis): WorkflowAction | null => {
    const currentStep = devis.workflowHistory[devis.workflowHistory.length - 1]?.action;
    const currentIndex = config.steps.indexOf(currentStep || 'creation');
    
    if (currentIndex === -1 || currentIndex >= config.steps.length - 1) {
      return null;
    }
    
    return config.steps[currentIndex + 1];
  }, [config.steps]);

  // Vérifier si on peut passer à une étape
  const canProceedToStep = useCallback((devis: Devis, step: WorkflowAction): boolean => {
    const currentStep = devis.workflowHistory[devis.workflowHistory.length - 1]?.action;
    const currentIndex = config.steps.indexOf(currentStep || 'creation');
    const targetIndex = config.steps.indexOf(step);
    
    // Vérifier que l'étape précédente est complétée
    if (targetIndex > currentIndex + 1) {
      return false;
    }
    
    // Vérifier les conditions spécifiques
    switch (step) {
      case 'approbation_client':
        return config.requireClientApproval;
      case 'execution':
        return devis.statut === 'approved';
      case 'facturation':
        return devis.statut === 'completed';
      default:
        return true;
    }
  }, [config]);

  // Obtenir les approbations requises
  const getRequiredApprovals = useCallback((devis: Devis): string[] => {
    const approvals: string[] = [];
    
    if (config.steps.includes('validation_commercial')) {
      approvals.push('Commercial');
    }
    
    if (config.steps.includes('validation_manager')) {
      approvals.push('Manager');
    }
    
    if (config.steps.includes('validation_directeur')) {
      approvals.push('Directeur');
    }
    
    if (config.requireClientApproval && config.steps.includes('approbation_client')) {
      approvals.push('Client');
    }
    
    return approvals;
  }, [config]);

  // Démarrer le workflow
  const startWorkflow = useCallback(async (devis: Devis): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const firstStep = config.steps[0];
      const workflowStep: WorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: firstStep,
        status: 'completed',
        userId: devis.commercialId,
        userName: 'Commercial',
        date: new Date().toISOString(),
        commentaire: 'Workflow démarré',
      };
      
      const updatedDevis: Devis = {
        ...devis,
        statut: 'pending',
        workflowHistory: [...devis.workflowHistory, workflowStep],
      };
      
      // Créer et envoyer les notifications
      const notification = createWorkflowNotification(updatedDevis, firstStep, 'completion');
      await sendWorkflowNotifications(updatedDevis, [notification]);
      
      setSuccess('Workflow démarré avec succès');
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du démarrage du workflow';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config, createWorkflowNotification, sendWorkflowNotifications]);

  // Passer à l'étape suivante
  const proceedToNextStep = useCallback(async (
    devis: Devis, 
    userId: string, 
    userName: string, 
    commentaire?: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const nextStep = getNextStep(devis);
      if (!nextStep) {
        throw new Error('Aucune étape suivante disponible');
      }
      
      if (!canProceedToStep(devis, nextStep)) {
        throw new Error(`Impossible de passer à l'étape ${nextStep}`);
      }
      
      const workflowStep: WorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: nextStep,
        status: 'completed',
        userId,
        userName,
        date: new Date().toISOString(),
        commentaire,
      };
      
      // Mettre à jour le statut selon l'étape
      let newStatus: Devis['statut'] = devis.statut;
      switch (nextStep) {
        case 'approbation_client':
          newStatus = 'pending';
          break;
        case 'execution':
          newStatus = 'approved';
          break;
        case 'facturation':
          newStatus = 'completed';
          break;
        case 'paiement':
          newStatus = 'completed';
          break;
      }
      
      const updatedDevis: Devis = {
        ...devis,
        statut: newStatus,
        workflowHistory: [...devis.workflowHistory, workflowStep],
      };
      
      // Créer et envoyer les notifications
      const notification = createWorkflowNotification(updatedDevis, nextStep, 'completion');
      await sendWorkflowNotifications(updatedDevis, [notification]);
      
      setSuccess(`Étape ${nextStep} terminée avec succès`);
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du passage à l\'étape suivante';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getNextStep, canProceedToStep, createWorkflowNotification, sendWorkflowNotifications]);

  // Approuver une étape
  const approveStep = useCallback(async (
    devis: Devis, 
    step: WorkflowAction, 
    userId: string, 
    userName: string, 
    commentaire?: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!canProceedToStep(devis, step)) {
        throw new Error(`Impossible d'approuver l'étape ${step}`);
      }
      
      const workflowStep: WorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: step,
        status: 'completed',
        userId,
        userName,
        date: new Date().toISOString(),
        commentaire,
      };
      
      const updatedDevis: Devis = {
        ...devis,
        workflowHistory: [...devis.workflowHistory, workflowStep],
      };
      
      // Créer et envoyer les notifications
      const notification = createWorkflowNotification(updatedDevis, step, 'approval');
      await sendWorkflowNotifications(updatedDevis, [notification]);
      
      setSuccess(`Étape ${step} approuvée avec succès`);
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'approbation de l\'étape';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [canProceedToStep, createWorkflowNotification, sendWorkflowNotifications]);

  // Rejeter une étape
  const rejectStep = useCallback(async (
    devis: Devis, 
    step: WorkflowAction, 
    userId: string, 
    userName: string, 
    raison: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const workflowStep: WorkflowStep = {
        id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action: step,
        status: 'rejected',
        userId,
        userName,
        date: new Date().toISOString(),
        commentaire: raison,
      };
      
      const updatedDevis: Devis = {
        ...devis,
        statut: 'rejected',
        workflowHistory: [...devis.workflowHistory, workflowStep],
      };
      
      // Créer et envoyer les notifications
      const notification = createWorkflowNotification(updatedDevis, step, 'rejection');
      await sendWorkflowNotifications(updatedDevis, [notification]);
      
      setSuccess(`Étape ${step} rejetée`);
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du rejet de l\'étape';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createWorkflowNotification, sendWorkflowNotifications]);

  // Créer une notification de workflow
  const createWorkflowNotification = useCallback((
    devis: Devis, 
    step: WorkflowAction, 
    type: 'approval' | 'rejection' | 'completion'
  ): NotificationItem => {
    const getNotificationType = (): NotificationType => {
      switch (type) {
        case 'approval':
          return 'devis_approved';
        case 'rejection':
          return 'devis_rejected';
        case 'completion':
          return 'workflow_step';
        default:
          return 'system';
      }
    };
    
    const getTitre = (): string => {
      switch (type) {
        case 'approval':
          return `Devis ${devis.id} approuvé`;
        case 'rejection':
          return `Devis ${devis.id} rejeté`;
        case 'completion':
          return `Étape ${step} terminée`;
        default:
          return 'Notification workflow';
      }
    };
    
    const getMessage = (): string => {
      switch (type) {
        case 'approval':
          return `Le devis ${devis.id} a été approuvé à l'étape ${step}`;
        case 'rejection':
          return `Le devis ${devis.id} a été rejeté à l'étape ${step}`;
        case 'completion':
          return `L'étape ${step} du devis ${devis.id} a été terminée`;
        default:
          return 'Notification du workflow';
      }
    };
    
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: getNotificationType(),
      titre: getTitre(),
      message: getMessage(),
      priorite: type === 'rejection' ? 'haute' : 'normale',
      date: new Date().toISOString(),
      lue: false,
      action: {
        type: 'open_devis',
        targetId: devis.id,
      },
      metadata: {
        devisId: devis.id,
        step,
        type,
      },
    };
  }, []);

  // Envoyer les notifications de workflow
  const sendWorkflowNotifications = useCallback(async (
    devis: Devis, 
    notifications: NotificationItem[]
  ): Promise<void> => {
    try {
      // Simulation d'envoi de notifications
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Ici, on pourrait envoyer les notifications par email, push, etc.
      console.log('Notifications envoyées:', notifications);
    } catch (err) {
      console.error('Erreur lors de l\'envoi des notifications:', err);
    }
  }, []);

  return {
    config,
    updateConfig,
    getNextStep,
    canProceedToStep,
    getRequiredApprovals,
    startWorkflow,
    proceedToNextStep,
    approveStep,
    rejectStep,
    createWorkflowNotification,
    sendWorkflowNotifications,
    loading,
    error,
    success,
  };
}; 