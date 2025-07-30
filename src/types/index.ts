// Types principaux pour l'application de nettoyage

export interface DevisData {
  id?: string;
  clientInfo: {
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    codePostal: string;
    ville: string;
  };
  serviceDetails: {
    typeNettoyage: 'bureaux' | 'industriel' | 'residentiel' | 'commercial';
    superficie: number;
    frequence: 'ponctuel' | 'hebdomadaire' | 'mensuel' | 'trimestriel';
    dateIntervention: Date;
    horaires: string;
  };
  optionsSupplementaires: {
    nettoyageVitres: boolean;
    desinfection: boolean;
    nettoyageFacades: boolean;
    nettoyageParking: boolean;
    nettoyageCarpettes: boolean;
    traitementAntiCalcaire: boolean;
  };
  prixTotal: number;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse';
  dateCreation: Date;
  dateModification: Date;
  signature?: string;
  cgvAcceptees: boolean;
  commentaires?: string;
}

export interface Service {
  id: string;
  nom: string;
  description: string;
  prixBase: number;
  unite: 'm2' | 'heure' | 'forfait';
  image: string;
  categorie: 'bureaux' | 'industriel' | 'residentiel' | 'commercial';
  actif: boolean;
}

export interface Tarif {
  id: string;
  typeNettoyage: string;
  prixParM2: number;
  prixMinimum: number;
  reductionFrequence: {
    hebdomadaire: number;
    mensuel: number;
    trimestriel: number;
  };
  options: {
    nettoyageVitres: number;
    desinfection: number;
    nettoyageFacades: number;
    nettoyageParking: number;
    nettoyageCarpettes: number;
    traitementAntiCalcaire: number;
  };
}

export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateCreation: Date;
  devis: DevisData[];
}

export interface Photo {
  id: string;
  url: string;
  titre: string;
  description: string;
  categorie: 'avant' | 'apres' | 'equipe' | 'materiel';
  typeService: string;
  dateUpload: Date;
  publicId: string; // Pour Cloudinary
}

export interface User {
  id: string;
  email: string;
  nom: string;
  role: 'admin' | 'user';
  dateCreation: Date;
  derniereConnexion: Date;
}

export interface Notification {
  id: string;
  type: 'devis' | 'client' | 'system';
  titre: string;
  message: string;
  lu: boolean;
  dateCreation: Date;
  userId: string;
}

export interface Statistiques {
  totalDevis: number;
  devisAcceptes: number;
  devisEnCours: number;
  chiffreAffaires: number;
  clientsActifs: number;
  tauxConversion: number;
}

// Types pour les formulaires
export interface FormStep {
  id: number;
  titre: string;
  description: string;
  valide: boolean;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Types pour l'API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  pagination: PaginationParams;
}

// Types pour les composants UI
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface BaseInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string | number;
  className?: string;
}

export interface InputProps extends BaseInputProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'password';
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface TextareaProps extends BaseInputProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  type?: 'textarea';
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export type InputComponentProps = InputProps | TextareaProps;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Types pour les hooks personnalisés
export interface UseDevisCalculator {
  calculatePrice: (data: Partial<DevisData>) => number;
  getTarifByType: (type: string) => number;
  getReductionFrequence: (frequence: string) => number;
}

export interface UseFormStepper {
  currentStep: number;
  steps: FormStep[];
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
}

// Types pour les utilitaires
export interface PdfOptions {
  logo?: string;
  companyInfo: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    siret: string;
  };
  devisNumber: string;
  validite: number; // en jours
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Types pour les configurations
export interface AppConfig {
  company: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    siret: string;
    logo: string;
  };
  services: Service[];
  tarifs: Tarif[];
  cgv: string;
  contact: {
    email: string;
    telephone: string;
    adresse: string;
  };
} 