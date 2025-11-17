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

## Phase 0: Prérequis & Initialisation ✅ COMPLÉTÉE

**Durée:** 1-2 jours
**Priorité:** CRITIQUE
**Status:** 🟢 COMPLÉTÉE

### 0.1 Initialisation Prisma et Schéma

- [x] Prisma client déjà installé (@prisma/client ^5.6.0)
- [x] Initialiser Prisma (manuellement - création prisma/schema.prisma)
- [x] Vérifier fichiers créés:
  - [x] `prisma/schema.prisma` ✅ Complet avec 15 modèles
  - [x] `.env` avec DATABASE_URL configuré
- [x] Créer `.env.example` et `.env` avec variables complètes
- [x] Créer le schéma Prisma détaillé:
  - [x] 15 modèles Prisma complets
  - [x] Multi-tenant avec `organizationId` obligatoire
  - [x] Authentification NextAuth.js compatible
  - [x] Relations et indexes configurés
  - [x] Soft delete et audit trail

### 0.2 Scripts NPM & Configuration

- [x] Mettre à jour `package.json` avec scripts db (db:migrate, db:seed, db:studio, etc.)
- [x] Ajouter `ts-node` et `concurrently` pour seed
- [x] Créer `prisma/seed.ts` avec données de test
- [x] TypeScript config existant (`tsconfig.json`)
- [x] ESLint config existant

### ✅ Critères Validation Phase 0
- [x] Schéma Prisma syntaxiquement correct
- [x] Seeds préparés avec données de test (3 orgs, 10 clients, etc.)
- [x] `.env.example` et `.env` configurés
- [x] Scripts db ajoutés au package.json

---

## Phase 1: Migration Base de Données & Architecture Multi-Tenant ✅ COMPLÉTÉE

**Durée:** 3 semaines (réalisé en 1 jour)
**Priorité:** CRITIQUE
**Dépendances:** Phase 0 ✅
**Status:** 🟢 COMPLÉTÉE

### 1.0 Configuration Prisma + PostgreSQL ✅ COMPLÉTÉE

- [x] Dépendances Prisma déjà installées (@prisma/client ^5.6.0)
- [x] Schéma Prisma créé dans `prisma/schema.prisma` avec 15 modèles complets
- [x] Indexes configurés sur `organizationId`, `userId`, `status`, `email`, `createdAt`
- [x] Relations et cascade rules configurées
- [x] Variables d'environnement dans `.env` et `.env.example`
- [x] Seed data générées (`prisma/seed.ts` - 3 orgs, 4 users, 10 clients, 10 quotes, 5 invoices)

### 1.1 Validation Schemas & Client API Routes ✅ COMPLÉTÉE

**Commits:**
- feat: Phase 1.1 - Refactor API routes with Prisma and multi-tenant support
- feat: Phase 1.2-1.3 - Refactor Devis and Factures API routes with Prisma

- [x] Créer Zod validation schemas complets (`lib/validations.ts` - 250+ lignes):
  - [x] Client, Devis, Facture, Intervention schemas
  - [x] Pagination et filtering schemas
  - [x] All types properly exported

- [x] Refactoriser API routes Clients:
  - [x] GET `/api/clients` - List avec pagination, filtering (status, type), sorting
  - [x] GET `/api/clients/[id]` - Isolement tenant + relationships
  - [x] POST `/api/clients` - Création avec validation, email conflict detection, audit
  - [x] PUT `/api/clients/[id]` - Mise à jour avec email conflict check, audit trail
  - [x] DELETE `/api/clients/[id]` - Soft delete (archive status), audit logging

- [x] Refactoriser API routes Devis:
  - [x] GET `/api/devis` - List avec status/clientId/date filters, client data included
  - [x] GET `/api/devis/[id]` - Avec toutes les relations (client, items, invoices, creator)
  - [x] POST `/api/devis` - Création avec items, auto-calculate totals, generate number
  - [x] PUT `/api/devis/[id]` - Update avec items recalculation, tenant isolation
  - [x] DELETE `/api/devis/[id]` - Soft delete (draft quotes only), archive status

- [x] Refactoriser API routes Factures:
  - [x] GET `/api/factures` - List avec paymentStatus/status filters, relationships
  - [x] POST `/api/factures` - Create from accepted devis OR standalone
  - [x] Auto-populate from devis or accept clientId for standalone
  - [x] Auto-generate invoice numbers (FA-YYYY-0001 format)

- [x] Implémentation multi-tenant pour toutes les routes:
  - [x] `lib/tenant-middleware.ts` - Extract + validate organization context
  - [x] `lib/permissions.ts` - RBAC système complet (5 rôles, 20+ permissions)
  - [x] Audit logging automatique sur toutes les modifications

- [x] Format standardisé réponses API:
  - [x] `ApiResponse<T>` wrapper avec success flag + timestamp
  - [x] `PaginatedResponse` pour list operations (items, total, pages, hasMore)
  - [x] Gestion erreurs cohérente avec codes d'erreur

### 1.2 À faire: Tests & Migration JSON

- [ ] Tester toutes les routes avec Insomnia/Postman
- [ ] Migration données JSON vers PostgreSQL (scripts/migrate-json-to-db.ts)
- [ ] Tester seed data génération

### ✅ Critères de Validation Phase 1
- [x] Schéma Prisma syntaxiquement correct et bien structuré
- [x] All API routes refactored avec Prisma + Zod validation
- [x] Isolation multi-tenant implémentée sur toutes les routes
- [x] Audit logging complet (créé, modifié, supprimé)
- [x] 4 commits pushés avec messages détaillés

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

