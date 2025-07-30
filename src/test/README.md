# Guide des Tests - GlobalNet Services

## 📋 Vue d'Ensemble

Ce guide documente la stratégie de tests pour l'application GlobalNet Services, couvrant les tests unitaires, d'intégration et end-to-end.

## 🧪 Structure des Tests

### Tests Unitaires
- **Composants UI** : `src/components/ui/__tests__/`
- **Hooks personnalisés** : `src/hooks/__tests__/`
- **Utilitaires** : `src/utils/__tests__/`

### Tests d'Intégration
- **Formulaires** : `src/components/forms/__tests__/`
- **Authentification** : `src/components/auth/__tests__/`
- **Navigation** : `src/components/layout/__tests__/`

### Tests E2E
- **Flux utilisateur** : `src/__e2e__/`
- **Scénarios critiques** : Création de devis, authentification

## 🚀 Configuration

### Dépendances
```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.6.4",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0"
  }
}
```

### Configuration Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 📝 Conventions de Tests

### Nommage
- **Fichiers** : `ComponentName.test.tsx`
- **Suites** : `describe('ComponentName', () => {})`
- **Tests** : `it('should do something', () => {})`

### Structure
```typescript
describe('ComponentName', () => {
  it('renders correctly', () => {
    // Arrange
    render(<Component />)
    
    // Act
    const element = screen.getByText('text')
    
    // Assert
    expect(element).toBeInTheDocument()
  })
})
```

### Mocks
```typescript
// Mock des hooks
vi.mock('@/hooks/useHook', () => ({
  useHook: () => ({
    value: 'mocked',
    function: vi.fn()
  })
}))

// Mock des contextes
vi.mock('@/contexts/Context', () => ({
  useContext: () => ({
    state: 'mocked',
    dispatch: vi.fn()
  })
}))
```

## 🎯 Tests par Composant

### Composants UI

#### Input Component
- ✅ Rendu avec props de base
- ✅ Gestion des événements onChange
- ✅ Compatibilité React Hook Form
- ✅ Validation des erreurs
- ✅ Support des types (text, email, textarea)
- ✅ Forwarding des refs

#### Button Component
- ✅ Rendu avec children
- ✅ Gestion des événements click
- ✅ Variants (primary, secondary, outline)
- ✅ Tailles (sm, md, lg)
- ✅ États (disabled, loading)
- ✅ Classes CSS appropriées

### Hooks Personnalisés

#### useDevisCalculator
- ✅ Calcul des prix par type de service
- ✅ Application des réductions de fréquence
- ✅ Calcul des options supplémentaires
- ✅ Gestion des données invalides
- ✅ Breakdown des prix

### Formulaires

#### QuoteForm
- ✅ Rendu des étapes du formulaire
- ✅ Navigation entre les étapes
- ✅ Validation des champs requis
- ✅ Sauvegarde automatique localStorage
- ✅ Calcul des prix en temps réel
- ✅ Soumission du formulaire

#### LoginForm
- ✅ Champs email et mot de passe
- ✅ Validation des formats
- ✅ Gestion des états de chargement
- ✅ Affichage des erreurs
- ✅ Navigation clavier
- ✅ Accessibilité

## 🔧 Scripts de Test

```bash
# Exécuter tous les tests
npm test

# Mode watch
npm run test:watch

# Couverture de code
npm run test:coverage

# Interface utilisateur
npm run test:ui
```

## 📊 Métriques de Qualité

### Objectifs
- **Couverture de code** : > 80%
- **Tests unitaires** : 100% des composants
- **Tests d'intégration** : Flux critiques
- **Tests E2E** : Scénarios utilisateur

### Rapports
- **Vitest UI** : Interface graphique
- **Coverage** : Rapport de couverture
- **CI/CD** : Intégration continue

## 🐛 Debugging

### Tests qui échouent
```bash
# Mode debug
npm test -- --reporter=verbose

# Test spécifique
npm test -- --run src/components/ui/__tests__/Input.test.tsx
```

### Logs
```typescript
// Debug dans les tests
console.log(screen.debug())

// Vérifier les éléments
screen.getByRole('button')
screen.getByText('text')
screen.getByLabelText('label')
```

## 📚 Bonnes Pratiques

### 1. Tests Isolés
- Chaque test doit être indépendant
- Nettoyer les mocks entre les tests
- Éviter les dépendances entre tests

### 2. Tests Significatifs
- Tester le comportement, pas l'implémentation
- Se concentrer sur les cas d'usage
- Éviter les tests triviaux

### 3. Accessibilité
- Tester la navigation clavier
- Vérifier les attributs ARIA
- Tester avec les lecteurs d'écran

### 4. Performance
- Tests rapides (< 100ms par test)
- Éviter les mocks lourds
- Utiliser des snapshots avec parcimonie

## 🔄 Maintenance

### Mise à Jour
- Maintenir les tests à jour avec le code
- Réviser les mocks lors des changements
- Ajouter des tests pour les nouveaux features

### Refactoring
- Refactorer les tests avec le code
- Maintenir la lisibilité
- Éviter la duplication

---

*Documentation créée le 30/07/2025*
*Dernière mise à jour : 30/07/2025* 