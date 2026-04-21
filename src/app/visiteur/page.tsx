import React from 'react';
import { ArrowRight, HardHat, Ruler, Construction, Truck , ImageIcon} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Utilisation des couleurs exactes de ton fichier config (accent, ville, region, quartier)
  // avec une opacité de 10% pour le fond (/10)
  const categories = [
    { name: "Gros Œuvre", icon: <Construction />, count: "150+ articles", color: "bg-app-accent/10 text-app-accent" },
    { name: "Électricité", icon: <HardHat />, count: "80+ articles", color: "bg-app-info-ville/10 text-app-info-ville" },
    { name: "Plomberie", icon: <Ruler />, count: "120+ articles", color: "bg-app-info-region/10 text-app-info-region" },
    { name: "Logistique", icon: <Truck />, count: "Services", color: "bg-app-info-quartier/10 text-app-info-quartier" },
  ];

  return (
    <div className="space-y-12 pb-20">

      {/* --- SECTION HERO (Bannière) --- */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden bg-app-primary flex items-center px-12 shadow-md">
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Construisez votre futur avec <span className="text-app-accent">Brixel</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Tous vos matériaux de construction au meilleur prix, livrés directement sur vos chantiers au Cameroun.
          </p>
          <button className="bg-app-accent hover:opacity-90 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-sm">
            Explorer le catalogue
          </button>
        </div>
        {/* Effet visuel de fond ajusté avec app-accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-app-accent/30 to-transparent hidden md:block pointer-events-none" />
      </section>

      {/* --- SECTION CATÉGORIES --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-app-text-primary">Nos catégories</h3>
          <Link href="/categories" className="text-app-accent font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity">
            Voir tout <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="p-6 bg-app-card border border-app-surface rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h4 className="font-bold text-app-text-primary">{cat.name}</h4>
              <p className="text-sm text-app-text-secondary">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION PRODUITS RÉCENTS --- */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-app-text-primary mb-6">Matériaux populaires</h3>
          <Link href="/categories" className="text-app-accent font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity">
            Voir tout <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4 , 5 , 6 , 7 , 8].map((id) => (
            <div key={id} className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
              <button className="absolute top-2 right-2 md:top-5 md:right-5 z-10 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer">
                Voir <ArrowRight className="h-3 w-3" />
              </button>
              <div className="p-2.5 md:p-4">
                <div className="mx-auto mb-2 md:mb-3 flex h-16 md:h-30 w-auto items-center justify-center rounded-xl md:rounded-3xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30">
                  <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-app-secondary" />
                </div>
                <h3 className="text-xs md:text-base font-semibold text-app-primary mb-0.5 md:mb-1 line-clamp-1">product{id}</h3>
                <p className="hidden md:block text-xs text-app-secondary mb-2 md:mb-3 line-clamp-2">quincaillerie{id}</p>
              </div>
              <div className="flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-4 md:py-3">
                <span className="text-xs md:text-base font-bold text-app-accent">2500 Fcfa</span>
                <span className="inline-flex items-center rounded-full bg-app-secondary px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 group-hover:bg-app-accent cursor-pointer">Ajouter</span>
              </div>
            </div>
          ))};
        </div>
      </section>
    </div>
  );
}