/// Palette centralisée — importez ce fichier partout dans l'app
/// Usage : AppColors.primary, AppColors.accent, etc.
export class AppColors {
  private constructor() {} // Empêche l'instanciation

  // ── Couleurs principales ────────────────────────────────────────────────────
  /// Fond sombre navbar / appbar
  static readonly primary    = '#1A1A2E';

  /// Couleurs secondaire
  static readonly secondary  = '#3D3E50';

  /// Rouge vif — promotions, badges, accents
  static readonly accent     = '#E94560';

  /// Fond général des pages
  static readonly surface    = '#F8F9FB';

  /// Fond des cartes
  static readonly cardBg     = '#FFFFFF';

  // ── Prix & disponibilité ───────────────────────────────────────────────────
  /// Vert — prix, stock disponible, succès
  static readonly priceGreen = '#00897B';

  /// Vert foncé texte sur fond clair
  static readonly greenDark  = '#2E7D32';

  /// Vert fond badge "Ouvert"
  static readonly greenLight = '#E8F5E9';

  /// Vert bouton appel
  static readonly callGreen  = '#00897B';

  // ── Statuts ────────────────────────────────────────────────────────────────
  /// Vert point "Ouvert"
  static readonly statusOpen   = '#43A047';

  /// Rouge point "Fermé"
  static readonly statusClosed = '#E53935';

  /// Rouge fond badge "Fermé"
  static readonly closedLight  = '#FFEBEE';

  /// Rouge texte badge "Fermé"
  static readonly closedDark   = '#C62828';

  // ── Étoiles / notation ────────────────────────────────────────────────────
  /// Jaune étoiles
  static readonly starYellow  = '#FFB300';

  /// Fond container notation
  static readonly starBgWarm  = '#FFF8E1';

  /// Texte note
  static readonly starTextBrown = '#7B5800';

  // ── Icônes infos ──────────────────────────────────────────────────────────
  static readonly infoPhone    = '#00897B';
  static readonly infoVille    = '#1E88E5';
  static readonly infoQuartier = '#5E35B1';
  static readonly infoPrecision= '#E53935';
  static readonly infoRegion   = '#43A047';

  // ── Textes ────────────────────────────────────────────────────────────────
  static readonly textPrimary   = '#1A1A2E';
  static readonly textSecondary = '#2D2D2D';
  static readonly textMuted     = '#444444';

  // ── Notifications ─────────────────────────────────────────────────────────
  static readonly notifSuccess = '#4CAF50'; // Colors.green équivalent
  static readonly notifWarning = '#FF9800'; // Colors.orange équivalent
  static readonly notifError   = '#F44336'; // Colors.red équivalent
}

// ── Types pour TypeScript ──────────────────────────────────────────────────
export type AppColorKeys = keyof typeof AppColors;
export type AppColorValues = typeof AppColors[AppColorKeys];

// ── Fonctions utilitaires ───────────────────────────────────────────────────
export const getColor = (colorName: AppColorKeys): string => {
  return AppColors[colorName] as string;
};

export const colors = AppColors; // Alias pour compatibilité</content>