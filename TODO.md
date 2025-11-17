# TODO - Refonte Multi-Tenant SaaS GlobalNet

**Date de création:** 2025-11-03
**Durée estimée:** 2-3 mois
**Dernière mise à jour:** 2025-11-17
**Objectif:** Transformer GlobalNet en plateforme SaaS multi-tenant scalable avec IA, temps réel, et fonctionnalités avancées

---

## 🚀 Démarrage Rapide - Checklist Initiale

### Prérequis Système
- [ ] Node.js 18+ installé (`node -v`)
- [ ] npm 9+ installé (`npm -v`)
- [ ] PostgreSQL 14+ (local ou cloud)
- [ ] Git configuré (`git config --list`)
- [ ] Editor/IDE configuré (VSCode + Prettier + ESLint)

### Configuration Initiale du Projet
- [ ] Installer dépendances: `npm install`
- [ ] Initialiser Prisma: `npx prisma init` (si non fait)
- [ ] Créer `.env.local` à partir de `.env.example`
- [ ] Configurer `DATABASE_URL` pour PostgreSQL
- [ ] Créer la base de données: `createdb cleaning_app`
- [ ] Générer client Prisma: `npx prisma generate`
- [ ] Lancer migrations: `npx prisma migrate dev --name init`
- [ ] Tester le serveur dev: `npm run dev`

### Configuration Git Branches
- [ ] Feature branch utilisée: `claude/create-project-todo-011gWtrErv5zvCqR9BEA4CX1`
- [ ] Commits avec messages clairs et atomiques
- [ ] Push après chaque milestone complété

---

## 📊 Vue d'ensemble

### Progression Globale
- [ ] Phase 0: Prérequis & Setup (1 semaine) ⏳
- [ ] Phase 1: Migration Base de Données (3 semaines)
- [ ] Phase 2: Authentification & Multi-Tenant (2 semaines)
- [ ] Phase 3: Intégration IA (2 semaines)
- [ ] Phase 4: Temps Réel WebSocket (1 semaine)
- [ ] Phase 5: Progressive Web App (1 semaine)
- [ ] Phase 6: Système de Paiement (1 semaine)
- [ ] Phase 7: Fonctionnalités Avancées (2 semaines)
- [ ] Phase 8: i18n & Accessibilité (1 semaine)
- [ ] Phase 9: Analytics & Monitoring (1 semaine)
- [ ] Phase 10: API & Intégrations (1 semaine)
- [ ] Phase 11: Mobile & Tests (2 semaines)
- [ ] Phase 12: Déploiement & Documentation (1 semaine)

---

## 🏗️ Architecture & Décisions Techniques

### Décisions Clés
1. **Multi-Tenant Strategy**: Row-Level Tenant Isolation via `organizationId`
2. **Auth**: NextAuth.js + JWT + OAuth Google
3. **API**: REST + Future GraphQL
4. **Real-time**: Pusher (vs Socket.io)
5. **File Storage**: Vercel Blob / Cloudinary
6. **Payments**: Stripe (vs Paddle)
7. **Email**: Resend / SendGrid
8. **Monitoring**: Sentry + Vercel Analytics
9. **Deployment**: Vercel (vs Railway/Render)

### Database Schema Principles
- Toujours vérifier `organizationId` dans les queries
- Soft delete pour audit trail
- Timestamps (createdAt, updatedAt) obligatoires
- Indexes sur `organizationId`, `userId`, statuts
- Relations explicites avec cascade rules

---

## 🔧 Scripts NPM à Ajouter

Ajouter à `package.json`:
```json
{
  "scripts": {
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "type-check": "tsc --noEmit",
    "lint:fix": "eslint src --fix",
    "test:all": "npm run type-check && npm run lint && npm run test",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\"",
    "dev:monitor": "npm run dev & npm run db:studio"
  }
}
```

---

## 📋 Blockers & Problèmes Connus

| Problème | Impact | Solution |
|----------|--------|----------|
| Prisma non initialisé | BLOQUANT | Initialiser prisma avec `npx prisma init` |
| .env.local manquant | BLOQUANT | Créer fichier avec DATABASE_URL |
| NextAuth pas configuré | Phase 2 | Sera fait dans Phase 2 |
| Pas de tests E2E | Important | Playwright à ajouter Phase 11 |

---

## Phase 0: Prérequis & Initialisation (ACTUEL)

**Durée:** 1-2 jours
**Priorité:** CRITIQUE
**Status:** 🔴 EN COURS

### 0.1 Initialisation Prisma et Schéma

- [x] Prisma client déjà installé (@prisma/client ^5.6.0)
- [ ] Exécuter `npx prisma init`
- [ ] Vérifier fichiers créés:
  - [ ] `prisma/schema.prisma`
  - [ ] `.env` avec DATABASE_URL
- [ ] Créer `.env.local` si nécessaire:
  ```env
  DATABASE_URL="postgresql://user:password@localhost:5432/cleaning_app"
  NEXTAUTH_SECRET="your-secret-key-here"
  NEXTAUTH_URL="http://localhost:3000"
  ```
- [ ] Configurer PostgreSQL (local ou cloud):
  - [ ] Créer DB `cleaning_app`
  - [ ] Vérifier connection string
  - [ ] Tester connexion: `psql $DATABASE_URL -c "SELECT 1"`

### 0.2 Scripts NPM & Configuration

- [ ] Mettre à jour `package.json` avec scripts db
- [ ] Vérifier TypeScript config (`tsconfig.json`)
- [ ] Vérifier ESLint config
- [ ] Ajouter fichier `.prettierrc` (optionnel)

### ✅ Critères Validation Phase 0
- [ ] `npx prisma generate` sans erreur
- [ ] Connexion DB testée
- [ ] `.env.local` configuré correctement

---

## Phase 1: Migration Base de Données & Architecture Multi-Tenant

**Durée:** 3 semaines  
**Priorité:** CRITIQUE  
**Dépendances:** Aucune

### 1.1 Configuration Prisma + PostgreSQL

- [ ] Installer les dépendances Prisma
  ```bash
  npm install @prisma/client @prisma/extension-accelerate
  npm install -D prisma
  ```
- [ ] Initialiser Prisma
  ```bash
  npx prisma init
  ```
- [ ] Créer le schéma Prisma dans `prisma/schema.prisma`
  - [ ] Modèle `Organization` (id, name, slug, logo, branding, createdAt, updatedAt)
  - [ ] Modèle `User` (id, email, password, name, role, organizationId, createdAt)
  - [ ] Modèle `Client` (id, organizationId, name, email, phone, address, status, notes)
  - [ ] Modèle `Devis` (id, organizationId, clientId, services, amount, status, dates)
  - [ ] Modèle `Facture` (id, organizationId, devisId, clientId, amount, status, dueDate)
  - [ ] Modèle `Subscription` (id, organizationId, plan, status, currentPeriodEnd)
  - [ ] Modèle `AuditLog` (id, organizationId, userId, action, metadata)
- [ ] Ajouter les index de performance sur `organizationId`
- [ ] Configurer les relations entre modèles
- [ ] Créer les variables d'environnement
  - [ ] `DATABASE_URL` dans `.env`
  - [ ] `DIRECT_URL` pour Prisma Migrate
- [ ] Générer le client Prisma
  ```bash
  npx prisma generate
  ```
- [ ] Créer la migration initiale
  ```bash
  npx prisma migrate dev --name init
  ```

### 1.2 Migration des Données JSON vers PostgreSQL

- [ ] Créer le dossier `scripts/` si inexistant
- [ ] Créer `scripts/migrate-json-to-db.ts`
  - [ ] Fonction pour lire `data/clients.json`
  - [ ] Fonction pour lire `data/devis.json`
  - [ ] Fonction pour lire `data/factures.json`
  - [ ] Validation des données avec Zod
  - [ ] Nettoyage des données (dates, formats)
  - [ ] Insertion batch dans PostgreSQL
  - [ ] Gestion des erreurs et logs
- [ ] Tester la migration sur données de développement
- [ ] Créer backup des fichiers JSON avant migration
- [ ] Exécuter la migration complète
- [ ] Vérifier l'intégrité des données migrées
- [ ] Créer `prisma/seed.ts` pour données de test
  - [ ] 3 organisations de test
  - [ ] 10 clients par organisation
  - [ ] 20 devis par organisation
  - [ ] 5 factures par organisation
- [ ] Ajouter script seed dans `package.json`
- [ ] Tester le seed
  ```bash
  npx prisma db seed
  ```

### 1.3 Refactorisation API Routes

- [ ] Créer `src/lib/prisma.ts` (singleton client)
- [ ] Créer middleware d'isolation tenant `src/lib/tenant-middleware.ts`
- [ ] Refactoriser `/api/clients/route.ts`
  - [ ] GET avec pagination cursor-based
  - [ ] POST avec isolation organizationId
  - [ ] Ajouter filtres de recherche
- [ ] Refactoriser `/api/clients/[id]/route.ts`
  - [ ] GET avec vérification organisation
  - [ ] PUT avec validation
  - [ ] DELETE avec cascade soft delete
- [ ] Refactoriser `/api/devis/route.ts`
  - [ ] GET avec relations (client, facture)
  - [ ] POST avec calculs automatiques
  - [ ] Filtres par statut, date, client
- [ ] Refactoriser `/api/devis/[id]/route.ts`
  - [ ] GET avec toutes les relations
  - [ ] PUT avec gestion workflow
  - [ ] DELETE avec vérification permissions
- [ ] Refactoriser `/api/factures/route.ts`
  - [ ] GET avec pagination
  - [ ] POST depuis devis approuvé
  - [ ] Calculs TVA et totaux
- [ ] Ajouter validation Zod dans toutes les routes
- [ ] Implémenter gestion d'erreurs uniforme
- [ ] Ajouter logs de requêtes (sans données sensibles)
- [ ] Tester toutes les routes avec Postman/Insomnia

### 1.4 Système Multi-Tenant

- [ ] Créer `middleware.ts` à la racine
  - [ ] Détecter organisation depuis sous-domaine
  - [ ] Détecter organisation depuis path `/org/[slug]`
  - [ ] Stocker organizationId dans headers
- [ ] Créer `src/contexts/OrganizationContext.tsx`
- [ ] Créer hook `src/hooks/useOrganization.ts`
- [ ] Créer composant `<OrganizationProvider>`
- [ ] Implémenter isolation complète des données
  - [ ] Vérifier organizationId dans chaque query
  - [ ] Middleware Prisma pour injection auto organizationId
- [ ] Créer organisations de test via seed
- [ ] Tester isolation entre organisations
  - [ ] User org A ne peut pas voir données org B
  - [ ] Requêtes filtrées correctement
- [ ] Documenter architecture multi-tenant

### ✅ Critères de Validation Phase 1
- [ ] Migration réussie de toutes les données JSON
- [ ] 0 erreur dans les tests API
- [ ] Isolation multi-tenant testée et validée
- [ ] Performance < 100ms pour requêtes simples
- [ ] Documentation technique complète

---

## Phase 2: Authentification & Gestion Multi-Tenant

**Durée:** 2 semaines  
**Priorité:** CRITIQUE  
**Dépendances:** Phase 1

### 2.1 NextAuth.js avec Support Multi-Tenant

- [ ] Installer NextAuth.js
  ```bash
  npm install next-auth @next-auth/prisma-adapter
  ```
- [ ] Créer `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Configurer Prisma adapter
- [ ] Ajouter modèles NextAuth dans schema Prisma
  - [ ] Account, Session, VerificationToken
  - [ ] Relations avec User
- [ ] Migrer la base de données
- [ ] Configurer provider Email/Password
  - [ ] Hashing bcrypt
  - [ ] Validation email
- [ ] Configurer Google OAuth
  - [ ] Créer app Google Cloud Console
  - [ ] Variables `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [ ] Configurer Microsoft OAuth (optionnel)
- [ ] Enrichir session avec `organizationId`, `role`
- [ ] Créer callbacks personnalisés
- [ ] Créer pages custom
  - [ ] `/auth/signin`
  - [ ] `/auth/signup`
  - [ ] `/auth/error`
  - [ ] `/auth/verify-email`
- [ ] Implémenter verification email
- [ ] Tester tous les flows d'authentification

### 2.2 Gestion des Organisations

- [ ] Créer page `/dashboard/organization/settings`
- [ ] Créer composants d'édition organisation
  - [ ] `<OrganizationForm>` - infos générales
  - [ ] `<BrandingSettings>` - logo, couleurs
  - [ ] `<DomainSettings>` - domaine custom
- [ ] API routes organisation
  - [ ] GET `/api/organization`
  - [ ] PUT `/api/organization`
  - [ ] POST `/api/organization/upload-logo` (Vercel Blob)
- [ ] Gestion des membres
  - [ ] Table `OrganizationMember` dans Prisma
  - [ ] Page `/dashboard/organization/members`
  - [ ] Composant `<MemberList>`
  - [ ] Composant `<InviteMember>`
- [ ] Système d'invitation
  - [ ] API POST `/api/organization/invite`
  - [ ] Génération token unique
  - [ ] Email d'invitation avec lien
  - [ ] Page `/auth/accept-invite/[token]`
  - [ ] Expiration invitation après 7 jours
- [ ] Tester workflow complet d'invitation

### 2.3 Système de Rôles et Permissions (RBAC)

- [ ] Définir enum `Role` dans Prisma
  - [ ] OWNER, ADMIN, MANAGER, USER, VIEWER
- [ ] Créer `src/lib/permissions.ts`
  - [ ] Définir permissions par rôle
  - [ ] Fonction `hasPermission(user, permission)`
- [ ] Créer middleware `requirePermission()`
- [ ] Créer HOC `withPermission(Component, permission)`
- [ ] Créer composant `<Restricted permission="...">`
- [ ] Implémenter dans toutes les pages sensibles
- [ ] Modèle `AuditLog` pour tracer actions
- [ ] API POST `/api/audit` pour logging
- [ ] Page `/dashboard/audit` pour admins
- [ ] Tester matrice de permissions complète

### ✅ Critères de Validation Phase 2
- [ ] Authentification fonctionnelle (email + OAuth)
- [ ] Multi-tenant avec isolation parfaite
- [ ] RBAC testé pour tous les rôles
- [ ] Invitations testées et validées
- [ ] Audit log opérationnel

---

## Phase 3: Intégration IA & Automation

**Durée:** 2 semaines  
**Priorité:** HAUTE  
**Dépendances:** Phase 1

### 3.1 Assistant IA avec OpenAI

- [ ] Installer SDK OpenAI
  ```bash
  npm install openai ai
  ```
- [ ] Configurer `OPENAI_API_KEY` dans `.env`
- [ ] Créer `src/lib/openai.ts` (client singleton)
- [ ] Endpoint `/api/ai/suggest-price`
  - [ ] Analyser historique devis similaires
  - [ ] Prompt engineering pour estimation
  - [ ] Retourner fourchette de prix + justification
- [ ] Endpoint `/api/ai/generate-description`
  - [ ] Input: type service, contexte
  - [ ] Output: description marketing optimisée
- [ ] Endpoint `/api/ai/chat`
  - [ ] Streaming SSE avec Vercel AI SDK
  - [ ] Context: FAQ, documentation
  - [ ] Historique conversation
- [ ] Composant `<AIChat>` avec UI moderne
- [ ] Intégrer chatbot dans dashboard
- [ ] Tester précision des suggestions

### 3.2 Analyse Prédictive

- [ ] Créer `/api/analytics/predictions`
- [ ] Implémenter régression linéaire simple
  - [ ] Prédiction CA mensuel
  - [ ] Tendances par service
- [ ] Identifier clients à risque de churn
  - [ ] Inactivité > 3 mois
  - [ ] Baisse engagement
- [ ] Recommandations services par client
  - [ ] Basé sur historique
  - [ ] Services complémentaires
- [ ] Dashboard widget prédictions
  - [ ] Graphique prévisions CA
  - [ ] Liste clients à risque
  - [ ] Opportunités upsell
- [ ] Tester fiabilité prédictions

### 3.3 Auto-génération de Contenu

- [ ] Améliorer génération PDF avec résumés IA
  - [ ] Résumé exécutif automatique
  - [ ] Highlights personnalisés
- [ ] Suggestions amélioration devis
  - [ ] Analyser devis perdus
  - [ ] Proposer optimisations
- [ ] Templates emails personnalisés
  - [ ] Relance client avec contexte
  - [ ] Proposition commerciale sur mesure
- [ ] Tester qualité contenu généré

### ✅ Critères de Validation Phase 3
- [ ] IA suggère prix avec justification pertinente
- [ ] Chatbot répond correctement aux questions
- [ ] Prédictions CA dans marge ±15%
- [ ] Contenu généré de qualité professionnelle

---

## Phase 4: Temps Réel avec WebSocket

**Durée:** 1 semaine  
**Priorité:** MOYENNE  
**Dépendances:** Phase 2

### 4.1 Configuration Pusher

- [ ] Créer compte Pusher
- [ ] Installer SDK
  ```bash
  npm install pusher pusher-js
  ```
- [ ] Variables d'environnement Pusher
- [ ] Créer `src/lib/pusher-server.ts`
- [ ] Créer `src/lib/pusher-client.ts`
- [ ] Configurer channels par organisation

### 4.2 Notifications en Temps Réel

- [ ] Créer hook `useRealtimeNotifications()`
- [ ] Événements à tracker
  - [ ] `devis.created`
  - [ ] `devis.updated`
  - [ ] `facture.paid`
  - [ ] `message.received`
- [ ] Composant `<RealtimeToast>`
- [ ] Badge compteur dans navigation
- [ ] Marquer notifications comme lues
- [ ] Système de présence (qui est en ligne)

### 4.3 Collaboration Multi-Utilisateurs

- [ ] Editing locks dans Prisma
  - [ ] Champ `lockedBy`, `lockedAt`
- [ ] API `/api/lock/[resource]/[id]`
- [ ] Indicateur "X édite ce devis"
- [ ] Libération lock automatique après 5min
- [ ] Synchronisation changements en temps réel

### ✅ Critères de Validation Phase 4
- [ ] Notifications instantanées < 100ms
- [ ] Locks fonctionnent sans conflit
- [ ] Présence utilisateur affichée
- [ ] 0 perte de message

---

## Phase 5: Progressive Web App (PWA)

**Durée:** 1 semaine  
**Priorité:** MOYENNE

### 5.1 Configuration PWA

- [ ] Installer next-pwa
  ```bash
  npm install @ducanh2912/next-pwa
  ```
- [ ] Configurer dans `next.config.js`
- [ ] Créer `public/manifest.json`
- [ ] Générer icons toutes tailles
  ```bash
  npx pwa-asset-generator logo.png public/icons
  ```
- [ ] Service Worker pour cache
- [ ] Tester installation sur mobile

### 5.2 Mode Offline

- [ ] Installer idb pour IndexedDB
  ```bash
  npm install idb
  ```
- [ ] Hook `useOnlineStatus()`
- [ ] Cache données critiques en IndexedDB
- [ ] Queue actions offline avec `bg-sync`
- [ ] UI adaptée mode offline
- [ ] Sync automatique au retour online
- [ ] Tester scénario offline complet

### 5.3 Push Notifications

- [ ] Configurer Web Push API
- [ ] Demander permission utilisateur
- [ ] Stocker subscription dans BDD
- [ ] Envoyer notification depuis serveur
- [ ] Tester notifications app fermée

### ✅ Critères de Validation Phase 5
- [ ] App installable sur iOS et Android
- [ ] Fonctionne offline pour consultation
- [ ] Actions offline synchronisées au retour online
- [ ] Push notifications reçues

---

## Phase 6: Système de Paiement

**Durée:** 1 semaine  
**Priorité:** HAUTE  
**Dépendances:** Phase 2

### 6.1 Intégration Stripe

- [ ] Créer compte Stripe
- [ ] Installer SDK
  ```bash
  npm install @stripe/stripe-js stripe
  ```
- [ ] Variables `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- [ ] Créer produits et prix dans Stripe Dashboard
  - [ ] Plan Starter (29€/mois)
  - [ ] Plan Pro (99€/mois)
  - [ ] Plan Enterprise (299€/mois)
- [ ] Webhook `/api/webhooks/stripe`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
- [ ] Sécuriser webhook avec signature

### 6.2 Gestion Abonnements

- [ ] Page `/dashboard/billing`
  - [ ] Affichage plan actuel
  - [ ] Bouton upgrade/downgrade
  - [ ] Historique factures
- [ ] Composant `<PricingTable>`
- [ ] API `/api/billing/create-checkout-session`
- [ ] API `/api/billing/create-portal-session`
- [ ] Gérer prorata upgrade/downgrade
- [ ] Limites par plan
  - [ ] Nombre devis/mois
  - [ ] Nombre utilisateurs
  - [ ] Fonctionnalités disponibles
- [ ] Bloquer actions si limite atteinte

### 6.3 Paiements Devis Clients

- [ ] Stripe Checkout pour devis
- [ ] Lien paiement dans email devis
- [ ] Webhook mise à jour statut → payé
- [ ] Génération facture automatique
- [ ] Email reçu paiement au client
- [ ] Tester flow complet paiement

### ✅ Critères de Validation Phase 6
- [ ] Abonnements fonctionnels
- [ ] Webhooks fiables
- [ ] Paiements devis testés
- [ ] Factures générées automatiquement

---

## Phase 7: Fonctionnalités Avancées

**Durée:** 2 semaines  
**Priorité:** MOYENNE  
**Dépendances:** Phase 1, Phase 6

### 7.1 E-Signatures Légales

- [ ] Compte HelloSign (Dropbox Sign)
- [ ] Installer SDK
  ```bash
  npm install hellosign-sdk
  ```
- [ ] Workflow signature
  - [ ] Créer demande signature
  - [ ] Envoyer au client par email
  - [ ] Webhook signature complétée
  - [ ] Stocker certificat légal
- [ ] Archivage conforme
- [ ] Tester validité juridique

### 7.2 Calendrier & Planification

- [ ] Installer FullCalendar
  ```bash
  npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
  ```
- [ ] Page `/dashboard/planning`
- [ ] Modèle `Intervention` dans Prisma
- [ ] Drag & drop planification
- [ ] Sync Google Calendar
  - [ ] OAuth Google Calendar
  - [ ] Sync bidirectionnelle
- [ ] Notifications rappel (email + push)
- [ ] Vue équipe avec disponibilités

### 7.3 Module Facturation Avancé

- [ ] Factures récurrentes
  - [ ] Modèle `RecurringInvoice`
  - [ ] Cron job génération automatique
- [ ] Relances automatiques impayés
  - [ ] J+7, J+15, J+30
  - [ ] Email escalation
- [ ] Export comptable
  - [ ] Format FEC (norme française)
  - [ ] Export CSV pour expert-comptable
- [ ] Statistiques TVA et CA détaillées
- [ ] Tester conformité comptable

### 7.4 Géolocalisation & Optimisation

- [ ] API Google Maps
- [ ] Geocoding adresses clients
- [ ] Calcul zones d'intervention
- [ ] Optimisation de tournées (TSP)
- [ ] Tracking techniciens (optionnel)
- [ ] Carte interactive dashboard

### ✅ Critères de Validation Phase 7
- [ ] Signatures électroniques légalement valides
- [ ] Calendrier synchronisé sans perte
- [ ] Factures récurrentes générées automatiquement
- [ ] Tournées optimisées (gain temps >20%)

---

## Phase 8: Internationalisation & Accessibilité

**Durée:** 1 semaine  
**Priorité:** MOYENNE

### 8.1 i18n avec next-intl

- [ ] Installer next-intl
  ```bash
  npm install next-intl
  ```
- [ ] Configurer routing i18n
- [ ] Créer fichiers traduction
  - [ ] `locales/fr.json`
  - [ ] `locales/en.json`
  - [ ] `locales/es.json`
- [ ] Traduire toutes les chaînes UI
- [ ] Composant `<LanguageSwitcher>`
- [ ] Formatage dates/nombres par locale
- [ ] Support multi-devises
  - [ ] API taux de change
  - [ ] Conversion automatique
- [ ] Tester toutes les langues

### 8.2 Accessibilité WCAG 2.1 AAA

- [ ] Audit Lighthouse accessibilité
- [ ] Audit axe DevTools
- [ ] Corriger tous les problèmes détectés
- [ ] Navigation clavier complète
  - [ ] Tab order logique
  - [ ] Focus visible
  - [ ] Shortcuts clavier
- [ ] Screen reader testing
  - [ ] NVDA (Windows)
  - [ ] JAWS (Windows)
  - [ ] VoiceOver (macOS/iOS)
- [ ] Contrastes couleurs AAA
  - [ ] Ratio 7:1 texte normal
  - [ ] Ratio 4.5:1 texte large
- [ ] Textes alternatifs toutes images
- [ ] ARIA labels appropriés
- [ ] Skip links navigation
- [ ] Tester avec utilisateurs malvoyants

### ✅ Critères de Validation Phase 8
- [ ] Score accessibilité Lighthouse 100/100
- [ ] 3 langues complètement traduites
- [ ] Utilisable 100% au clavier
- [ ] Screen readers fonctionnent parfaitement

---

## Phase 9: Analytics & Monitoring

**Durée:** 1 semaine  
**Priorité:** HAUTE  
**Dépendances:** Phase 1

### 9.1 Analytics Avancées

- [ ] Installer Vercel Analytics
  ```bash
  npm install @vercel/analytics @vercel/speed-insights
  ```
- [ ] Dashboard custom `/dashboard/analytics`
- [ ] Tracking événements métier
  - [ ] `devis_created`
  - [ ] `devis_converted`
  - [ ] `facture_paid`
  - [ ] `user_signup`
- [ ] Funnel de conversion
  - [ ] Visualisation graphique
  - [ ] Taux à chaque étape
- [ ] Export rapports
  - [ ] Excel
  - [ ] PDF
  - [ ] CSV
- [ ] KPIs dashboard
  - [ ] CA mensuel
  - [ ] Taux conversion
  - [ ] Churn rate
  - [ ] ARPU

### 9.2 Monitoring & Error Tracking

- [ ] Créer compte Sentry
- [ ] Installer SDK
  ```bash
  npm install @sentry/nextjs
  ```
- [ ] Configurer Sentry
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```
- [ ] Source maps pour production
- [ ] Logging structuré
  - [ ] Installer Pino
  - [ ] Levels: error, warn, info, debug
- [ ] Alertes automatiques
  - [ ] Slack webhook pour erreurs critiques
  - [ ] Email pour downtime
- [ ] Health check `/api/health`
  - [ ] Status BDD
  - [ ] Status services externes
  - [ ] Uptime monitoring

### 9.3 Performance Monitoring

- [ ] Core Web Vitals tracking
  - [ ] LCP, FID, CLS, TTFB, FCP, INP
- [ ] Bundle analyzer
  ```bash
  npm run build:analyze
  ```
- [ ] Optimiser bundles si > 200KB
- [ ] Prisma query logging
  - [ ] Slow queries > 100ms
- [ ] Cache hit rate monitoring
  - [ ] Redis analytics
- [ ] Alertes performance
  - [ ] LCP > 2.5s
  - [ ] TTFB > 600ms

### ✅ Critères de Validation Phase 9
- [ ] 0 erreur non catchée en production
- [ ] Alertes Slack fonctionnelles
- [ ] Dashboard analytics complet
- [ ] Core Web Vitals tous "bons"

---

## Phase 10: Intégrations & API Publique

**Durée:** 1 semaine  
**Priorité:** BASSE

### 10.1 API REST Publique

- [ ] Documentation OpenAPI/Swagger
  - [ ] Installer swagger-ui-react
  - [ ] Page `/api/docs`
- [ ] Génération clés API
  - [ ] Modèle `ApiKey` dans Prisma
  - [ ] Route `/api/settings/api-keys`
  - [ ] Génération token sécurisé
- [ ] Rate limiting
  - [ ] Installer Upstash Redis
  - [ ] Middleware rate limit par API key
  - [ ] 1000 req/h par défaut
- [ ] Webhooks sortants
  - [ ] Configuration URLs webhook
  - [ ] Événements: `devis.created`, `facture.paid`
  - [ ] Retry automatique en cas d'échec
  - [ ] Logs webhooks

### 10.2 Intégrations Tierces

- [ ] Zapier integration
  - [ ] Developer account Zapier
  - [ ] Triggers custom
  - [ ] Actions custom
- [ ] Make.com modules
  - [ ] Developer account Make
  - [ ] Modules HTTP custom
- [ ] Export comptabilité
  - [ ] QuickBooks API (optionnel)
  - [ ] Xero API (optionnel)
  - [ ] Format CSV universel
- [ ] Import CRM
  - [ ] Salesforce API
  - [ ] HubSpot API
  - [ ] Format CSV import

### ✅ Critères de Validation Phase 10
- [ ] Documentation API complète et testée
- [ ] Rate limiting fonctionnel
- [ ] 1 intégration Zapier testée
- [ ] Export comptable validé par expert

---

## Phase 11: Mobile & Tests

**Durée:** 2 semaines  
**Priorité:** HAUTE  
**Dépendances:** Phase 5

### 11.1 Optimisation Mobile

- [ ] Audit mobile Lighthouse
- [ ] Bottom navigation mobile
- [ ] Gestures touch
  - [ ] Swipe pour supprimer
  - [ ] Pull to refresh
- [ ] Mode portrait/paysage
- [ ] Boutons touch-friendly (44px min)
- [ ] Clavier adapté par champ
  - [ ] Email → type="email"
  - [ ] Tel → type="tel"
  - [ ] Nombre → type="number"
- [ ] Tester sur vrais devices
  - [ ] iPhone (Safari)
  - [ ] Android (Chrome)
  - [ ] Tablet

### 11.2 Tests End-to-End

- [ ] Installer Playwright
  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```
- [ ] Configurer `playwright.config.ts`
- [ ] Tests critiques
  - [ ] `signup.spec.ts` - inscription
  - [ ] `create-devis.spec.ts` - création devis
  - [ ] `payment.spec.ts` - paiement
  - [ ] `invoice.spec.ts` - génération facture
- [ ] Tests multi-tenant
  - [ ] Isolation données entre orgs
  - [ ] Permissions par rôle
- [ ] CI/CD GitHub Actions
  - [ ] `.github/workflows/test.yml`
  - [ ] Tests auto sur chaque PR
  - [ ] Block merge si tests fail
- [ ] Tests visuels (optionnel)
  - [ ] Playwright screenshots
  - [ ] Percy.io pour diff visuel

### 11.3 Tests Performance

- [ ] Lighthouse CI
  ```bash
  npm install -D @lhci/cli
  ```
- [ ] Seuils minimums
  - [ ] Performance > 90
  - [ ] Accessibilité > 95
  - [ ] Best Practices > 95
  - [ ] SEO > 90
- [ ] Load testing k6
  - [ ] Install k6
  - [ ] Scripts load test
  - [ ] 100 users concurrents
  - [ ] Identifier bottlenecks
- [ ] Database performance
  - [ ] Prisma slow query log
  - [ ] Optimiser index si needed

### ✅ Critères de Validation Phase 11
- [ ] Tous tests E2E passent en vert
- [ ] Score Lighthouse mobile > 90
- [ ] Load test 100 users OK
- [ ] 0 régression visuelle

---

## Phase 12: Déploiement & Documentation

**Durée:** 1 semaine  
**Priorité:** CRITIQUE  
**Dépendances:** Phase 11

### 12.1 Infrastructure Production

- [ ] Configuration Vercel
  - [ ] Projet Vercel créé
  - [ ] Variables d'environnement
  - [ ] Domaines configurés
  - [ ] Preview URLs activées
- [ ] Base de données production
  - [ ] Vercel Postgres provisionné
  - [ ] Backups quotidiens activés
  - [ ] Point-in-time recovery configuré
- [ ] Redis production
  - [ ] Upstash Redis créé
  - [ ] Variables configurées
- [ ] CDN Cloudflare
  - [ ] DNS configuré
  - [ ] SSL/TLS activé
  - [ ] Cache rules configurées
- [ ] Monitoring production
  - [ ] Vercel Analytics activé
  - [ ] Sentry configuré
  - [ ] Uptime monitoring (UptimeRobot)
- [ ] Tests déploiement staging
- [ ] Go-live production

### 12.2 Documentation Complète

- [ ] Guide administrateur
  - [ ] Gestion organisation
  - [ ] Gestion utilisateurs
  - [ ] Configuration facturation
  - [ ] Screenshots annotés
- [ ] Documentation API
  - [ ] Swagger UI publié
  - [ ] Exemples requêtes
  - [ ] Codes erreur documentés
- [ ] Vidéos tutoriels
  - [ ] Onboarding 5 min
  - [ ] Créer premier devis
  - [ ] Configuration organisation
  - [ ] Publier sur YouTube
- [ ] FAQ complète
  - [ ] 50+ questions/réponses
  - [ ] Search fonctionnelle
- [ ] Troubleshooting guide
  - [ ] Problèmes courants
  - [ ] Solutions pas à pas
- [ ] Changelog automatisé
  - [ ] Format keep-a-changelog
  - [ ] Versionning sémantique

### 12.3 Onboarding Clients

- [ ] Wizard onboarding interactif
  - [ ] 5 étapes max
  - [ ] Progress bar
  - [ ] Skip possible
- [ ] Import données
  - [ ] Upload CSV clients
  - [ ] Upload CSV devis
  - [ ] Validation avant import
  - [ ] Preview avant confirmation
- [ ] Templates de démarrage
  - [ ] Nettoyage bureaux
  - [ ] Nettoyage industriel
  - [ ] Nettoyage résidentiel
  - [ ] Services à la personne
- [ ] Support chat in-app
  - [ ] Crisp ou Intercom
  - [ ] Réponses automatiques FAQ
  - [ ] Escalade vers humain
- [ ] Email welcome series
  - [ ] Day 0: Bienvenue
  - [ ] Day 2: Premier devis
  - [ ] Day 7: Tips & tricks
  - [ ] Day 14: Feedback request

### ✅ Critères de Validation Phase 12
- [ ] Application déployée en production
- [ ] Uptime 99.9% sur 7 jours
- [ ] Documentation 100% complète
- [ ] 5 premiers clients beta testés
- [ ] 0 bug critique en production

---

## 🎯 Métriques de Succès Globales

### Performance
- [ ] Lighthouse Score > 95 (desktop & mobile)
- [ ] TTFB < 200ms
- [ ] LCP < 1.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1

### Scalabilité
- [ ] Support 1000+ organisations simultanées
- [ ] Support 100,000+ devis/mois
- [ ] Temps réponse API < 100ms (p95)
- [ ] Database queries optimisées (< 10 queries par page)

### Disponibilité
- [ ] Uptime 99.9% (< 43 minutes downtime/mois)
- [ ] 0 perte de données
- [ ] Backups testés mensuellement
- [ ] RTO < 1 heure, RPO < 15 minutes

### Sécurité
- [ ] 0 vulnérabilités critiques (Snyk, npm audit)
- [ ] Toutes les données sensibles chiffrées
- [ ] Rate limiting sur toutes les routes publiques
- [ ] OWASP Top 10 audité et corrigé

### UX & Accessibilité
- [ ] Score accessibilité 100/100
- [ ] WCAG 2.1 AAA compliant
- [ ] Support 3 langues minimum
- [ ] Mobile-first design validé

### Business
- [ ] Conversion freemium → paid > 5%
- [ ] Churn < 3%/mois
- [ ] NPS > 50
- [ ] Time to first value < 5 minutes

---

## 📦 Packages à Installer (Récapitulatif)

### Core
```bash
npm install @prisma/client @prisma/extension-accelerate
npm install next-auth @next-auth/prisma-adapter
npm install stripe @stripe/stripe-js
npm install pusher pusher-js
```

### IA & ML
```bash
npm install openai ai
npm install @vercel/ai
```

### Outils
```bash
npm install next-pwa @ducanh2912/next-pwa
npm install next-intl
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid
npm install idb
npm install @vercel/analytics @vercel/speed-insights
npm install @sentry/nextjs
```

### Dev Dependencies
```bash
npm install -D prisma
npm install -D @playwright/test
npm install -D @lhci/cli
```

---

## 📞 Support & Questions

- **Slack**: #globalnet-dev
- **Email**: dev@globalnet.com
- **Docs**: https://docs.globalnet.com

---

**Dernière mise à jour:** 2025-11-03  
**Version:** 1.0.0

