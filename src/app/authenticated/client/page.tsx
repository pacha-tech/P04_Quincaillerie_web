'use client';

import PourVousSection from '@/src/components/ui/client/PourVous';
import PromotionsSection from '@/src/components/ui/client/PromotionSection';
import SearchBar from '@/src/components/ui/client/SearchBar';
import { Star, Truck, Shield, Heart, ShoppingCart, Wrench, Paintbrush } from 'lucide-react';

const categories = [
  { icon: Wrench, title: 'Quincaillerie', description: 'Matériaux et outils indispensables' },
  { icon: Paintbrush, title: 'Peinture', description: 'Finitions et décorations murales' },
  { icon: Shield, title: 'Sécurité', description: 'Équipements de chantier fiables' },
  { icon: Truck, title: 'Livraison', description: 'Transport rapide et sûr' },
];

export default function ClientDashboard() {
  return (
    <div className="p-5 md:p-6 space-y-8 bg-app-surface min-h-screen overflow-x-hidden">
      
      {/* Header Fixe */}
      <div className="sticky top-0 z-30 bg-app-surface/95 backdrop-blur-sm -mx-5 px-5 pt-4 pb-2">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-app-primary mb-1">Bienvenue sur Brixel</h1>
            <p className="text-app-secondary text-[10px] md:text-base">Trouvez les meilleurs matériaux pour vos projets</p>
          </div>
          <div className="flex justify-center md:justify-end md:flex-1 border-b md:border-none border-app-surface pb-4 md:pb-0">
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Catégories populaires */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-4 md:mb-6">Catégories populaires</h2>
        <div className="-mx-5 overflow-hidden">
          <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto px-5 pb-4 snap-x scrollbar-hide">
            {categories.map((category) => (
              <div key={category.title} className="group snap-start flex-shrink-0 min-w-[110px] h-28 md:min-w-0 md:h-40 rounded-2xl md:rounded-3xl p-3 md:p-5 border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer">
                <div className="mb-2 md:mb-4 flex items-center justify-center h-9 w-9 md:h-16 md:w-16 rounded-xl md:rounded-3xl bg-app-surface text-app-secondary transition-colors duration-300 group-hover:bg-app-accent">
                  <category.icon className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <h3 className="text-xs md:text-base font-semibold text-app-primary mb-0.5 md:mb-2 line-clamp-1">{category.title}</h3>
                <p className="hidden md:block text-xs text-app-secondary line-clamp-2 leading-tight">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPOSANT: Pour vous (STATIQUE) ─────────────────────────────────── */}
      <PourVousSection />

      {/* Promotion héros (Bannière) */}
      <div className="bg-gradient-to-br from-app-accent via-app-secondary to-app-primary rounded-3xl p-6 md:p-8 text-app-card shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">🔥 Promotion exceptionnelle</h2>
            <p className="text-base md:text-lg mb-4 md:mb-6 opacity-90">Jusqu'à -30% sur les outils électriques ce mois-ci !</p>
            <button className="bg-app-card text-app-accent px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95">Voir les offres</button>
          </div>
          <div className="hidden sm:flex h-24 w-24 md:h-32 md:w-32 items-center justify-center rounded-3xl bg-app-card/10 text-4xl md:text-5xl">⚡</div>
        </div>
      </div>

      {/* ── COMPOSANT: PROMOTIONS (DYNAMIQUE) ───────────────────────────────── */}
      <PromotionsSection />

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Mes commandes', sub: 'Suivre vos achats', icon: ShoppingCart, color: 'bg-app-accent' },
          { label: 'Mes favoris', sub: 'Articles sauvegardés', icon: Heart, color: 'bg-app-error' },
          { label: 'Évaluations', sub: 'Vos avis produits', icon: Star, color: 'bg-app-star-yellow' },
        ].map((item, i) => (
          <button key={i} className="group flex items-center gap-4 p-4 md:p-5 bg-app-card border border-app-surface rounded-2xl md:rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-95 hover:shadow-md cursor-pointer">
            <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full ${item.color} transition-all duration-300 group-hover:scale-110`}>
              <item.icon className="h-5 w-5 md:h-6 md:w-6 text-app-card" />
            </div>
            <div className="text-left">
              <p className="text-sm md:text-base font-semibold text-app-primary group-hover:text-app-accent transition-colors">{item.label}</p>
              <p className="text-xs text-app-secondary">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}