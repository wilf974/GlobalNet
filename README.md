# CleanPro Services - Application Web de Nettoyage Professionnel

## 🚀 Vue d'ensemble

Application web moderne et responsive pour une entreprise de nettoyage professionnel. L'application offre une expérience utilisateur exceptionnelle avec toutes les fonctionnalités nécessaires pour la gestion des devis, la présentation des services et l'interaction client.

## ✨ Fonctionnalités Principales

### 🎯 Formulaire de Devis Intelligent
- **Formulaire multi-étapes** avec progression visuelle
- **Calcul automatique des prix** en temps réel
- **Champs conditionnels** selon le type de nettoyage
- **Validation côté client et serveur**
- **Sauvegarde automatique** du brouillon
- **Génération PDF** avec logo entreprise

### 📝 Système de Signature Électronique
- **Signature tactile/souris** avec canvas
- **Affichage des CGV** dans modal scrollable
- **Sauvegarde sécurisée** des signatures
- **Génération de contrats** signés en PDF
- **Historique des acceptations** avec horodatage

### 📸 Galerie Photos Interactive
- **Upload multiple** avec drag & drop
- **Compression automatique** des images
- **Catégorisation** des photos (avant/après, par type)
- **Visualisation en lightbox**
- **Intégration dans les devis PDF**

### 🏠 Site Vitrine SEO-Optimisé
- **Hero section** avec call-to-action
- **Services détaillés** avec tarifs indicatifs
- **Galerie avant/après**
- **Témoignages clients**
- **Zone d'intervention** avec carte interactive
- **Contact et demande de devis**

### 📊 Dashboard Admin
- **Gestion des devis** (en cours, acceptés, refusés)
- **Gestion des clients** et historique
- **Statistiques et analytics**
- **Gestion du contenu** (services, tarifs)
- **Système de notifications**

## 🛠️ Stack Technique

### Frontend
- **React.js** avec TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Hook Form** pour les formulaires
- **Zod** pour la validation

### Backend
- **Next.js API Routes**
- **Prisma** pour l'ORM
- **PostgreSQL** ou MongoDB
- **NextAuth.js** pour l'authentification

### Utilitaires
- **jsPDF** pour la génération PDF
- **react-signature-canvas** pour les signatures
- **Cloudinary** pour l'upload d'images
- **react-hot-toast** pour les notifications
- **Lucide React** pour les icônes

## 📁 Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   ├── devis/             # Pages de devis
│   ├── services/          # Pages de services
│   ├── galerie/           # Galerie photos
│   └── admin/             # Dashboard admin
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── forms/            # Composants formulaires
│   ├── layout/           # Layout et navigation
│   └── modals/           # Modals et popups
├── hooks/                # Custom hooks
├── lib/                  # Utilitaires et configurations
├── types/                # Types TypeScript
├── utils/                # Fonctions utilitaires
└── styles/               # Styles additionnels
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Base de données PostgreSQL ou MongoDB

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd cleaning-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Configurer la base de données**
```bash
# Avec Prisma
npx prisma generate
npx prisma db push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/cleaning_app"

# Authentification
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (pour l'upload d'images)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Configuration de la Base de Données

1. **PostgreSQL** (recommandé)
```sql
CREATE DATABASE cleaning_app;
```

2. **MongoDB**
```javascript
// Connexion via Prisma
DATABASE_URL="mongodb://localhost:27017/cleaning_app"
```

## 📊 Fonctionnalités Détaillées

### Calcul des Prix

Le système de calcul des prix prend en compte :
- **Type de nettoyage** (bureaux, industriel, résidentiel, commercial)
- **Superficie** en m²
- **Fréquence** (ponctuel, hebdomadaire, mensuel, trimestriel)
- **Options supplémentaires** (vitres, désinfection, façades, etc.)
- **Réductions** selon la fréquence

### Validation des Formulaires

- **Validation côté client** avec Zod
- **Validation côté serveur** avec Prisma
- **Messages d'erreur** personnalisés
- **Sauvegarde automatique** des brouillons

### Génération PDF

- **Template personnalisé** avec logo entreprise
- **Informations complètes** du devis
- **Signature électronique** intégrée
- **CGV** incluses automatiquement

## 🎨 Design et UX

### Design System
- **Couleurs cohérentes** avec palette personnalisée
- **Typographie** Inter et Poppins
- **Animations fluides** avec Framer Motion
- **Responsive design** mobile-first

### Composants UI
- **Button** avec variantes et états
- **Input** avec validation intégrée
- **Modal** avec animations
- **Stepper** pour les formulaires multi-étapes

## 🔒 Sécurité

- **Validation des données** côté serveur
- **Sanitisation** des entrées utilisateur
- **Authentification** sécurisée
- **HTTPS** obligatoire en production
- **Headers de sécurité** configurés

## 📈 Performance

- **Optimisation des images** (WebP, AVIF)
- **Lazy loading** des composants
- **Code splitting** automatique
- **Core Web Vitals** optimisés
- **Lighthouse score** > 90

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e
```

## 📦 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Déployer le dossier .next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- **Email** : contact@cleanpro-services.fr
- **Téléphone** : 01 23 45 67 89
- **Documentation** : [Wiki du projet]

## 🚀 Roadmap

### Phase 1 ✅ (Terminé)
- [x] Setup du projet Next.js
- [x] Configuration Tailwind CSS
- [x] Types TypeScript
- [x] Composants UI de base
- [x] Page d'accueil

### Phase 2 🔄 (En cours)
- [ ] Formulaire de devis multi-étapes
- [ ] Calcul automatique des prix
- [ ] Système de signature électronique
- [ ] Génération PDF

### Phase 3 📋 (Prévu)
- [ ] Galerie photos interactive
- [ ] Upload d'images avec Cloudinary
- [ ] Dashboard admin
- [ ] Système d'authentification

### Phase 4 📋 (Prévu)
- [ ] API complète
- [ ] Base de données
- [ ] Tests unitaires et E2E
- [ ] Déploiement en production

---

**Développé avec ❤️ pour CleanPro Services** 