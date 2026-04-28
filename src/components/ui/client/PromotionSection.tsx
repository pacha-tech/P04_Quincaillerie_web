'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { getPromotedProducts } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';

export default function PromotionsSection() {
  const { items, addToCart , updateQuantity } = useCart();
  const router = useRouter();

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

  const handleViewProduct = (product: ProductSearch, idQuincaillerie: string) => {
    // 1. On stocke tout l'objet produit en cache session
    sessionStorage.setItem('brixel_preloaded_product', JSON.stringify(product));
    
    // 2. On navigue vers la page
    router.push(`/authenticated/client/quincaillerie/${idQuincaillerie}/prices/${product.priceSearchProductsDTO[0].idPrice}`);
  };

  const handleAddToCart = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await addToCart(idPrice);
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
      await updateQuantity(idPrice , 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  const handleDecrement = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await updateQuantity(idPrice , -1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  return (
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
            const activePrice = product.priceSearchProductsDTO.find(p => p.inPromotion) || product.priceSearchProductsDTO[0];
            const idPrice = activePrice.idPrice;

            const cartItem = items?.find(item => item.idPrice === idPrice);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            const isActionLoading = loadingActions[idPrice] || false;

            return (
              <div key={product.idProduct} className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
                <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10 rounded-full bg-app-accent px-2 py-0.5 text-[9px] md:text-xs font-bold text-app-card shadow-sm">
                  -{activePrice.taux}%
                </div>
                <button onClick={() => handleViewProduct(product, activePrice.idQuincaillerie)} className="absolute top-2 right-2 md:top-5 md:right-5 z-10 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer">
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
                        className="inline-flex items-center justify-center h-6 md:h-8 rounded-full bg-app-secondary px-3 md:px-4 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 hover:bg-app-accent cursor-pointer"
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
  );
}