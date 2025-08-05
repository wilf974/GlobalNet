import { useState, useCallback } from 'react';
import { Devis, DevisStatus, WorkflowStep, WorkflowAction, Approval, NotificationItem } from '../types/devis';

interface UseDevisActionsReturn {
  // Actions principales
  createDevis: (data: Partial<Devis>) => Promise<Devis>;
  updateDevis: (id: string, data: Partial<Devis>) => Promise<Devis>;
  deleteDevis: (id: string) => Promise<void>;
  
  // Actions de workflow
  approveDevis: (id: string, userId: string, userName: string, commentaire?: string) => Promise<Devis>;
  rejectDevis: (id: string, userId: string, userName: string, raison: string) => Promise<Devis>;
  completeDevis: (id: string, userId: string, userName: string) => Promise<Devis>;
  cancelDevis: (id: string, userId: string, userName: string, raison: string) => Promise<Devis>;
  
  // Actions de calcul
  calculateDevis: (devis: Devis) => Devis;
  calculateCA: (devisList: Devis[]) => number;
  
  // Actions d'export et envoi
  downloadDevis: (devis: Devis) => Promise<void>;
  sendDevisEmail: (devis: Devis, email: string) => Promise<void>;
  
  // Actions de notification
  addNotification: (devisId: string, notification: Omit<NotificationItem, 'id' | 'date'>) => Promise<void>;
  markNotificationAsRead: (devisId: string, notificationId: string) => Promise<void>;
  
  // États
  loading: boolean;
  error: string | null;
  success: string | null;
  isDownloading: boolean;
  isSending: boolean;
  clearError: () => void;
}

export const useDevisActions = (): UseDevisActionsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Fonction utilitaire pour créer un step de workflow
  const createWorkflowStep = useCallback((
    action: WorkflowAction,
    userId: string,
    userName: string,
    status: 'pending' | 'completed' | 'rejected' = 'completed',
    commentaire?: string
  ): WorkflowStep => ({
    id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    action,
    status,
    userId,
    userName,
    date: new Date().toISOString(),
    commentaire,
  }), []);

  // Fonction utilitaire pour créer une approbation
  const createApproval = useCallback((
    userId: string,
    userName: string,
    role: string,
    action: 'approve' | 'reject',
    commentaire?: string
  ): Approval => ({
    id: `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    role,
    action,
    date: new Date().toISOString(),
    commentaire,
  }), []);

  // Créer un nouveau devis
  const createDevis = useCallback(async (data: Partial<Devis>): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const newDevis: Devis = {
        id: `devis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client: data.client || '',
        email: data.email || '',
        telephone: data.telephone || '',
        service: data.service || '',
        superficie: data.superficie || 0,
        prix: data.prix || 0,
        statut: 'draft',
        dateCreation: new Date().toISOString(),
        dateIntervention: data.dateIntervention || new Date().toISOString(),
        adresse: data.adresse,
        notes: data.notes,
        montantHT: data.montantHT || 0,
        montantTTC: data.montantTTC || 0,
        tva: data.tva || 20,
        marge: data.marge || 0,
        tauxMarge: data.tauxMarge || 0,
        clientId: data.clientId || '',
        commercialId: data.commercialId || '',
        workflowHistory: [createWorkflowStep('creation', data.commercialId || '', 'Commercial')],
        notifications: [],
        tags: data.tags || [],
        priorite: data.priorite || 'normale',
        dureeValidite: data.dureeValidite || 30,
        dateExpiration: new Date(Date.now() + (data.dureeValidite || 30) * 24 * 60 * 60 * 1000).toISOString(),
        conditions: data.conditions || [],
        documents: data.documents || [],
        approbations: data.approbations || [],
      };

      // Calculer automatiquement les montants
      const devisCalculated = calculateDevis(newDevis);
      
      setSuccess('Devis créé avec succès');
      return devisCalculated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createWorkflowStep]);

  // Mettre à jour un devis
  const updateDevis = useCallback(async (id: string, data: Partial<Devis>): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation de mise à jour - dans une vraie app, ce serait un appel API
      const updatedDevis: Devis = {
        ...data,
        id,
        dateModification: new Date().toISOString(),
      } as Devis;

      // Recalculer les montants si nécessaire
      const devisCalculated = calculateDevis(updatedDevis);
      
      setSuccess('Devis mis à jour avec succès');
      return devisCalculated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un devis
  const deleteDevis = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation de suppression - dans une vraie app, ce serait un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess('Devis supprimé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Approuver un devis
  const approveDevis = useCallback(async (
    id: string, 
    userId: string, 
    userName: string, 
    commentaire?: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const approval = createApproval(userId, userName, 'Approbateur', 'approve', commentaire);
      const workflowStep = createWorkflowStep('validation_manager', userId, userName, 'completed', commentaire);
      
      // Simulation de mise à jour
      const updatedDevis: Devis = {
        id,
        statut: 'approved',
        approbations: [approval],
        workflowHistory: [workflowStep],
      } as Devis;
      
      setSuccess('Devis approuvé avec succès');
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'approbation du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createApproval, createWorkflowStep]);

  // Rejeter un devis
  const rejectDevis = useCallback(async (
    id: string, 
    userId: string, 
    userName: string, 
    raison: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const approval = createApproval(userId, userName, 'Approbateur', 'reject', raison);
      const workflowStep = createWorkflowStep('validation_manager', userId, userName, 'rejected', raison);
      
      // Simulation de mise à jour
      const updatedDevis: Devis = {
        id,
        statut: 'rejected',
        approbations: [approval],
        workflowHistory: [workflowStep],
      } as Devis;
      
      setSuccess('Devis rejeté');
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du rejet du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createApproval, createWorkflowStep]);

  // Terminer un devis
  const completeDevis = useCallback(async (
    id: string, 
    userId: string, 
    userName: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const workflowStep = createWorkflowStep('execution', userId, userName, 'completed');
      
      // Simulation de mise à jour
      const updatedDevis: Devis = {
        id,
        statut: 'completed',
        workflowHistory: [workflowStep],
      } as Devis;
      
      setSuccess('Devis terminé avec succès');
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la finalisation du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createWorkflowStep]);

  // Annuler un devis
  const cancelDevis = useCallback(async (
    id: string, 
    userId: string, 
    userName: string, 
    raison: string
  ): Promise<Devis> => {
    setLoading(true);
    setError(null);
    
    try {
      const workflowStep = createWorkflowStep('creation', userId, userName, 'rejected', raison);
      
      // Simulation de mise à jour
      const updatedDevis: Devis = {
        id,
        statut: 'cancelled',
        workflowHistory: [workflowStep],
      } as Devis;
      
      setSuccess('Devis annulé');
      return updatedDevis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'annulation du devis';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createWorkflowStep]);

  // Calculer les montants d'un devis
  const calculateDevis = useCallback((devis: Devis): Devis => {
    const montantHT = devis.montantHT || devis.prix || 0;
    const tva = devis.tva || 20;
    const montantTTC = montantHT * (1 + tva / 100);
    const marge = montantHT * 0.3; // 30% de marge par défaut
    const tauxMarge = (marge / montantHT) * 100;

    return {
      ...devis,
      montantHT,
      montantTTC: Math.round(montantTTC * 100) / 100,
      marge: Math.round(marge * 100) / 100,
      tauxMarge: Math.round(tauxMarge * 100) / 100,
    };
  }, []);

  // Calculer le CA total
  const calculateCA = useCallback((devisList: Devis[]): number => {
    return devisList
      .filter(devis => devis.statut === 'approved' || devis.statut === 'completed')
      .reduce((total, devis) => total + (devis.montantTTC || 0), 0);
  }, []);

  // Ajouter une notification
  const addNotification = useCallback(async (
    devisId: string, 
    notification: Omit<NotificationItem, 'id' | 'date'>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const newNotification: NotificationItem = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...notification,
        date: new Date().toISOString(),
      };
      
      // Simulation d'ajout de notification
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setSuccess('Notification ajoutée');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marquer une notification comme lue
  const markNotificationAsRead = useCallback(async (
    devisId: string, 
    notificationId: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulation de mise à jour
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setSuccess('Notification marquée comme lue');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la notification';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Télécharger un devis
  const downloadDevis = useCallback(async (devis: Devis): Promise<void> => {
    setIsDownloading(true);
    setError(null);
    
    try {
      // Simulation de téléchargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici on pourrait générer un PDF et le télécharger
      console.log('Téléchargement du devis:', devis.id);
      
      setSuccess('Devis téléchargé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Envoyer un devis par email
  const sendDevisEmail = useCallback(async (devis: Devis, email: string): Promise<void> => {
    setIsSending(true);
    setError(null);
    
    try {
      // Simulation d'envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Envoi du devis par email:', devis.id, 'à', email);
      
      setSuccess('Devis envoyé avec succès');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      setError(errorMessage);
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  // Effacer les erreurs
  const clearError = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    createDevis,
    updateDevis,
    deleteDevis,
    approveDevis,
    rejectDevis,
    completeDevis,
    cancelDevis,
    calculateDevis,
    calculateCA,
    downloadDevis,
    sendDevisEmail,
    addNotification,
    markNotificationAsRead,
    loading,
    error,
    success,
    isDownloading,
    isSending,
    clearError,
  };
}; 