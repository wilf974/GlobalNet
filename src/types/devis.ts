export interface Devis {
  id: string;
  client: string;
  email: string;
  telephone: string;
  service: string;
  superficie: number;
  prix: number;
  statut: DevisStatus;
  dateCreation: string;
  dateIntervention: string;
  adresse?: string;
  notes?: string;
  signature?: string;
  dateSignature?: string;
  // Nouvelles propriétés pour la Phase 2
  montantHT: number;
  montantTTC: number;
  tva: number;
  marge: number;
  tauxMarge: number;
  clientId: string;
  commercialId: string;
  workflowHistory: WorkflowStep[];
  notifications: NotificationItem[];
  tags: string[];
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  dureeValidite: number; // en jours
  dateExpiration: string;
  conditions: string[];
  documents: Document[];
  approbations: Approval[];
}

export type DevisStatus = 
  | 'draft' 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'expired' 
  | 'cancelled';

export interface DevisFormData {
  client: string;
  email: string;
  telephone: string;
  service: string;
  superficie: number;
  adresse?: string;
  notes?: string;
  // Nouvelles propriétés
  montantHT: number;
  tva: number;
  conditions: string[];
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  dureeValidite: number;
  tags: string[];
}

export interface DevisFilters {
  searchTerm: string;
  status: DevisStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  service?: string;
  // Nouveaux filtres
  montantMin?: number;
  montantMax?: number;
  commercialId?: string;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
  tags?: string[];
  clientId?: string;
}

// Types pour les workflows
export interface WorkflowStep {
  id: string;
  action: WorkflowAction;
  status: 'pending' | 'completed' | 'rejected';
  userId: string;
  userName: string;
  date: string;
  commentaire?: string;
  metadata?: Record<string, any>;
}

export type WorkflowAction = 
  | 'creation'
  | 'validation_commercial'
  | 'validation_manager'
  | 'validation_directeur'
  | 'approbation_client'
  | 'execution'
  | 'facturation'
  | 'paiement';

// Types pour les clients
export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  siret?: string;
  tva?: string;
  type: 'particulier' | 'professionnel' | 'entreprise';
  categorie: 'A' | 'B' | 'C' | 'D';
  commercialId: string;
  dateCreation: string;
  derniereActivite: string;
  caTotal: number;
  devisTotal: number;
  devisValides: number;
  tauxConversion: number;
  notes?: string;
  tags: string[];
  contacts: Contact[];
}

export interface Contact {
  id: string;
  nom: string;
  fonction: string;
  email: string;
  telephone: string;
  principal: boolean;
}

// Types pour les calculs CA
export interface CAStats {
  periode: string;
  montantHT: number;
  montantTTC: number;
  nombreDevis: number;
  nombreValides: number;
  tauxConversion: number;
  margeTotale: number;
  tvaCollectee: number;
  tendance: number; // pourcentage
  projection: number;
}

export interface CAFilters {
  dateFrom: string;
  dateTo: string;
  commercialId?: string;
  clientId?: string;
  service?: string;
  groupePar: 'jour' | 'semaine' | 'mois' | 'trimestre' | 'annee';
}

// Types pour les exports
export interface ExportConfig {
  format: 'pdf' | 'excel' | 'csv';
  template: string;
  includeCharts: boolean;
  includeDetails: boolean;
  dateFrom?: string;
  dateTo?: string;
  filters?: DevisFilters;
}

export interface ExportTemplate {
  id: string;
  nom: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv';
  config: Record<string, any>;
  actif: boolean;
}

// Types pour les notifications
export interface NotificationItem {
  id: string;
  type: NotificationType;
  titre: string;
  message: string;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  date: string;
  lue: boolean;
  action?: NotificationAction;
  metadata?: Record<string, any>;
}

export type NotificationType = 
  | 'devis_created'
  | 'devis_approved'
  | 'devis_rejected'
  | 'devis_expired'
  | 'ca_objectif'
  | 'ca_alerte'
  | 'client_nouveau'
  | 'workflow_step'
  | 'export_ready'
  | 'system';

export interface NotificationAction {
  type: 'open_devis' | 'open_client' | 'open_ca' | 'dismiss';
  targetId?: string;
  url?: string;
}

// Types pour les documents
export interface Document {
  id: string;
  nom: string;
  type: 'devis' | 'facture' | 'bon_livraison' | 'autre';
  url: string;
  taille: number;
  dateCreation: string;
  dateModification: string;
}

// Types pour les approbations
export interface Approval {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: 'approve' | 'reject';
  date: string;
  commentaire?: string;
  conditions?: string[];
}

// Types pour les métriques de performance
export interface PerformanceMetrics {
  tauxConversion: number;
  delaiMoyenValidation: number; // en heures
  delaiMoyenPaiement: number; // en jours
  satisfactionClient: number; // 1-5
  reclamations: number;
  devisRenouveles: number;
  caMoyenParDevis: number;
  margeMoyenne: number;
}

// Types pour les rapports
export interface Rapport {
  id: string;
  nom: string;
  type: 'ca' | 'devis' | 'clients' | 'performance' | 'custom';
  periode: string;
  config: Record<string, any>;
  dateGeneration: string;
  url?: string;
  statut: 'en_cours' | 'termine' | 'erreur';
} 