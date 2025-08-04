# Guide d'Utilisation - Gestion des Robots.txt via CMS

## Vue d'ensemble

Le système CMS de GlobalNet Services permet de modifier les règles `robots.txt` directement depuis le dashboard administrateur, sans avoir besoin de modifier le code source.

## Accès à la fonctionnalité

1. **Connexion au dashboard** avec un compte administrateur
2. **Navigation vers l'onglet "CMS"** dans le dashboard principal
3. **Sélection de l'onglet "Paramètres"** dans la navigation CMS
4. **Accès à l'onglet "Robots.txt"** dans les paramètres

## Interface de gestion

### Section "Règles générales"
- **User Agent:** `*` (tous les robots)
- **Pages autorisées:** Liste des chemins accessibles aux robots
- **Pages interdites:** Liste des chemins bloqués pour les robots

### Sections par moteur de recherche
- **Googlebot:** Règles spécifiques pour Google
- **Bingbot:** Règles spécifiques pour Bing
- **Slurp (Yahoo):** Règles spécifiques pour Yahoo

### Configuration globale
- **Sitemap URL:** URL du sitemap XML
- **Host:** Domaine principal du site

## Fonctionnalités disponibles

### ✅ Modifications en temps réel
- Toutes les modifications sont appliquées immédiatement
- Aucun redéploiement requis
- Sauvegarde automatique des changements

### ✅ Interface intuitive
- Formulaires avec validation en temps réel
- Prévisualisation des règles avant application
- Messages d'aide contextuels

### ✅ Gestion des erreurs
- Validation automatique des URLs
- Détection des conflits de règles
- Suggestions d'optimisation

### ✅ Historique des modifications
- Suivi de tous les changements
- Possibilité de revenir en arrière
- Logs détaillés des modifications

## Bulles d'aide disponibles

### 🔍 "User Agent"
**Question:** Qu'est-ce qu'un User Agent ?
**Réponse:** Un User Agent est l'identifiant du robot d'indexation. `*` signifie tous les robots, `Googlebot` signifie uniquement le robot Google.

### 🔍 "Pages autorisées"
**Question:** Quelles pages dois-je autoriser ?
**Réponse:** Autorisez les pages publiques importantes : accueil, services, à propos, contact, devis. Évitez les pages privées comme dashboard, admin, api.

### 🔍 "Pages interdites"
**Question:** Quelles pages dois-je bloquer ?
**Réponse:** Bloquez les pages privées : `/api/`, `/admin/`, `/dashboard/`, `/auth/`, `/_next/`, `/static/`, les fichiers JSON/XML.

### 🔍 "Sitemap URL"
**Question:** Où trouver l'URL du sitemap ?
**Réponse:** Le sitemap est généralement à `https://votre-domaine.com/sitemap.xml`. Il liste toutes les pages publiques du site.

### 🔍 "Host"
**Question:** Que mettre dans le champ Host ?
**Réponse:** Mettez votre domaine principal : `https://globalnet-services.fr` (sans slash final).

## Bonnes pratiques

### ✅ Règles recommandées
```
Autoriser:
- / (page d'accueil)
- /services (services)
- /about (à propos)
- /contact (contact)
- /devis (devis)
- /legal (mentions légales)

Bloquer:
- /api/ (API privée)
- /admin/ (administration)
- /dashboard/ (tableau de bord)
- /auth/ (authentification)
- /_next/ (fichiers Next.js)
- /static/ (fichiers statiques)
- *.json (fichiers JSON)
- *.xml (fichiers XML)
```

### ✅ Optimisation SEO
- Gardez les règles simples et claires
- Évitez les conflits entre allow et disallow
- Testez les règles avec Google Search Console
- Surveillez l'indexation dans les outils de webmaster

### ✅ Sécurité
- Ne jamais autoriser l'accès aux pages d'administration
- Bloquer systématiquement les dossiers sensibles
- Vérifier régulièrement les logs d'accès
- Maintenir une liste à jour des pages privées

## Dépannage

### ❌ Problème: Les robots accèdent encore aux pages bloquées
**Solution:** Vérifiez que les règles sont bien sauvegardées et que le cache est vidé.

### ❌ Problème: Les pages autorisées ne sont pas indexées
**Solution:** Vérifiez que les pages sont bien accessibles et que le sitemap est à jour.

### ❌ Problème: Erreur lors de la sauvegarde
**Solution:** Vérifiez la syntaxe des URLs et la validité du formulaire.

## Support technique

Pour toute question ou problème :
- **Email:** contact@globalnet-services.fr
- **Téléphone:** 01 23 45 67 89
- **Documentation:** Consultez les guides techniques dans le dashboard

---

## Notes importantes

⚠️ **Attention:** Les modifications des règles robots.txt peuvent impacter l'indexation du site. Testez toujours les changements avant de les appliquer en production.

✅ **Recommandation:** Sauvegardez une copie des règles actuelles avant toute modification importante.

🔄 **Rappel:** Les changements peuvent prendre quelques heures à quelques jours pour être pris en compte par les moteurs de recherche. 