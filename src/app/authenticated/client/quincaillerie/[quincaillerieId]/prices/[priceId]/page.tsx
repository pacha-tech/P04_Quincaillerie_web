"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, MapPin, Star, Store, Loader2, Image as ImageIcon, AlertCircle, ArrowRight, ChevronDown, Phone, Map, Info, Search } from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { ProductRecommended } from '@/src/types/ProductRecommended';
import { QuincaillerieDetail } from '@/src/types/QuincaillerieDetail';
import { ProductSearch } from '@/src/types/productSearch';
import { getProductById, getRecommandationByProductAndStore } from '@/src/services/ProductService';
import { getQuincaillerieById } from '@/src/services/QuincaillerieService';

export default function QuincaillerieDetailsPage({ params }: { params: Promise<{ quincaillerieId: string; priceId: string }> }) {
  const { quincaillerieId, priceId } = use(params);
  const { items, addToCart, updateQuantity } = useCart();

  const [product, setProduct] = useState<ProductSearch | null>(null);
  const [storeDetail, setStoreDetail] = useState<QuincaillerieDetail | null>(null);
  const [recommendations, setRecommendations] = useState<ProductRecommended[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  
  // État pour le menu déroulant flottant
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  // État pour la barre de recherche locale
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if(product) return;

      try {
        setIsLoading(true);
        let currentProduct: ProductSearch | null = null;
        const cachedProduct = sessionStorage.getItem('brixel_preloaded_product');
        
        if (cachedProduct) {
          currentProduct = JSON.parse(cachedProduct) as ProductSearch;
        } else {
          currentProduct = await getProductById(priceId);
        }

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
    return () => sessionStorage.removeItem('brixel_preloaded_product');
  }, [quincaillerieId, priceId]);

  const handleAddToCart = async (idPrice: string) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await addToCart(idPrice);
    } catch (e) { console.error(e); } 
    finally { setLoadingActions(prev => ({ ...prev, [idPrice]: false })); }
  };

  const handleQuantity = async (idPrice: string, delta: number) => {
    try {
      setLoadingActions(prev => ({ ...prev, [idPrice]: true }));
      await updateQuantity(idPrice, delta);
    } catch (e) { console.error(e); } 
    finally { setLoadingActions(prev => ({ ...prev, [idPrice]: false })); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <Loader2 className="h-10 w-10 animate-spin text-app-accent mb-4" />
        <span className="text-sm text-app-secondary font-medium tracking-wide">Ouverture de la boutique...</span>
      </div>
    );
  }

  if (error || !product || !storeDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-app-primary font-medium mb-6">{error || "Boutique introuvable"}</p>
        <button onClick={() => window.history.back()} className="px-6 py-3 bg-app-primary text-white rounded-full text-sm font-bold shadow-lg hover:bg-black/80 transition-all">Retour</button>
      </div>
    );
  }

  const mainPrice = product.priceSearchProductsDTO?.find(p => p.idQuincaillerie === quincaillerieId) || product.priceSearchProductsDTO?.[0];
  const isOpen = storeDetail.status?.toLowerCase() === 'ouvert' || storeDetail.status?.toLowerCase() === 'open';
  const storeCartItemsCount = items.filter(item => item.idQuincaillerie === quincaillerieId).length;

  // Logique de filtrage local
  const filteredRecommendations = recommendations.filter(rec => 
    rec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-app-surface min-h-screen pb-24 font-sans text-app-primary relative ">
      
      {/* HEADER FIXE */}
      <header className="bg-app-card/80 backdrop-blur-md sticky top-0 z-50 border-b border-app-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-end">

            <div className="relative"> 
              <Link href={`/authenticated/client/panier/${quincaillerieId}`} className="h-10 w-10 flex items-center justify-center rounded-full bg-app-surface hover:bg-app-accent hover:text-white text-app-primary transition-colors shadow-sm">
                  <ShoppingCart className="h-5 w-5" />
              </Link>
              {storeCartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-app-card shadow-sm">
                  {storeCartItemsCount}
                  </span>
              )}
            </div>
        </div>
      </header>

      <main className="w-full px-4 md:px-8">
        
        <div className="sticky top-16 z-40 bg-app-surface pt-6 pb-6 mb-4 flex flex-col-reverse md:flex-row items-start justify-between gap-6 md:gap-10 border-b border-gray-200/50">
          
          {/* GAUCHE : Produit Principal */}
          {mainPrice && (
            <div className="w-full md:w-[280px] lg:w-[320px] flex-shrink-0 relative">
              <UnifiedCard 
                idPrice={mainPrice.idPrice}
                name={product.name}
                imageUrl={product.imageUrl}
                storeName={storeDetail.name}
                price={mainPrice.price}
                pricePromo={mainPrice.pricePromo}
                inPromo={mainPrice.inPromotion}
                taux={mainPrice.taux?.toString()}
                quantityInCart={items.find(i => i.idPrice === mainPrice.idPrice)?.quantity || 0}
                isActionLoading={loadingActions[mainPrice.idPrice] || false}
                onAdd={() => handleAddToCart(mainPrice.idPrice)}
                onIncrement={() => handleQuantity(mainPrice.idPrice, 1)}
                onDecrement={() => handleQuantity(mainPrice.idPrice, -1)}
                isMain={true}
              />
            </div>
          )}

          {/* DROITE : Boutique */}
          <div className="w-full md:max-w-md relative flex-shrink-0 ml-auto">
            
            {/* Bouton de la Boutique */}
            <button 
              onClick={() => setShowStoreDetails(!showStoreDetails)}
              className={`w-full flex items-center justify-between bg-app-card rounded-3xl p-3 md:p-4 border border-app-surface transition-all duration-300 ${showStoreDetails ? 'ring-2 ring-app-accent/30 shadow-md' : 'shadow-sm hover:shadow-md'}`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl md:rounded-[1.25rem] bg-app-surface flex items-center justify-center overflow-hidden relative border border-app-surface/50">
                  {storeDetail.photoUrl ? (
                      <Image src={storeDetail.photoUrl} alt={storeDetail.name} fill className="object-cover" />
                  ) : (
                      <Store className="h-6 w-6 text-app-secondary" />
                  )}
                </div>
                <div className="text-left flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-sm md:text-base font-bold text-app-primary tracking-tight line-clamp-1">{storeDetail.name}</h2>
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-app-secondary">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> 
                      <span className="font-bold">{storeDetail.averageRating?.toFixed(1) || 'N/A'}</span>
                      <span className="mx-1 text-gray-300">•</span>
                      <span>Voir les détails</span>
                  </div>
                </div>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform duration-500 ${showStoreDetails ? 'rotate-180 bg-app-surface' : 'bg-transparent'}`}>
                  <ChevronDown className="h-5 w-5 text-app-secondary" />
              </div>
            </button>

            {/* OVERLAY : Détails de la boutique */}
            <div className={`absolute top-[80px] right-0 w-full md:w-[120%] transition-all duration-400 origin-top z-50 ${showStoreDetails ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="bg-app-card/95 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-app-surface">
                  <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isOpen ? 'Ouvert' : 'Fermé'}
                      </span>
                  </div>
                  <div className="space-y-3">
                      {storeDetail.description && (
                          <div className="flex gap-3 text-sm text-app-secondary bg-app-surface/50 p-3 rounded-2xl">
                              <Info className="h-4 w-4 text-app-accent flex-shrink-0 mt-0.5" />
                              <p className="leading-relaxed text-xs">{storeDetail.description}</p>
                          </div>
                      )}
                      <div className="flex gap-3 text-sm text-app-secondary items-start bg-app-surface/50 p-3 rounded-2xl">
                          <Map className="h-4 w-4 text-app-accent flex-shrink-0 mt-0.5" />
                          <div className="text-xs">
                              <p className="font-bold text-app-primary">{storeDetail.quartier}, {storeDetail.ville}</p>
                              <p className="text-app-secondary mt-0.5">{storeDetail.region}</p>
                              {storeDetail.precision && <p className="text-app-accent mt-0.5">{storeDetail.precision}</p>}
                          </div>
                      </div>
                      <div className="flex gap-3 text-sm text-app-secondary items-center bg-app-surface/50 p-3 rounded-2xl">
                          <Phone className="h-4 w-4 text-app-accent flex-shrink-0" />
                          <p className="text-sm font-bold text-app-primary">{storeDetail.telephone}</p>
                      </div>
                  </div>
              </div>
            </div>

          </div>
        </div>

        {/* SUGGESTIONS : Zone qui scrolle sous le bloc sticky */}
        <div className="relative z-10 pt-4 pb-10">
          
          {/* En-tête Suggestions + Barre de recherche apposée */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="h-[2px] w-6 bg-app-secondary/20"></span>
              <h3 className="text-xs md:text-sm font-black text-app-secondary/60 tracking-[0.1em] uppercase">
                {searchTerm ? 'Résultats' : 'Suggestions'}
              </h3>
              <span className="text-[10px] md:text-xs text-app-secondary font-medium bg-app-card px-2 py-1 rounded-lg border border-app-surface ml-1">
                {filteredRecommendations.length} {filteredRecommendations.length > 1 ? 'articles' : 'article'}
              </span>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-app-secondary/60" />
              </div>
              <input 
                type="text" 
                placeholder="Chercher dans les suggestions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-app-card border border-app-surface text-app-primary text-xs md:text-sm rounded-full focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent block pl-10 py-2.5 transition-all shadow-sm outline-none"
              />
            </div>
          </div>
          
          {filteredRecommendations.length === 0 ? (
             <div className="bg-app-card rounded-3xl p-10 border border-app-surface text-center shadow-sm">
               <Search className="h-8 w-8 text-app-secondary/30 mx-auto mb-3" />
               <p className="text-app-secondary text-sm font-medium">Aucun produit ne correspond à ta recherche.</p>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
              {filteredRecommendations.map((rec) => {
                const qty = items.find(i => i.idPrice === rec.idPrice)?.quantity || 0;
                const isProc = loadingActions[rec.idPrice] || false;

                return (
                  <UnifiedCard 
                    key={rec.idPrice}
                    idPrice={rec.idPrice}
                    name={rec.name}
                    imageUrl={rec.imageUrl}
                    storeName={storeDetail.name}
                    price={rec.price}
                    pricePromo={rec.pricePromo}
                    inPromo={rec.inPromo}
                    taux={rec.taux?.toString()}
                    quantityInCart={qty}
                    isActionLoading={isProc}
                    onAdd={() => handleAddToCart(rec.idPrice)}
                    onIncrement={() => handleQuantity(rec.idPrice, 1)}
                    onDecrement={() => handleQuantity(rec.idPrice, -1)}
                    isMain={false}
                  />
                );
              })}
            </div>
          )}
        </div>

      </main>
      
      {/* Backdrop sombre si le menu boutique est ouvert */}
      {showStoreDetails && (
        <div className="fixed inset-0 bg-black/5 z-30 transition-opacity" onClick={() => setShowStoreDetails(false)}></div>
      )}
    </div>
  );
}

// --- COMPOSANT DE CARTE UNIFIÉ (Design Original Restauré) ---
interface UnifiedCardProps {
  idPrice: string;
  name: string;
  imageUrl?: string;
  storeName: string;
  price: number;
  pricePromo: number;
  inPromo?: boolean;
  taux?: string;
  quantityInCart: number;
  isActionLoading: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  isMain?: boolean;
}

function UnifiedCard({
  name, imageUrl, storeName, price, pricePromo, inPromo, taux,
  quantityInCart, isActionLoading, onAdd, onIncrement, onDecrement, isMain
}: UnifiedCardProps) {
  
  // Rendre le "Main" légèrement plus grand et l'identifier visuellement
  const cardScaleClass = isMain ? 'md:scale-[1.02] ring-1 ring-app-primary/10' : '';

  return (
    <div className={`group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${cardScaleClass}`}>
      
      {inPromo && (
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 rounded-full bg-app-accent px-2 py-0.5 text-[9px] md:text-xs font-bold text-app-card shadow-sm">
          -{taux}%
        </div>
      )}

      <div className="p-2.5 md:p-4">
        {/* L'image de ton design */}
        <div className={`relative mx-auto mb-2 md:mb-3 flex ${isMain ? 'h-32 md:h-40' : 'h-20 md:h-28'} w-auto items-center justify-center rounded-xl md:rounded-3xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30 overflow-hidden`}>
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={name} 
              fill 
              sizes="(max-width: 768px) 100px, 150px"
              className="object-cover" 
            />
          ) : (
            <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-app-secondary" />
          )}
        </div>
        <h3 className={`${isMain ? 'text-sm md:text-lg' : 'text-xs md:text-base'} font-semibold text-app-primary mb-0.5 md:mb-1 line-clamp-1`}>{name}</h3>
        <p className="text-[9px] md:text-xs text-app-secondary/70 line-clamp-1">{storeName}</p>
      </div>

      <div className={`flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-4 md:py-3 ${isMain ? 'h-14 md:h-20' : 'h-12 md:h-16'}`}>
        <div className="flex flex-col">
          {inPromo && (
            <span className="text-[9px] md:text-[10px] text-app-secondary line-through leading-none mb-0.5">{price} FCFA</span>
          )}
          <span className={`${isMain ? 'text-sm md:text-xl' : 'text-xs md:text-base'} font-bold text-app-price-green`}>
            {inPromo ? pricePromo : price} FCFA
          </span>
        </div>

        <div className="flex-shrink-0">
          {isActionLoading ? (
            <div className="flex items-center justify-center h-6 md:h-8 px-2">
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-app-accent animate-spin" />
            </div>
          ) : quantityInCart === 0 ? (
            <button 
              onClick={(e) => { e.preventDefault(); onAdd(); }}
              className={`inline-flex items-center justify-center ${isMain ? 'h-8 md:h-10 px-4 md:px-5 text-xs' : 'h-6 md:h-8 px-3 md:px-4 text-[9px] md:text-xs'} rounded-full bg-app-secondary font-semibold text-app-card transition-all duration-300 hover:bg-app-accent cursor-pointer`}
            >
              Ajouter
            </button>
          ) : (
            <div className={`inline-flex items-center ${isMain ? 'h-8 md:h-10' : 'h-6 md:h-8'} rounded-full bg-app-accent text-white shadow-sm overflow-hidden`}>
              <button 
                onClick={(e) => { e.preventDefault(); onDecrement(); }}
                className="px-2.5 h-full hover:bg-black/10 transition-colors flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="px-1 text-[10px] md:text-xs font-bold min-w-[16px] text-center">
                {quantityInCart}
              </span>
              <button 
                onClick={(e) => { e.preventDefault(); onIncrement(); }}
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
}