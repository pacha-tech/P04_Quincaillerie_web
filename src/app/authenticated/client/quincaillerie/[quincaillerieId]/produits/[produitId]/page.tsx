"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, MapPin, Star, Store, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { ProductRecommended } from '@/src/types/ProductRecommended';
import { QuincaillerieDetail } from '@/src/types/QuincaillerieDetail';
import { ProductSearch } from '@/src/types/productSearch';
import { getProductById, getRecommandationByProductAndStore } from '@/src/services/ProductService';
import { getQuincaillerieById } from '@/src/services/QuincaillerieService';

export default function QuincaillerieDetailsPage({ params }: { params: Promise<{ quincaillerieId: string; productId: string }> }) {
  // L'URL contient maintenant l'ID de la quincaillerie ET du produit
  const { quincaillerieId, productId } = use(params);

  const { items, addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState<ProductSearch | null>(null);
  const [storeDetail, setStoreDetail] = useState<QuincaillerieDetail | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommended[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if(product) return;

      try {
        setIsLoading(true);
        let currentProduct: ProductSearch | null = null;
        
        const cachedProduct = sessionStorage.getItem('brixel_preloaded_product');
        
        if (cachedProduct) {
            console.log("Produit préchargé trouvé en cache, utilisation de celui-ci.");
          currentProduct = JSON.parse(cachedProduct) as ProductSearch;
          console.log("Produit utilisé depuis le cache :", currentProduct);
          
        } else {
            console.log("Aucun produit préchargé en cache, récupération via API.");
          currentProduct = await getProductById(productId);
        }

    

        // 2. RÉCUPÉRATION DES AUTRES DONNÉES VIA LES SERVICES
        // On utilise 'currentProduct.idProduct' de manière totalement sécurisée
        if (currentProduct) {
            
          setProduct(currentProduct);

          const [storeData, recoData] = await Promise.all([
            getQuincaillerieById(quincaillerieId),
            getRecommandationByProductAndStore(currentProduct.idProduct, quincaillerieId)
          ]);
          
          setStoreDetail(storeData);
          setRecommendations(recoData);
        }

      } catch (err: any) {
        setError(err.message || "Impossible de charger les données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
        console.log("Nettoyage du cache au démontage de la page");
        sessionStorage.removeItem('brixel_preloaded_product');
    };

  }, [quincaillerieId, productId]);

  // --- HANDLERS PANIER (Restés identiques à ta demande) ---
  const handleAddToCart = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await addToCart(idPrice);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  const handleQuantity = async (idPrice: string, delta: number) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await updateQuantity(idPrice, delta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActions(prev => ({ ...prev, [idPrice]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <Loader2 className="h-10 w-10 animate-spin text-app-accent mb-4" />
        <span className="text-sm text-app-secondary font-medium">Chargement de la boutique...</span>
      </div>
    );
  }

  if (error || !product || !storeDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-4">{error || "Boutique introuvable"}</p>
        <button onClick={() => window.history.back()} className="px-4 py-2 bg-app-accent text-white rounded-full text-sm font-bold">Retour</button>
      </div>
    );
  }

  const mainPrice = product.priceSearchProductsDTO?.find(p => p.idQuincaillerie === quincaillerieId) || product.priceSearchProductsDTO?.[0];
  const isOpen = storeDetail.status?.toLowerCase() === 'ouvert' || storeDetail.status?.toLowerCase() === 'open';
  const storeCartItemsCount = items.filter(item => item.idQuincaillerie === quincaillerieId).length;

  return (
    <div className="bg-app-surface min-h-screen pb-24">
      {/* HEADER */}
      <header className="bg-app-card shadow-sm sticky top-0 z-50 border-b border-app-surface">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-app-surface text-app-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-bold text-lg md:text-xl text-app-primary line-clamp-1">{storeDetail.name}</h1>
          </div>
          
          <div className="relative">
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-app-surface text-app-primary hover:bg-app-accent hover:text-white transition-colors">
              <ShoppingCart className="h-5 w-5" />
            </button>
            {storeCartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-app-card">
                {storeCartItemsCount}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* INFO STORE */}
        <div className="bg-app-card rounded-3xl p-5 md:p-6 shadow-sm border border-app-surface flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8">
          <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-app-surface flex-shrink-0 border border-app-surface/50">
            {storeDetail.photoUrl ? (
              <Image src={storeDetail.photoUrl} alt={storeDetail.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Store className="h-8 w-8 text-app-secondary" /></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg md:text-xl font-bold text-app-primary">{storeDetail.name}</h2>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isOpen ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-app-secondary">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {storeDetail.quartier}, {storeDetail.ville}</span>
              <span className="hidden md:block">•</span>
              <span className="flex items-center gap-1 font-bold text-yellow-600"><Star className="h-4 w-4 fill-yellow-600" /> {storeDetail.averageRating?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* PRODUIT PRINCIPAL */}
        {mainPrice && (
          <div className="mb-10">
            <h3 className="text-xs font-black text-app-secondary/60 tracking-[0.15em] mb-4 uppercase">Produit recherché</h3>
            <div className="bg-app-card rounded-3xl p-4 md:p-6 shadow-sm border border-app-surface flex items-center gap-4 md:gap-6">
              <div className="relative h-20 w-20 md:h-28 md:w-28 rounded-2xl overflow-hidden bg-app-surface flex-shrink-0 border border-app-surface">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-8 w-8 text-app-secondary" /></div>
                )}
                {mainPrice.inPromotion && (
                  <div className="absolute top-0 left-0 bg-app-accent px-2 py-1 text-[10px] font-bold text-white rounded-br-lg">
                    -{mainPrice.taux}%
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm md:text-lg font-bold text-app-primary mb-1 md:mb-2">{product.name}</h4>
                <div className="flex flex-wrap items-end gap-2 md:gap-3 mb-1">
                  <span className="text-lg md:text-2xl font-black text-app-price-green leading-none">
                    {(mainPrice.inPromotion ? mainPrice.pricePromo : mainPrice.price).toFixed(0)} FCFA
                  </span>
                  {mainPrice.inPromotion && (
                    <span className="text-xs md:text-sm text-app-secondary line-through mb-0.5">{mainPrice.price.toFixed(0)} FCFA</span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-app-secondary/80 italic">{mainPrice.stock} {product.unite}s en stock</p>
              </div>

              <div className="flex-shrink-0 w-24 md:w-32">
                <CartButton 
                  quantity={items.find(i => i.idPrice === mainPrice.idPrice)?.quantity || 0}
                  isProcessing={loadingActions[mainPrice.idPrice] || false}
                  onAdd={() => handleAddToCart(mainPrice.idPrice)}
                  onIncrement={() => handleQuantity(mainPrice.idPrice, 1)}
                  onDecrement={() => handleQuantity(mainPrice.idPrice, -1)}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUGGESTIONS */}
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h3 className="text-xs font-black text-app-secondary/60 tracking-[0.15em] uppercase">Suggestions</h3>
          <button className="text-xs font-bold text-app-accent hover:underline">Voir tout</button>
        </div>
        
        {recommendations.length === 0 ? (
           <p className="text-app-secondary text-sm italic text-center py-10">Aucune suggestion disponible.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {recommendations.map((rec) => {
              const qty = items.find(i => i.idPrice === rec.idPrice)?.quantity || 0;
              const isProc = loadingActions[rec.idPrice] || false;

              return (
                <div key={rec.idPrice} className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  {rec.inPromo && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 rounded-full bg-app-accent px-2 py-0.5 text-[9px] md:text-xs font-bold text-app-card shadow-sm">
                      -{rec.taux}%
                    </div>
                  )}
                  
                  <div className="p-2.5 md:p-4">
                    <div className="relative mx-auto mb-2 md:mb-3 flex h-24 md:h-32 w-full items-center justify-center rounded-xl bg-app-surface overflow-hidden border border-app-surface/50">
                      {rec.imageUrl ? (
                        <Image src={rec.imageUrl} alt={rec.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-app-secondary" />
                      )}
                    </div>
                    <h4 className="text-xs md:text-sm font-semibold text-app-primary mb-0.5 line-clamp-1">{rec.name}</h4>
                    <p className="text-[9px] md:text-xs text-app-secondary/70 italic line-clamp-1 mb-2">{rec.stock} {rec.unite}s dispo</p>
                    
                    <div className="flex flex-col mb-3">
                      <span className="text-[10px] text-app-secondary line-through leading-none min-h-[10px] mb-0.5">
                        {rec.inPromo ? `${rec.price} FCFA` : ''}
                      </span>
                      <span className="text-xs md:text-sm font-black text-app-price-green">
                        {(rec.inPromo ? rec.pricePromo : rec.price).toFixed(0)} FCFA
                      </span>
                    </div>

                    <CartButton 
                      quantity={qty}
                      isProcessing={isProc}
                      onAdd={() => handleAddToCart(rec.idPrice)}
                      onIncrement={() => handleQuantity(rec.idPrice, 1)}
                      onDecrement={() => handleQuantity(rec.idPrice, -1)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANT BOUTON PANIER ---
function CartButton({ quantity, isProcessing, onAdd, onIncrement, onDecrement }: { 
  quantity: number, 
  isProcessing: boolean, 
  onAdd: () => void, 
  onIncrement: () => void, 
  onDecrement: () => void 
}) {
  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-8 md:h-10 w-full bg-app-surface rounded-full">
        <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-app-accent animate-spin" />
      </div>
    );
  }

  if (quantity === 0) {
    return (
      <button 
        onClick={(e) => { e.preventDefault(); onAdd(); }}
        className="w-full h-8 md:h-10 rounded-full bg-app-secondary text-[10px] md:text-xs font-semibold text-white transition-all duration-300 hover:bg-app-accent"
      >
        Ajouter
      </button>
    );
  }

  return (
    <div className="w-full h-8 md:h-10 flex items-center justify-between rounded-full bg-app-accent text-white shadow-sm overflow-hidden px-1">
      <button 
        onClick={(e) => { e.preventDefault(); onDecrement(); }}
        className="w-8 h-full flex items-center justify-center font-bold text-lg hover:bg-black/10 rounded-full transition-colors"
      >
        -
      </button>
      <span className="text-xs md:text-sm font-bold w-6 text-center">
        {quantity}
      </span>
      <button 
        onClick={(e) => { e.preventDefault(); onIncrement(); }}
        className="w-8 h-full flex items-center justify-center font-bold text-lg hover:bg-black/10 rounded-full transition-colors"
      >
        +
      </button>
    </div>
  );
}