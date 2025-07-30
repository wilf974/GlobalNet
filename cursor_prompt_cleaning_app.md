# Prompt pour Cursor - Application Web Complète pour Entreprise de Nettoyage

## Contexte du Projet
Je veux développer une application web moderne et responsive pour une entreprise de nettoyage professionnel. L'application doit offrir une expérience utilisateur exceptionnelle et inclure toutes les fonctionnalités nécessaires pour la gestion des devis, la présentation des services et l'interaction client.

## Stack Technique Recommandée
- **Frontend**: React.js avec TypeScript pour une meilleure maintenabilité
- **Styling**: Tailwind CSS pour un design moderne et responsive
- **Backend**: Node.js avec Express ou Next.js (full-stack)
- **Base de données**: PostgreSQL ou MongoDB
- **Authentification**: JWT ou NextAuth.js
- **Génération PDF**: jsPDF ou Puppeteer
- **Signature électronique**: react-signature-canvas
- **Upload d'images**: Cloudinary ou AWS S3
- **Déploiement**: Vercel ou Netlify

## Fonctionnalités Requises

### 1. Formulaire de Devis Intelligent
**Objectif**: Créer un formulaire multi-étapes avec calcul automatique des prix

**Fonctionnalités détaillées**:
- Formulaire progressif avec étapes visuelles (stepper)
- Champs conditionnels selon le type de nettoyage
- Calcul en temps réel du prix total
- Validation côté client et serveur
- Sauvegarde automatique du brouillon
- Génération et téléchargement PDF avec logo entreprise

**Structure des données**:
```typescript
interface DevisData {
  clientInfo: {
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
  };
  serviceDetails: {
    typeNettoyage: 'bureaux' | 'industriel' | 'residentiel';
    superficie: number;
    frequence: 'ponctuel' | 'hebdomadaire' | 'mensuel';
    dateIntervention: Date;
  };
  optionsSupplementaires: {
    nettoyageVitres: boolean;
    desinfection: boolean;
    nettoyageFacades: boolean;
    nettoyageParking: boolean;
  };
  prixTotal: number;
}
```

### 2. Système de Signature Électronique et CGV
**Objectif**: Intégrer un système légal de validation des devis

**Fonctionnalités**:
- Affichage des CGV dans une modal scrollable
- Signature électronique tactile/souris
- Sauvegarde sécurisée des signatures
- Génération d'un contrat signé en PDF
- Historique des acceptations avec horodatage

### 3. Galerie Photos Interactive
**Objectif**: Permettre l'upload et la gestion d'images pour évaluation

**Fonctionnalités**:
- Upload multiple avec drag & drop
- Compression automatique des images
- Catégorisation des photos (avant/après, par type de service)
- Visualisation en lightbox
- Intégration dans les devis PDF

### 4. Page de Présentation et Promotion
**Objectif**: Site vitrine SEO-optimisé avec présentation des services

**Sections requises**:
- Hero section avec call-to-action
- Services détaillés avec tarifs indicatifs
- Galerie avant/après
- Témoignages clients
- Zone d'intervention avec carte interactive
- Contact et demande de devis

**Optimisation SEO**:
- Meta tags dynamiques
- Schema.org markup pour les services
- Sitemap XML automatique
- Optimisation des images (WebP)
- Core Web Vitals optimisés

### 5. Dashboard Admin
**Objectif**: Interface de gestion pour l'entreprise

**Fonctionnalités**:
- Gestion des devis (en cours, acceptés, refusés)
- Gestion des clients et historique
- Statistiques et analytics
- Gestion du contenu (services, tarifs)
- Système de notifications

## Structure de l'Application

```
src/
├── components/
│   ├── ui/              # Composants UI réutilisables
│   ├── forms/           # Composants formulaires
│   ├── layout/          # Layout et navigation
│   └── modals/          # Modals et popups
├── pages/
│   ├── index.tsx        # Page d'accueil
│   ├── services.tsx     # Page services
│   ├── devis.tsx        # Formulaire de devis
│   ├── galerie.tsx      # Galerie photos
│   └── admin/           # Pages admin
├── hooks/               # Custom hooks
├── utils/               # Utilitaires
├── types/               # Types TypeScript
├── styles/              # Styles globaux
└── api/                 # Routes API
```

## Exemples de Code Clés

### 1. Hook pour le Calcul de Prix
```typescript
const useDevisCalculator = () => {
  const [devis, setDevis] = useState<DevisData>();
  
  const calculatePrice = useCallback((data: DevisData) => {
    // Logique de calcul basée sur les tarifs
    let basePrice = data.superficie * getTarifByType(data.typeNettoyage);
    
    // Ajout des options
    if (data.optionsSupplementaires.nettoyageVitres) {
      basePrice += data.superficie * 0.5;
    }
    
    return basePrice;
  }, []);
  
  return { calculatePrice };
};
```

### 2. Composant Signature
```typescript
const SignatureCanvas: React.FC = () => {
  const sigRef = useRef<SignatureCanvas>(null);
  
  const handleSave = () => {
    const signature = sigRef.current?.toDataURL();
    // Sauvegarde en base
  };
  
  return (
    <div className="signature-container">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          className: "signature-canvas"
        }}
      />
    </div>
  );
};
```

## Instructions de Développement

### Phase 1: Setup et Architecture
1. Initialiser le projet avec Next.js et TypeScript
2. Configurer Tailwind CSS et les composants UI
3. Mettre en place la structure de base de données
4. Créer les types TypeScript

### Phase 2: Formulaire de Devis
1. Développer le formulaire multi-étapes
2. Implémenter la logique de calcul des prix
3. Intégrer la génération PDF
4. Ajouter la validation et les tests

### Phase 3: Système de Signature
1. Intégrer react-signature-canvas
2. Créer la modal CGV
3. Développer la sauvegarde sécurisée
4. Tester la génération de contrats

### Phase 4: Galerie et Upload
1. Implémenter l'upload d'images
2. Créer le système de compression
3. Développer la galerie interactive
4. Intégrer dans les devis

### Phase 5: Site Vitrine
1. Créer les pages de présentation
2. Optimiser pour le SEO
3. Intégrer les analytics
4. Tester les performances

### Phase 6: Dashboard Admin
1. Développer l'interface admin
2. Créer les statistiques
3. Implémenter les notifications
4. Ajouter la gestion de contenu

## Critères de Qualité
- **Performance**: Lighthouse score > 90
- **Accessibilité**: Conformité WCAG 2.1
- **Sécurité**: Validation côté serveur, sanitisation des données
- **Mobile-first**: Design responsive parfait
- **SEO**: Optimisation complète pour les moteurs de recherche

## Livrables Attendus
1. Application web complète et fonctionnelle
2. Documentation technique détaillée
3. Guide d'utilisation pour l'admin
4. Tests unitaires et d'intégration
5. Déploiement en production

Peux-tu m'aider à développer cette application étape par étape en commençant par la structure de base et le setup du projet ?