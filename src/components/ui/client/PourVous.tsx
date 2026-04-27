'use client';

import { Image as ImageIcon, ArrowRight } from 'lucide-react';

const staticProducts = [
  { title: 'Marteau perforateur Bosch', quincaillerie: 'Bosch Quincaillerie', price: '150000 Fcfa' },
  { title: 'Ciment Portland 50kg', quincaillerie: 'Ciment Plus', price: '10000 Fcfa' },
  { title: 'Peinture acrylique 5L', quincaillerie: 'Color Plus', price: '25000 Fcfa' },
  { title: 'Échafaudage métallique', quincaillerie: 'Construction Pro', price: '75000 Fcfa' },
  { title: 'Gants de protection', quincaillerie: 'Safety First', price: '5000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
];

export default function PourVousSection() {
  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-1 md:mb-2">Pour vous</h2>
        <p className="text-xs md:text-sm text-app-secondary">Découvrez nos produits les plus demandés</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {staticProducts.slice(0, 10).map((product, index) => (
          <div key={index} className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
            <button className="absolute top-2 right-2 md:top-5 md:right-5 z-10 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer">
              Voir <ArrowRight className="h-3 w-3" />
            </button>
            <div className="p-2.5 md:p-4">
              <div className="mx-auto mb-2 md:mb-3 flex h-16 md:h-30 w-auto items-center justify-center rounded-xl md:rounded-3xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30">
                <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-app-secondary" />
              </div>
              <h3 className="text-xs md:text-base font-semibold text-app-primary mb-0.5 md:mb-1 line-clamp-1">{product.title}</h3>
              <p className="hidden md:block text-xs text-app-secondary mb-2 md:mb-3 line-clamp-2">{product.quincaillerie}</p>
            </div>
            <div className="flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-4 md:py-3">
              <span className="text-xs md:text-base font-bold text-app-accent">{product.price}</span>
              <span className="inline-flex items-center rounded-full bg-app-secondary px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 group-hover:bg-app-accent cursor-pointer">Ajouter</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}