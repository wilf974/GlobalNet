// Configuration SMTP pour l'envoi d'emails
// Note: En production, utilisez des variables d'environnement

export const EMAIL_CONFIG = {
  // Configuration Gmail (exemple)
  gmail: {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
      user: process.env.SMTP_USER || "contact@globalnet-services.fr",
      pass: process.env.SMTP_PASS || "votre_mot_de_passe_app"
    }
  },
  
  // Configuration Outlook/Hotmail
  outlook: {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "contact@globalnet-services.fr",
      pass: process.env.SMTP_PASS || "votre_mot_de_passe"
    }
  },
  
  // Configuration OVH
  ovh: {
    host: "ssl0.ovh.net",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "contact@globalnet-services.fr",
      pass: process.env.SMTP_PASS || "votre_mot_de_passe"
    }
  },
  
  // Configuration SendGrid
  sendgrid: {
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY || "votre_api_key"
    }
  }
};

// Configuration de l'entreprise
export const COMPANY_CONFIG = {
  nom: "GlobalNet Services",
  adresse: "123 Rue de la Propreté, 75001 Paris",
  telephone: "01 23 45 67 89",
  email: "contact@globalnet-services.fr",
  siret: "123 456 789 00012",
  logo: "/images/logo.png"
};

// Configuration par défaut
export const DEFAULT_EMAIL_CONFIG = {
  smtp: EMAIL_CONFIG.gmail,
  from: COMPANY_CONFIG.email,
  companyName: COMPANY_CONFIG.nom
};

// Instructions pour configurer Gmail
export const GMAIL_SETUP_INSTRUCTIONS = `
Pour configurer Gmail avec cette application :

1. Activez l'authentification à 2 facteurs sur votre compte Google
2. Générez un mot de passe d'application :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Connexion à Google > Mots de passe d'application
   - Sélectionnez "Autre (nom personnalisé)" et entrez "GlobalNet"
   - Copiez le mot de passe généré

3. Configurez les variables d'environnement :
   SMTP_USER=votre_email@gmail.com
   SMTP_PASS=votre_mot_de_passe_d_application

4. Ou modifiez directement dans le code :
   auth: {
     user: "votre_email@gmail.com",
     pass: "votre_mot_de_passe_d_application"
   }
`; 