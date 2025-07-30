export interface Devis {
  id: string;
  client: string;
  email: string;
  telephone: string;
  service: string;
  superficie: number;
  prix: number;
  statut: 'En attente' | 'Validé' | 'Terminé' | 'Refusé';
  dateCreation: string;
  dateIntervention: string;
  adresse?: string;
  notes?: string;
  signature?: string;
  dateSignature?: string;
}

export interface DevisFormData {
  client: string;
  email: string;
  telephone: string;
  service: string;
  superficie: number;
  adresse?: string;
  notes?: string;
}

export interface DevisFilters {
  searchTerm: string;
  status: string;
  dateFrom?: string;
  dateTo?: string;
  service?: string;
} 