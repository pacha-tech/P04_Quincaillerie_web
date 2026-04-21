/// Exemples d'utilisation des couleurs Flutter synchronisées
/// Montre les 3 approches : JavaScript, Tailwind, CSS

import { AppColors } from '@/src/lib/colors';

// ── Exemple composant avec couleurs synchronisées ────────────────────────
export function ExampleComponent() {
  return (
    <div className="p-6 space-y-4">
      {/* 1. APPROCHE TAILWIND - Classes utilitaires */}
      <div className="bg-app-primary text-white p-4 rounded-lg">
        <h3 className="text-lg font-bold">Titre avec couleur primaire</h3>
        <p className="text-app-text-secondary">Sous-titre avec couleur secondaire</p>
      </div>

      {/* 2. APPROCHE JAVASCRIPT - Variables directes */}
      <div
        style={{
          backgroundColor: AppColors.accent,
          color: AppColors.cardBg,
          padding: '1rem',
          borderRadius: '0.5rem'
        }}
      >
        <h3 style={{ color: AppColors.textPrimary }}>Titre accent</h3>
        <p style={{ color: AppColors.textMuted }}>Texte atténué</p>
      </div>

      {/* 3. APPROCHE CSS - Variables CSS */}
      <div className="custom-card">
        <h3>Carte avec variables CSS</h3>
        <p>Utilise les --app-* définies dans globals.css</p>
      </div>

      {/* 4. EXEMPLES PRATIQUES - Statuts et notifications */}
      <div className="space-y-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-app-green-light text-app-green-dark">
          ✓ Ouvert
        </span>

        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-app-closed-light text-app-closed-dark">
          ✗ Fermé
        </span>

        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: AppColors.starYellow }}>★</span>
          ))}
          <span style={{
            backgroundColor: AppColors.starBgWarm,
            color: AppColors.starTextBrown,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            4.5
          </span>
        </div>
      </div>

      {/* 5. BOUTONS AVEC COULEURS FONCTIONNELLES */}
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-app-call-green text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: AppColors.callGreen }}
        >
          📞 Appeler
        </button>

        <button
          className="px-4 py-2 bg-app-accent text-white rounded-lg hover:opacity-90"
        >
          🏷️ Promotion
        </button>

        <button
          className="px-4 py-2 border border-app-primary text-app-primary rounded-lg hover:bg-app-primary hover:text-white"
        >
          En savoir plus
        </button>
      </div>
    </div>
  );
}

