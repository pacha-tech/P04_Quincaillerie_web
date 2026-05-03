'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import { 
  Star, Truck, Shield, Heart, ShoppingCart, 
  Image as ImageIcon, Wrench, Paintbrush, ArrowRight, 
  Loader2, AlertCircle 
} from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import PromotionsSection from '@/src/components/ui/client/PromotionSection';

const categories = [
  { icon: Wrench, title: 'Quincaillerie', description: 'Matériaux et outils indispensables' },
  { icon: Paintbrush, title: 'Peinture', description: 'Finitions et décorations murales' },
  { icon: Shield, title: 'Sécurité', description: 'Équipements de chantier fiables' },
  { icon: Truck, title: 'Livraison', description: 'Transport rapide et sûr' },
];

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
];

export default function ClientDashboard() {
  const { items } = useCart(); 

  const [promotedProducts, setPromotedProducts] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getPromotedProducts();
        setPromotedProducts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Impossible de charger les promotions.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* ── Catégories populaires ────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-4 md:mb-6">Catégories populaires</h2>
        <div className="-mx-4 md:mx-0 overflow-hidden">
          <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto px-4 md:px-0 pb-2 snap-x scrollbar-hide">
            {categories.map((category) => (
              <div key={category.title} className="group snap-start flex-shrink-0 min-w-[110px] h-28 md:min-w-0 md:h-36 rounded-2xl p-3 border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer">
                <div className="mb-2 flex items-center justify-center h-8 w-8 rounded-xl bg-app-surface text-app-secondary transition-colors duration-300 group-hover:bg-app-accent">
                  <category.icon className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-semibold text-app-primary mb-0.5 line-clamp-1">{category.title}</h3>
                <p className="text-[10px] text-app-secondary line-clamp-2 leading-tight">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pour vous ───────────────────────────────────────────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-1">Pour vous</h2>
          <p className="text-xs text-app-secondary">Découvrez nos produits les plus demandés</p>
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
                <span className="inline-flex items-center rounded-full bg-app-secondary px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 group-hover:bg-app-accent cursor-pointer">
                  Ajouter
                </span>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Bannière Promotion */}
      <div className="bg-gradient-to-br from-app-accent via-app-secondary to-app-primary rounded-3xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-xl md:text-2xl font-black mb-1">🔥 Promotion exceptionnelle</h2>
            <p className="text-xs md:text-sm opacity-90 mb-4">Jusqu'à -30% sur les outils électriques ce mois-ci !</p>
            <button className="bg-white text-app-accent px-5 py-2 rounded-xl font-bold text-xs transition active:scale-95">
              Voir les offres
            </button>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
            ⚡
          </div>
        </div>
      </div>

      {/* ── SECTION PROMOTIONS (API) ──────────────────────────────────── */}
      <PromotionsSection />

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Mes commandes', sub: 'Suivre vos achats', icon: ShoppingCart, color: 'bg-app-accent' },
          { label: 'Mes favoris', sub: 'Articles sauvegardés', icon: Heart, color: 'bg-app-error' },
          { label: 'Évaluations', sub: 'Vos avis produits', icon: Star, color: 'bg-app-star-yellow' },
        ].map((item, i) => (
          <button key={i} className="group flex items-center gap-4 p-4 bg-app-card border border-app-surface rounded-2xl shadow-sm transition hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-white`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-app-primary">{item.label}</p>
              <p className="text-[10px] text-app-secondary">{item.sub}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}