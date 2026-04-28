
/*
'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/src/components/ui/client/SearchBar';
//import { useAuthRole } from '@/src/hooks/useAuthRole';
import { getPromotedProducts } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import Image from 'next/image';
import { 
  Star, Truck, Shield, Heart, ShoppingCart, 
  Image as ImageIcon, Wrench, Paintbrush, ArrowRight, 
  Loader2, AlertCircle 
} from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { panierService } from '@/src/services/PanierService';



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
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
];

export default function ClientDashboard() {
  //const { role } = useAuthRole();
  
  
  const { items, updateQuantity } = useCart(); 

  
  const [promotedProducts, setPromotedProducts] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPromotedProducts();
        setPromotedProducts(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les promotions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // ── GESTIONNAIRES D'ACTIONS PANIER ──────────────────────────────────────
  const handleAddToCart = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await panierService.addProductToPanier(idPrice);
      // Idéalement, appelle ici une fonction de ton CartContext pour rafraîchir la donnée globale.
      // ex: await fetchCart();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'ajout au panier");
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  const handleIncrement = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await panierService.addQuantityToPanier(idPrice);
      // Idéalement: await fetchCart();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  const handleDecrement = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await panierService.removeQuantityToPanier(idPrice);
      // Idéalement: await fetchCart();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  return (
    <div className="p-5 md:p-6 space-y-8 bg-app-surface min-h-screen overflow-x-hidden">
      
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

      
      <div>
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-1 md:mb-2">🔥 En promotion</h2>
          <p className="text-xs md:text-sm text-app-secondary">Profitez de nos offres exceptionnelles cette semaine</p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-app-accent mb-2" />
            <span className="text-sm text-app-secondary">Chargement des promos...</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-xs font-bold underline text-red-700">Réessayer</button>
          </div>
        )}

        {!isLoading && !error && promotedProducts.length === 0 && (
          <div className="py-10 text-center border-2 border-dashed border-app-surface rounded-3xl">
            <p className="text-app-secondary text-sm italic">Aucune promotion disponible pour le moment.</p>
          </div>
        )}

        {!isLoading && !error && promotedProducts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {promotedProducts.map((product) => {
              // 1. Trouver le prix actif (en promo)
              const activePrice = product.priceSearchProductsDTO.find(p => p.inPromotion) || product.priceSearchProductsDTO[0];
              const idPrice = activePrice.idPrice;

              // 2. Vérifier si ce produit est dans le panier via le Context (Instantané !)
              const cartItem = items?.find(item => item.idPrice === idPrice);
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              const isActionLoading = loadingActions[idPrice] || false;

              return (
                <div key={product.idProduct} className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
                  <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10 rounded-full bg-app-accent px-2 py-0.5 text-[9px] md:text-xs font-bold text-app-card shadow-sm">
                    -{activePrice.taux}%
                  </div>
                  <button className="absolute top-2 right-2 md:top-5 md:right-5 z-10 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer">
                    Voir <ArrowRight className="h-3 w-3" />
                  </button>
                  <div className="p-2.5 md:p-4">
                    <div className="relative mx-auto mb-2 md:mb-3 flex h-16 md:h-30 w-auto items-center justify-center rounded-xl md:rounded-3xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30 overflow-hidden">
                      {product.imageUrl ? (
                        <Image 
                          src={product.imageUrl} 
                          alt={product.name} 
                          fill 
                          sizes="(max-width: 768px) 100px, 150px"
                          className="object-cover" 
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-app-secondary" />
                      )}
                    </div>
                    <h3 className="text-xs md:text-base font-semibold text-app-primary mb-0.5 md:mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[9px] md:text-xs text-app-secondary/70 line-clamp-1">{activePrice.quincaillerieName}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-4 md:py-3 h-12 md:h-16">
                    <div className="flex flex-col">
                      <span className="text-[9px] md:text-[10px] text-app-secondary line-through leading-none mb-0.5">{activePrice.price} FCFA</span>
                      <span className="text-xs md:text-base font-bold text-app-price-green">{activePrice.pricePromo} FCFA</span>
                    </div>

                    
                    <div className="flex-shrink-0">
                      {isActionLoading ? (
                        <div className="flex items-center justify-center h-6 md:h-8 px-2">
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-app-accent animate-spin" />
                        </div>
                      ) : quantityInCart === 0 ? (
                        <button 
                          onClick={(e) => { e.preventDefault(); handleAddToCart(idPrice); }}
                          className="inline-flex items-center justify-center h-6 md:h-8 rounded-full bg-app-secondary px-3 md:px-4 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 hover:bg-app-accent"
                        >
                          Ajouter
                        </button>
                      ) : (
                        <div className="inline-flex items-center h-6 md:h-8 rounded-full bg-app-accent text-white shadow-sm overflow-hidden">
                          <button 
                            onClick={(e) => { e.preventDefault(); handleDecrement(idPrice); }}
                            className="px-2.5 h-full hover:bg-black/10 transition-colors flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="px-1 text-[10px] md:text-xs font-bold min-w-[16px] text-center">
                            {quantityInCart}
                          </span>
                          <button 
                            onClick={(e) => { e.preventDefault(); handleIncrement(idPrice); }}
                            className="px-2.5 h-full hover:bg-black/10 transition-colors flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
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
  */

'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/src/components/ui/client/SearchBar';
//import { useAuthRole } from '@/src/hooks/useAuthRole';
import { getPromotedProducts } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import Image from 'next/image';
import { 
  Star, Truck, Shield, Heart, ShoppingCart, 
  Image as ImageIcon, Wrench, Paintbrush, ArrowRight, 
  Loader2, AlertCircle 
} from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { panierService } from '@/src/services/PanierService';
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
  { title: 'Niveau laser', quincaillerie: 'Precision Tools', price: '45000 Fcfa' },
];

export default function ClientDashboard() {
  // Retrait de "updateQuantity" non utilisé pour éviter les erreurs ESLint
  const { items } = useCart(); 

  const [promotedProducts, setPromotedProducts] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPromotedProducts();
        setPromotedProducts(data);
      } catch (err) {
        // Gestion de l'erreur plus stricte pour le TypeScript
        const errorMessage = err instanceof Error ? err.message : "Impossible de charger les promotions.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);


  return (
    <div className="p-5 md:p-6 space-y-8 bg-app-surface min-h-screen">
      
      {/* ── EN-TÊTE ÉPURÉ, COMPACT ET STRICTEMENT FIXE ── */}
      <div className="sticky top-0 z-50 bg-app-surface/95 backdrop-blur-xl -mx-5 px-5 py-3 border-b border-app-secondary/20 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-2 max-w-3xl mx-auto">
          
          {/* Textes centrés et réduits */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black text-app-primary tracking-tight">
              Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">Brixel</span>
            </h1>
            <p className="text-xs text-app-secondary font-medium mt-0.5">
              Trouvez les meilleurs matériaux
            </p>
          </div>
          
          {/* Barre de recherche centrée */}
          <div className="w-full max-w-xl px-2">
            <SearchBar />
          </div>
          
        </div>
      </div>

      {/* ── Catégories populaires (STATIQUE) ────────────────────────────────── */}
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

      {/* ── Pour vous (STATIQUE) ───────────────────────────────────────────── */}
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

      {/* ── SECTION PROMOTIONS (API - DYNAMIQUE) ──────────────────────────────── */}
      <PromotionsSection/>

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