# Configuration Email - GlobalNet Services

## Vue d'ensemble

Cette application permet de télécharger et d'envoyer des devis par email. Le système utilise une configuration SMTP pour l'envoi d'emails et génère de vrais fichiers PDF.

## Fonctionnalités

### 1. Téléchargement de devis
- **Génération de devis au format PDF** avec jsPDF
- **Téléchargement direct** depuis l'interface
- **Nom de fichier automatique** avec timestamp (ex: `devis-1234567890.pdf`)
- **Layout professionnel** avec en-tête coloré, logo, sections structurées et mise en page moderne
- **Design moderne** avec couleurs professionnelles, cadres arrondis et typographie soignée

### 2. Envoi par email
- **Envoi automatique** du devis par email
- **Template HTML professionnel** dans le corps de l'email
- **Pièce jointe PDF** (optionnel)
- **Configuration SMTP flexible**

## Configuration SMTP

### Option 1: Gmail (Recommandé)

1. **Activez l'authentification à 2 facteurs** sur votre compte Google
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Connexion à Google > Mots de passe d'application
   - Sélectionnez "Autre (nom personnalisé)" et entrez "GlobalNet"
   - Copiez le mot de passe généré

3. **Configurez les variables d'environnement** :
   ```bash
   SMTP_USER=votre_email@gmail.com
   SMTP_PASS=votre_mot_de_passe_d_application
   ```

4. **Ou modifiez directement dans le code** (`src/utils/emailConfig.ts`) :
   ```typescript
   auth: {
     user: "votre_email@gmail.com",
     pass: "votre_mot_de_passe_d_application"
   }
   ```

### Option 2: Outlook/Hotmail

```typescript
// Dans src/utils/emailConfig.ts
outlook: {
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: "votre_email@outlook.com",
    pass: "votre_mot_de_passe"
  }
}
```

### Option 3: OVH

```typescript
// Dans src/utils/emailConfig.ts
ovh: {
  host: "ssl0.ovh.net",
  port: 587,
  secure: false,
  auth: {
    user: "contact@votre-domaine.fr",
    pass: "votre_mot_de_passe"
  }
}
```

### Option 4: SendGrid

```typescript
// Dans src/utils/emailConfig.ts
sendgrid: {
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: "votre_api_key_sendgrid"
  }
}
```

## Configuration de l'entreprise

Modifiez les informations de l'entreprise dans `src/utils/emailConfig.ts` :

```typescript
export const COMPANY_CONFIG = {
  nom: "GlobalNet Services",
  adresse: "123 Rue de la Propreté, 75001 Paris",
  telephone: "01 23 45 67 89",
  email: "contact@globalnet-services.fr",
  siret: "123 456 789 00012",
  logo: "/images/logo.png"
};
```

## Utilisation

### Dans le formulaire de devis

1. **Remplissez le formulaire** jusqu'à l'étape de confirmation
2. **Téléchargez le devis** : Cliquez sur "Télécharger"
3. **Envoyez par email** : Cliquez sur "Envoyer par email"
4. **Soumettez le devis** : Cliquez sur "Envoyer le Devis"

### Fonctions disponibles

```typescript
const { downloadDevis, sendDevisEmail, isDownloading, isSending, error } = useDevisActions();

// Télécharger un devis
await downloadDevis(devisData);

// Envoyer par email
await sendDevisEmail(devisData);
```

## Templates d'email

### Template HTML
- En-tête avec logo et informations de l'entreprise
- Détails du client
- Détails du service
- Options supplémentaires
- Prix total
- Pied de page avec conditions

### Template texte
- Version texte simple pour compatibilité
- Même contenu que la version HTML

## Gestion des erreurs

Le système gère automatiquement :
- Erreurs de connexion SMTP
- Erreurs de génération PDF
- Erreurs de téléchargement
- Affichage des messages d'erreur à l'utilisateur

## Développement

### Structure des fichiers

```
src/
├── utils/
│   ├── emailConfig.ts      # Configuration SMTP
│   ├── emailService.ts     # Service d'envoi d'emails
│   └── pdfGenerator.ts     # Génération de PDF
├── hooks/
│   └── useDevisActions.ts  # Hook pour les actions de devis
└── components/
    └── forms/
        └── QuoteForm.tsx   # Formulaire avec boutons d'action
```

### Ajout d'un nouveau fournisseur SMTP

1. Ajoutez la configuration dans `emailConfig.ts`
2. Modifiez `DEFAULT_EMAIL_CONFIG` si nécessaire
3. Testez la connexion

### Personnalisation des templates

1. Modifiez `generateDevisEmailTemplate()` dans `emailService.ts`
2. Ajustez le style CSS dans le template HTML
3. Modifiez le template texte si nécessaire

## Sécurité

### Variables d'environnement
- Utilisez toujours des variables d'environnement en production
- Ne committez jamais les mots de passe dans le code
- Utilisez des mots de passe d'application pour Gmail

### Validation
- Validation des adresses email
- Vérification des données du devis
- Gestion des erreurs de connexion

## Tests

### Test de configuration SMTP
```typescript
// Test simple de connexion
const emailService = new EmailService(config);
const success = await emailService.sendDevisEmail(testDevisData);
console.log('Test email:', success ? 'Succès' : 'Échec');
```

### Test de génération PDF
```typescript
// Test de génération
const pdfGenerator = new PdfGenerator(config);
const pdfBlob = await pdfGenerator.generateDevisPdf(testDevisData);
console.log('PDF généré:', pdfBlob.size, 'bytes');
```

## Support

Pour toute question ou problème :
1. Vérifiez la configuration SMTP
2. Testez la connexion avec un email simple
3. Consultez les logs de la console
4. Vérifiez les paramètres de sécurité du fournisseur email 

## Design du PDF

### Caractéristiques visuelles
- **En-tête coloré** avec bande bleue professionnelle plus large
- **Logo intégré** (placeholder actuellement, configurable)
- **Sections structurées** avec icônes colorées
- **Cadres arrondis** pour les informations importantes
- **Tableaux alternés** pour les détails du service et options
- **Calculs de prix détaillés** avec TVA et sous-totaux
- **Mise en évidence du prix** avec couleur d'accent
- **Pied de page** avec informations de contact complètes

### Palette de couleurs
- **Bleu principal** : #2980b9 (professionnel)
- **Gris foncé** : #34495e (texte)
- **Rouge accent** : #e74c3c (prix)
- **Gris clair** : #ecf0f1 (arrière-plans)
- **Vert succès** : #2ecc71 (pour les éléments positifs)

### Sections du PDF améliorées
1. **En-tête** : Logo, titre "DEVIS", numéro de devis
2. **Informations entreprise** : Nom, adresse, contacts
3. **Dates importantes** : Création et validité détaillées
4. **Client** : Informations complètes
5. **Service** : Tableau détaillé avec alternance de couleurs
6. **Options** : Tableau avec prix individuels
7. **Prix** : Calculs détaillés avec TVA et sous-totaux
8. **Modalités de paiement** : Acompte, solde, moyens de paiement
9. **Garanties** : Satisfaction, assurance, personnel qualifié
10. **Conditions** : Termes et conditions étendues
11. **Accord et signature** : Zones de signature client et entreprise
12. **Mentions légales** : SIRET, TVA, assurance, RGPD
13. **Pied de page** : Contact et site web 