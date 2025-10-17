# Migration Navbar → Right Sidebar

## Objectif
Remplacer la barre de navigation supérieure par une colonne latérale droite, accessible, réactive et à parité fonctionnelle.

## Activation du feature flag
- **LocalStorage** :
  - Ouvrir la console navigateur et exécuter :
    ```js
    localStorage.setItem('RIGHT_SIDEBAR_NAV', '1')
    ```
  - Rafraîchir la page.
- **.env** (optionnel) :
  - Ajouter `REACT_APP_RIGHT_SIDEBAR_NAV=1` puis relancer le serveur.

## Test (desktop/tablette/mobile)
- **≥1280px** : Sidebar visible à droite, sticky, collapsable.
- **768–1279px** : Sidebar en overlay, toggle via bouton.
- **<768px** : Sidebar plein écran, toggle via bouton “Menu” (kebab).
- **Clavier** : Tab, Shift+Tab, Entrée, Espace, aria, focus visible.
- **Dark/Light** : Respecte le mode existant.

## Parité
- Routes, permissions, actions, icônes, styles, analytics inchangés.

## Migration
- Supprimer l’ancien composant `Navbar` et ses imports une fois la migration validée.
- Adapter les tests et stories si besoin.

## TODO/Risques
- Ajouter tests unitaires/e2e (nav clavier, collapse, overlay, persistance).
- Ajouter stories Storybook pour chaque état.
- Vérifier tracking analytics.
- Limiter le resize (240–360px) si resize activé.
- Accessibilité WCAG 2.2 AA à valider.

## Fichiers impactés
- `src/App.jsx` (feature flag, shell)
- `src/components/rightSidebar/*` (nouveaux composants)
- `src/index.css` (import styles)
- `src/components/navbar.jsx` (sera supprimé à terme)
