# 🎨 Système de Couleurs Flutter ↔️ Next.js

Ce système maintient la **parfaite cohérence** entre votre app Flutter mobile et votre app web Next.js.

## 📁 Fichiers créés

```
src/
├── lib/
│   └── colors.ts              # Variables JavaScript/TypeScript
├── tailwind.config.js         # Configuration Tailwind
├── app/
│   └── globals.css            # Variables CSS
└── components/
    └── examples/
        └── ColorExamples.tsx  # Exemples d'utilisation
```

## 🎯 3 Façons d'utiliser les couleurs

### 1. **Tailwind CSS** (Recommandé)
```tsx
<div className="bg-app-primary text-app-accent">
  <h3 className="text-app-text-primary">Titre</h3>
  <p className="text-app-text-muted">Sous-titre</p>
</div>
```

### 2. **JavaScript/TypeScript**
```tsx
import { AppColors } from '@/lib/colors';

<div style={{ backgroundColor: AppColors.primary }}>
  <span style={{ color: AppColors.accent }}>Texte</span>
</div>
```

### 3. **CSS Variables**
```css
.my-element {
  background-color: var(--app-primary);
  color: var(--app-text-primary);
}
```

## 🏷️ Noms des couleurs disponibles

### Couleurs principales
- `app-primary` : Fond sombre navbar (#1A1A2E)
- `app-secondary` : Couleur secondaire (#3D3E50)
- `app-accent` : Rouge vif - promotions (#E94560)
- `app-surface` : Fond pages (#F8F9FB)
- `app-card` : Fond cartes (#FFFFFF)

### Prix & Disponibilité
- `app-price-green` : Vert prix/succès (#00897B)
- `app-green-light` : Badge "Ouvert" (#E8F5E9)
- `app-call-green` : Bouton appel (#00897B)

### Statuts
- `app-status-open` : Point "Ouvert" (#43A047)
- `app-status-closed` : Point "Fermé" (#E53935)
- `app-closed-light` : Badge "Fermé" (#FFEBEE)

### Étoiles & Notation
- `app-star-yellow` : Étoiles (#FFB300)
- `app-star-bg-warm` : Fond notation (#FFF8E1)
- `app-star-text-brown` : Texte note (#7B5800)

### Icônes Infos
- `app-info-phone` : Téléphone (#00897B)
- `app-info-ville` : Ville (#1E88E5)
- `app-info-quartier` : Quartier (#5E35B1)
- `app-info-region` : Région (#43A047)

### Textes
- `app-text-primary` : Texte principal (#1A1A2E)
- `app-text-secondary` : Texte secondaire (#2D2D2D)
- `app-text-muted` : Texte atténué (#444444)

### Notifications
- `app-notif-success` : Succès (#4CAF50)
- `app-notif-warning` : Avertissement (#FF9800)
- `app-notif-error` : Erreur (#F44336)

## 🔄 Migration depuis Flutter

### Flutter → Next.js
```dart
// Flutter
Container(
  color: AppColors.primary,
  child: Text('Hello', style: TextStyle(color: AppColors.accent)),
)
```
```tsx
// Next.js - Tailwind
<div className="bg-app-primary text-app-accent">Hello</div>

// Next.js - JavaScript
<div style={{ backgroundColor: AppColors.primary, color: AppColors.accent }}>
  Hello
</div>
```

## ✅ Avantages

- **Cohérence parfaite** entre mobile et web
- **Maintenance simplifiée** : changement dans Flutter = changement dans Next.js
- **Type-safe** : Autocomplétion et vérification TypeScript
- **Flexible** : 3 approches selon les besoins
- **Évolutif** : Ajout de nouvelles couleurs facile

## 🚀 Utilisation dans vos composants

Importez et utilisez :

```tsx
import { AppColors } from '@/lib/colors';

export function MonComposant() {
  return (
    <div className="bg-app-surface p-4 rounded-lg border border-app-card">
      <h3 className="text-app-text-primary">Titre</h3>
      <p className="text-app-text-secondary">Description</p>
      <button className="bg-app-accent text-white px-4 py-2 rounded">
        Action
      </button>
    </div>
  );
}
```

## 📝 Prochaines étapes

1. **Testez** les couleurs dans vos composants
2. **Migrez** progressivement vos composants existants
3. **Ajoutez** de nouvelles couleurs si nécessaire
4. **Synchronisez** avec votre équipe Flutter

---

*Ce système garantit que vos apps mobile et web auront exactement la même apparence et les mêmes couleurs !*</content>
<parameter name="filePath">/home/pacha/L3/S1/300/projet/brixel_web/COLORS_SYNC.md