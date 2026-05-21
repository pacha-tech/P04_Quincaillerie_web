
{/*
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocation } from '@/src/hooks/LocationContext';
import { useCart } from '@/src/hooks/CartContext';
import { categoryService } from '@/src/services/CategoryService';
import { ProductInCategory } from '@/src/types/ProductInCategory';
import { calculateDistance } from '@/src/utils/Distance';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, MapPin, Building2, Map, Loader2, Image as ImageIcon, 
  Search, RefreshCcw, ServerCrash, Store, Package, ArrowRight 
} from 'lucide-react';

const SCOPE_OPTIONS = [
  { id: '100m', label: '100m', icon: MapPin },
  { id: '500m', label: '500m', icon: MapPin },
  { id: '1km', label: '1 km', icon: MapPin },
  { id: '5km', label: '5 km', icon: MapPin }, 
  { id: 'ville', label: 'ville', icon: Building2 },
  { id: 'region', label: 'région', icon: Map },
];

// ─── SOUS-COMPOSANT CARD (Reprend exactement ton style) ───
function CategoryProductCard({ 
    product, 
    userLocation 
}: { 
    product: ProductInCategory; 
    userLocation: { latitude: number | null; longitude: number | null } 
}) {
    const { items, addToCart, updateQuantity } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const availableStock = product.stock ?? 0;
    const cartItem = items?.find(item => item.idPrice === product.idPrice);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    // Adaptation des noms de variables selon ton backend
    const price = product.sellPrice || 0;
    const pricePromo = product.pricepromo || 0;

    const getDistanceLabel = () => {
        if (userLocation.latitude && userLocation.longitude && product.latitudeQuincaillerie && product.longitudeQuincaillerie) {
            const dist = calculateDistance(
                Number(userLocation.latitude), 
                Number(userLocation.longitude),
                Number(product.latitudeQuincaillerie), 
                Number(product.longitudeQuincaillerie)
            );
            if (dist < 1) {
                return `${Math.round(dist * 1000)} m`
            }
            return `${dist} km`;
        }
        return "...";
    };

    const handleViewProduct = () => {
        sessionStorage.setItem('brixel_preloaded_product', JSON.stringify(product));
        router.push(`/client/quincaillerie/${product.quincaillerieName}/prices/${product.idPrice}`);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (availableStock <= 0){
            toast.error("Stock de " + product.name + " épuisé");
            return;
        } 

        try {
            setIsLoading(true);
            await addToCart(product.idPrice);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'ajout au panier");
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (quantityInCart >= availableStock) {
            toast.error("Stock de " + product.name + " épuisé");
            return; 
        }

        try {
            setIsLoading(true);
            await updateQuantity(product.idPrice, 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsLoading(true);
            await updateQuantity(product.idPrice, -1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]">
            
            <button 
                onClick={handleViewProduct}
                className="absolute top-3 right-2.5 md:top-4 md:right-3.5 z-20 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[11px] font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer"
            >
                Voir <ArrowRight className="h-3 w-3" />
            </button>

            <div 
                className="absolute inset-0 z-10 md:hidden cursor-pointer"
                onClick={handleViewProduct}
            />
            
            <div className="relative z-0 p-2.5 md:p-3.5">
                <div className="relative mx-auto mb-2 md:mb-2.5 flex h-24 md:h-32 w-full items-center justify-center rounded-lg md:rounded-xl bg-[#F8F9FB] transition-all duration-300 group-hover:scale-102 border border-dashed border-neutral-200 overflow-hidden">
                    {product.imageUrl ? (
                        <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            fill 
                            className="object-cover mix-blend-multiply p-2" 
                        />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-app-secondary/30" />
                    )}
                    {product.inPromotion && (
                        <div className="absolute top-1.5 left-1.5 bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold z-10 shadow-sm">
                            -{product.taux}%
                        </div>
                    )}
                </div>

                <h3 className="text-xs md:text-sm font-bold text-app-primary mb-1 md:mb-1.5 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                <p className="flex items-center text-[11px] md:text-xs font-medium text-app-secondary mb-1 line-clamp-1">
                    <Store className="h-3 w-3 mr-1 shrink-0 text-app-accent" />
                    {product.quincaillerieName || 'Quincaillerie'}
                </p>

                <div className="flex flex-wrap items-center gap-1 md:gap-1.5 text-[9px] md:text-[11px] text-app-secondary mb-0.5 md:mb-1">
                    <span className="flex items-center gap-0.5 bg-[#F8F9FB] px-1.5 py-0.5 rounded text-amber-500 font-medium shrink-0">
                        ⭐ 4.5
                    </span>
                    <span className="flex items-center gap-0.5 bg-[#F8F9FB] px-1.5 py-0.5 rounded shrink-0">
                        <MapPin className="h-2.5 w-2.5 text-app-secondary" /> {getDistanceLabel()}
                    </span>
                    <span className={`flex items-center gap-1 bg-[#F8F9FB] px-1.5 py-0.5 rounded shrink-0 ${availableStock <= 0 ? 'text-red-500 font-semibold' : ''}`}>
                        <Package className="h-2.5 w-2.5" /> 
                        {availableStock <= 0 ? 'Épuisé' : `${availableStock} dispo`}
                    </span>
                </div>
            </div>
            
            <div className="relative z-20 flex items-center justify-between border-t border-app-surface bg-[#F8F9FB]/50 px-2.5 py-2 md:px-3.5 md:py-2.5 mt-auto">
                <div className="flex flex-col">
                    {product.inPromotion ? (
                        <>
                            <span className="text-[9px] md:text-[10px] text-app-secondary line-through leading-none mb-0.5">{price} FCFA</span>
                            <span className="text-xs md:text-base font-bold text-app-primary">{pricePromo} FCFA</span>
                        </>
                    ) : (
                        <span className="text-xs md:text-base font-bold text-app-primary">{price} FCFA</span>
                    )}
                </div>
                
                <div className="flex-shrink-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-7 md:h-8.5 px-2">
                            <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-app-accent animate-spin" />
                        </div>
                    ) : availableStock <= 0 ? (
                        <span className="inline-flex items-center justify-center h-7 md:h-8.5 rounded-full bg-gray-200/60 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-400 cursor-not-allowed">
                            Rupture
                        </span>
                    ) : quantityInCart === 0 ? (
                        <button 
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center h-7 md:h-8.5 rounded-full bg-app-primary px-3 md:px-4 text-[10px] md:text-xs font-semibold text-white transition-all duration-300 hover:bg-app-accent cursor-pointer shadow-sm hover:shadow-md"
                        >
                            Ajouter
                        </button>
                    ) : (
                        <div className="inline-flex items-center h-7 md:h-8.5 rounded-full bg-app-accent text-white shadow-sm overflow-hidden border border-app-accent">
                            <button 
                                onClick={handleDecrement}
                                className="px-2 md:px-3 h-full hover:bg-black/10 transition-colors flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer"
                            >
                                -
                            </button>
                            <span className="px-1 md:px-1.5 text-[10px] md:text-xs font-bold min-w-[16px] text-center">
                                {quantityInCart}
                            </span>
                            <button 
                                onClick={handleIncrement}
                                className="px-2 md:px-3 h-full transition-colors flex items-center justify-center text-xs md:text-sm font-bold hover:bg-black/10 cursor-pointer"
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

// ─── PAGE PRINCIPALE ───
export default function CategoryDetailsPage() {
  const params = useParams();
  const categoryId = params.idCategory as string;
  
  const { latitude, longitude, loading: locationLoading } = useLocation(); 
  
  const [activeScope, setActiveScope] = useState<string>('5km');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<ProductInCategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryProducts = async () => {
    if (locationLoading) return;
    
    setIsLoadingProducts(true);
    setError(null);

    try {
      const data = await categoryService.getProductsByCategory(
        categoryId,
        latitude || null,
        longitude || null,
        activeScope
      );
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les produits.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId, activeScope, latitude, longitude, locationLoading]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto px-4 md:px-8 pt-6 pb-20 space-y-4 bg-[#F8F9FB] min-h-screen">
      
      
      <div className="flex items-center gap-3 mb-2">
        <Link 
          href="/client/categories" 
          className="md:hidden p-2 rounded-xl bg-white text-app-secondary hover:bg-app-accent hover:text-white transition-all shadow-sm border border-neutral-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-app-primary tracking-tight">
            Produits de la catégorie
          </h1>
          <p className="text-xs md:text-sm text-app-secondary font-medium mt-1">
            Découvrez le matériel disponible autour de vous
          </p>
        </div>
      </div>

      
      <div className="sticky top-0 z-40 bg-[#F8F9FB]/90 backdrop-blur-xl border-b border-neutral-200/50 py-3 -mx-4 px-4 md:-mx-8 md:px-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-72 flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-app-secondary/50" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/20 focus:border-app-primary transition-all shadow-sm placeholder:text-app-secondary/40 text-app-primary font-medium"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full lg:w-auto">
            {SCOPE_OPTIONS.map((scope) => {
              const isActive = activeScope === scope.id;
              return (
                <button
                  key={scope.id}
                  onClick={() => setActiveScope(scope.id)}
                  className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    isActive 
                      ? 'bg-app-primary text-white border-app-primary shadow-md shadow-app-primary/10' 
                      : 'bg-white text-app-secondary border-neutral-200 hover:border-app-secondary/40 hover:bg-neutral-50'
                  }`}
                >
                  <scope.icon className={`h-4 w-4 ${isActive ? 'text-app-accent' : 'text-app-secondary/60'}`} />
                  {scope.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      
      <div className="pt-2">
        {locationLoading && (
          <div className="flex items-center gap-3 text-sm font-medium text-app-secondary p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm max-w-sm mb-6 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-app-accent" />
            Ajustement des coordonnées GPS...
          </div>
        )}

        {error && !isLoadingProducts && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-10">
            <div className="p-3 bg-red-100 text-red-500 rounded-full">
              <ServerCrash className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-red-800 font-bold text-lg">Oups, une erreur est survenue</h3>
              <p className="text-red-600/80 text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={fetchCategoryProducts}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors active:scale-95"
            >
              <RefreshCcw className="h-4 w-4" /> Réessayer
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            
            
            {isLoadingProducts && [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-neutral-100 p-3 space-y-3 shadow-sm animate-pulse">
                <div className="w-full h-24 md:h-32 bg-[#F8F9FB] rounded-xl"></div>
                <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-5 bg-neutral-100 rounded w-1/3"></div>
                  <div className="h-7 bg-neutral-100 rounded-full w-16"></div>
                </div>
              </div>
            ))}

           
            {!isLoadingProducts && filteredProducts.length > 0 && filteredProducts.map((product) => (
               <CategoryProductCard 
                  key={product.idPrice} 
                  product={product} 
                  userLocation={{ latitude, longitude }} 
               />
            ))}

           
            {!isLoadingProducts && products.length > 0 && filteredProducts.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <Search className="h-10 w-10 text-app-secondary/30 mx-auto mb-4" />
                <p className="text-base font-bold text-app-primary">Aucun résultat pour "{searchQuery}"</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-sm text-app-accent font-semibold hover:underline"
                >
                  Effacer la recherche
                </button>
              </div>
            )}

          
            {!isLoadingProducts && products.length === 0 && (
               <div className="col-span-full py-16 text-center">
                 <MapPin className="h-10 w-10 text-app-secondary/30 mx-auto mb-4" />
                 <p className="text-base font-bold text-app-primary">Aucun produit dans ce rayon</p>
                 <p className="text-sm text-app-secondary mt-1">Augmentez la distance ou changez de catégorie.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
  */}