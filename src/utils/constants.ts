// Constantes de l'application

export const APP_CONFIG = {
  company: {
    nom: "GlobalNet Services",
    adresse: "123 Rue de la Propreté, 75001 Paris",
    telephone: "01 23 45 67 89",
    email: "contact@globalnet-services.fr",
    siret: "123 456 789 00012",
    logo: "/images/logo.png"
  },
  contact: {
    email: "contact@globalnet-services.fr",
    telephone: "01 23 45 67 89",
    adresse: "123 Rue de la Propreté, 75001 Paris"
  }
};

export const TARIFS = {
  bureaux: {
    prixParM2: 0.85,
    prixMinimum: 150,
    reductionFrequence: {
      hebdomadaire: 0.15,
      mensuel: 0.20,
      trimestriel: 0.25
    },
    options: {
      nettoyageVitres: 0.50,
      desinfection: 0.30,
      nettoyageFacades: 1.20,
      nettoyageParking: 0.40,
      nettoyageCarpettes: 0.60,
      traitementAntiCalcaire: 0.25
    }
  },
  industriel: {
    prixParM2: 1.20,
    prixMinimum: 300,
    reductionFrequence: {
      hebdomadaire: 0.20,
      mensuel: 0.25,
      trimestriel: 0.30
    },
    options: {
      nettoyageVitres: 0.75,
      desinfection: 0.50,
      nettoyageFacades: 1.50,
      nettoyageParking: 0.60,
      nettoyageCarpettes: 0.80,
      traitementAntiCalcaire: 0.35
    }
  },
  residentiel: {
    prixParM2: 0.65,
    prixMinimum: 100,
    reductionFrequence: {
      hebdomadaire: 0.10,
      mensuel: 0.15,
      trimestriel: 0.20
    },
    options: {
      nettoyageVitres: 0.40,
      desinfection: 0.25,
      nettoyageFacades: 1.00,
      nettoyageParking: 0.30,
      nettoyageCarpettes: 0.50,
      traitementAntiCalcaire: 0.20
    }
  },
  commercial: {
    prixParM2: 0.95,
    prixMinimum: 200,
    reductionFrequence: {
      hebdomadaire: 0.15,
      mensuel: 0.20,
      trimestriel: 0.25
    },
    options: {
      nettoyageVitres: 0.60,
      desinfection: 0.35,
      nettoyageFacades: 1.30,
      nettoyageParking: 0.50,
      nettoyageCarpettes: 0.70,
      traitementAntiCalcaire: 0.30
    }
  }
};

export const SERVICES = [
  {
    id: "bureaux",
    nom: "Nettoyage de Bureaux",
    description: "Nettoyage professionnel des espaces de travail",
    prixBase: 0.85,
    unite: "m2",
    image: "/images/services/bureaux.jpg",
    categorie: "bureaux",
    actif: true
  },
  {
    id: "industriel",
    nom: "Nettoyage Industriel",
    description: "Nettoyage spécialisé pour sites industriels",
    prixBase: 1.20,
    unite: "m2",
    image: "/images/services/industriel.jpg",
    categorie: "industriel",
    actif: true
  },
  {
    id: "residentiel",
    nom: "Nettoyage Résidentiel",
    description: "Nettoyage complet pour particuliers",
    prixBase: 0.65,
    unite: "m2",
    image: "/images/services/residentiel.jpg",
    categorie: "residentiel",
    actif: true
  },
  {
    id: "commercial",
    nom: "Nettoyage Commercial",
    description: "Nettoyage des espaces commerciaux",
    prixBase: 0.95,
    unite: "m2",
    image: "/images/services/commercial.jpg",
    categorie: "commercial",
    actif: true
  }
];

export const FORM_STEPS = [
  {
    id: 1,
    titre: "Informations Client",
    description: "Vos coordonnées",
    valide: false
  },
  {
    id: 2,
    titre: "Détails du Service",
    description: "Type et superficie",
    valide: false
  },
  {
    id: 3,
    titre: "Options Supplémentaires",
    description: "Services additionnels",
    valide: false
  },
  {
    id: 4,
    titre: "Validation",
    description: "Récapitulatif et signature",
    valide: false
  }
];

export const FREQUENCES = [
  { value: "ponctuel", label: "Ponctuel" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
  { value: "trimestriel", label: "Trimestriel" }
];

export const TYPES_NETTOYAGE = [
  { value: "bureaux", label: "Bureaux" },
  { value: "industriel", label: "Industriel" },
  { value: "residentiel", label: "Résidentiel" },
  { value: "commercial", label: "Commercial" }
];

export const OPTIONS_SUPPLEMENTAIRES = [
  { key: "nettoyageVitres", label: "Nettoyage des vitres", description: "Nettoyage intérieur et extérieur des vitres" },
  { key: "desinfection", label: "Désinfection", description: "Traitement désinfectant des surfaces" },
  { key: "nettoyageFacades", label: "Nettoyage des façades", description: "Nettoyage des façades extérieures" },
  { key: "nettoyageParking", label: "Nettoyage du parking", description: "Nettoyage des zones de stationnement" },
  { key: "nettoyageCarpettes", label: "Nettoyage des carpettes", description: "Nettoyage professionnel des moquettes" },
  { key: "traitementAntiCalcaire", label: "Traitement anti-calcaire", description: "Traitement préventif anti-calcaire" }
];

export const CGV_TEXT = `
CONDITIONS GÉNÉRALES DE VENTE

Article 1 - Objet
Les présentes conditions générales de vente s'appliquent à toutes les prestations de nettoyage conclues par CleanPro Services.

Article 2 - Services
CleanPro Services propose des services de nettoyage professionnel pour bureaux, locaux industriels, résidentiels et commerciaux.

Article 3 - Tarifs
Les tarifs sont exprimés en euros hors taxes. La TVA applicable est de 20%.

Article 4 - Modalités de paiement
Le paiement s'effectue à 30 jours fin de mois par chèque ou virement bancaire.

Article 5 - Exécution
Les interventions sont effectuées selon les horaires convenus et dans le respect des consignes de sécurité.

Article 6 - Responsabilité
CleanPro Services s'engage à effectuer ses prestations avec le plus grand soin et dans le respect des règles d'hygiène et de sécurité.

Article 7 - Résiliation
Tout contrat peut être résilié avec un préavis de 30 jours par lettre recommandée avec accusé de réception.

Article 8 - Droit applicable
Les présentes conditions sont soumises au droit français.
`;

export const VALIDATION_MESSAGES = {
  required: "Ce champ est obligatoire",
  email: "Veuillez saisir une adresse email valide",
  phone: "Veuillez saisir un numéro de téléphone valide",
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  minValue: (min: number) => `La valeur minimum est ${min}`,
  maxValue: (max: number) => `La valeur maximum est ${max}`,
  superficie: "La superficie doit être supérieure à 0",
  date: "Veuillez saisir une date valide",
  cgv: "Vous devez accepter les conditions générales de vente"
};

export const API_ENDPOINTS = {
  devis: "/api/devis",
  clients: "/api/clients",
  services: "/api/services",
  photos: "/api/photos",
  auth: "/api/auth",
  upload: "/api/upload",
  pdf: "/api/pdf"
};

export const STORAGE_KEYS = {
  devisDraft: "devis_draft",
  userPreferences: "user_preferences",
  authToken: "auth_token"
}; 