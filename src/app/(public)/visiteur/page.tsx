import React from 'react';
import { ArrowRight, HardHat, Ruler, Construction, Truck, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const categories = [
    { name: "Gros Œuvre", icon: <Construction className="h-6 w-6" />, count: "150+ articles", color: "text-app-accent bg-app-accent/10" },
    { name: "Électricité", icon: <HardHat className="h-6 w-6" />, count: "80+ articles", color: "text-blue-500 bg-blue-500/10" },
    { name: "Plomberie", icon: <Ruler className="h-6 w-6" />, count: "120+ articles", color: "text-teal-500 bg-teal-500/10" },
    { name: "Logistique", icon: <Truck className="h-6 w-6" />, count: "Services", color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto font-sans selection:bg-app-accent/20">

      {/* --- SECTION HERO (Bannière Épurée) --- */}
      <section className="relative h-[300px] md:h-[400px] w-full rounded-[2rem] md:rounded-[3rem] bg-app-card border border-app-primary/5 shadow-2xl shadow-app-primary/5 flex items-center overflow-hidden">
        {/* Arrière-plan subtil et abstrait */}
        <div className="absolute inset-0 bg-gradient-to-br from-app-surface to-app-card"></div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-app-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 px-4 md:px-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-app-accent/10 border border-app-accent/20 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-app-accent animate-pulse"></span>
            <span className="text-[10px] font-bold text-app-accent uppercase tracking-wider">Pour vous facilite les choses</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-black text-app-primary leading-[1.1] tracking-tight mb-4">
            Construisez votre futur avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">Brixel</span>
          </h2>
          <p className="text-base md:text-lg text-app-secondary leading-relaxed mb-8">
            Tous vos matériaux au meilleur prix, livrés directement sur vos chantiers.
          </p>
          <button className="px-8 py-3.5 bg-app-primary text-white text-sm font-bold rounded-full hover:bg-black/80 transition-all shadow-md active:scale-95 inline-flex items-center gap-2">
            Explorer le catalogue
          </button>
        </div>
      </section>

      {/* --- SECTION CATÉGORIES --- */}
      <section>
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h3 className="text-2xl font-black text-app-primary tracking-tight">Nos catégories</h3>
            <p className="text-sm text-app-secondary mt-1">L'essentiel pour vos travaux</p>
          </div>
          <Link href="#" className="hidden sm:flex text-sm font-bold text-app-accent hover:text-app-primary transition-colors items-center gap-1">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <div key={index} className="bg-app-surface rounded-[1.5rem] p-6 border border-app-primary/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-app-primary/5 transition-all duration-300 cursor-pointer group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 ${cat.color}`}>
                {cat.icon}
              </div>
              <h4 className="font-bold text-app-primary text-lg mb-1">{cat.name}</h4>
              <p className="text-xs text-app-secondary font-medium">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION PRODUITS RÉCENTS --- */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-2xl font-bold text-app-primary tracking-tight">Matériaux populaires</h3>
          <Link href="#" className="text-app-accent font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity">
            Voir tout <ArrowRight size={18} />
          </Link>
        </div>
        
        {/* DESIGN DES CARTES EXACTEMENT COMME LE TIEN */}
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
          ))}
        </div>
      
      </section>
    </div>
  );
}