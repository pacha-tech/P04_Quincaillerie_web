/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Palette Flutter synchronisée ──────────────────────────────────────
        app: {
          // Couleurs principales
          primary: '#1A1A2E',      // Fond sombre navbar/appbar
          secondary: '#3D3E50',    // Couleur secondaire
          accent: '#E94560',       // Rouge vif - promotions, badges
          surface: '#F8F9FB',      // Fond général des pages
          card: '#FFFFFF',         // Fond des cartes

          // Prix & disponibilité
          'price-green': '#00897B',    // Vert prix, stock, succès
          'green-dark': '#2E7D32',     // Vert foncé texte
          'green-light': '#E8F5E9',    // Fond badge "Ouvert"
          'call-green': '#00897B',     // Bouton appel

          // Statuts
          'status-open': '#43A047',    // Point "Ouvert"
          'status-closed': '#E53935',  // Point "Fermé"
          'closed-light': '#FFEBEE',   // Fond badge "Fermé"
          'closed-dark': '#C62828',    // Texte badge "Fermé"

          // Étoiles / notation
          'star-yellow': '#FFB300',    // Étoiles
          'star-bg-warm': '#FFF8E1',   // Fond container notation
          'star-text-brown': '#7B5800', // Texte note

          // Icônes infos
          'info-phone': '#00897B',
          'info-ville': '#1E88E5',
          'info-quartier': '#5E35B1',
          'info-precision': '#E53935',
          'info-region': '#43A047',

          // Textes
          'text-primary': '#1A1A2E',
          'text-secondary': '#2D2D2D',
          'text-muted': '#444444',

          // Notifications
          'notif-success': '#4CAF50',
          'notif-warning': '#FF9800',
          'notif-error': '#F44336',
        },

        // ── Alias pratiques ──────────────────────────────────────────────────
        // Pour compatibilité avec l'existant
        brixel: {
          primary: '#1A1A2E',
          accent: '#E94560',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}