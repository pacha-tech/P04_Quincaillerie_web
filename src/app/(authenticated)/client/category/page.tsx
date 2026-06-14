'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocation } from '@/src/hooks/LocationContext';
import { categoryService } from '@/src/services/CategoryService';
import { Category } from '@/src/types/Category';
import { ProductInCategory } from '@/src/types/ProductInCategory';
import ProductCard from '@/src/components/ui/client/ProductCard';
import { 
  MapPin, Building2, Map, Loader2, 
  Search, ServerCrash, LayoutGrid 
} from 'lucide-react';

const SCOPE_OPTIONS = [
  { id: '100m', label: '100m', icon: MapPin },
  { id: '500m', label: '500m', icon: MapPin },
  { id: '1km', label: '1 km', icon: MapPin },
  { id: '5km', label: '5 km', icon: MapPin }, 
  { id: 'ville', label: 'ville', icon: Building2 },
  { id: 'region', label: 'région', icon: Map },
];

// ─── PAGE PRINCIPALE UNIFIÉE ───
export default function MarketplacePage() {
  const { latitude, longitude, loading: locationLoading } = useLocation(); 
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get('categoryId');
  
  // États Catégories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categoryIdFromUrl);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>(''); // Recherche catégories
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);


  // États Produits & Filtres
  const [activeScope, setActiveScope] = useState<string>('5km');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<ProductInCategory[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Sécurité anti-fuite de mémoire

    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setCategoryError(null);
        
        const data = await categoryService.getAllCategory();
        
        if (!isMounted) return;
        
        setCategories(data);
    
        
        if (!categoryIdFromUrl && !selectedCategoryId && data.length > 0) {
          setSelectedCategoryId(data[0].idCategory);
        }
        
      } catch (err: any) {
        if (isMounted) setCategoryError("Impossible de charger les catégories. Veuillez vérifier votre connexion.");
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    };
    
    fetchCategories();

    return () => { isMounted = false; };
  }, []);


  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      if (!selectedCategoryId || locationLoading) return;
      
      setIsLoadingProducts(true);
      setProductError(null);

      try {
        const data = await categoryService.getProductsByCategory(
          selectedCategoryId, latitude || null, longitude || null, activeScope
        );
        
        if (isMounted) setProducts(data);
      } catch (err: any) {
        if (isMounted) setProductError("Oups, impossible de charger les produits de cette catégorie.");
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }
    };
    
    fetchCategoryProducts();

    return () => { isMounted = false; };
  }, [selectedCategoryId, activeScope, latitude, longitude, locationLoading]);

  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[#F8F9FB]">
      
      {/* ── SIDEBAR (DÉFILANTE & BARRES MASQUÉES) ── */}
      <aside className="w-full lg:w-70 lg:flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 lg:h-full flex flex-col z-30">
        
        {/* En-tête Sidebar + Barre de recherche catégories */}
        <div className="p-4 border-b border-neutral-100 flex flex-col gap-3 flex-shrink-0">
          <h2 className="text-xl font-bold text-app-primary hidden lg:flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-app-accent" />
            Catégories
          </h2>
          
          {/* Barre de recherche pour catégories */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-app-secondary/50" />
            </div>
            <input
              type="text"
              placeholder="Chercher une catégorie..."
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F9FB] border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-app-primary/20 focus:border-app-primary transition-all shadow-sm placeholder:text-app-secondary/50 text-app-primary font-medium"
            />
          </div>
        </div>
        
        {/* Zone de défilement des catégories (Zéro barre visible) */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden p-2 lg:p-4 gap-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1">
          {isLoadingCategories ? (
             [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
               <div key={n} className="flex-shrink-0 w-32 lg:w-full h-11 lg:h-12 bg-neutral-100 rounded-xl animate-pulse"></div>
             ))
          ) : categoryError ? (
             <div className="text-red-500 text-xs p-4 text-center w-full">{categoryError}</div>
          ) : filteredCategories.length === 0 ? (
             <div className="text-app-secondary text-xs p-4 text-center w-full">Aucun résultat</div>
          ) : (
            filteredCategories.map((category) => {
              const isActive = selectedCategoryId === category.idCategory;
              return (    
                <button
                  key={category.idCategory}
                  onClick={() => {
                    
                    categoryService.trackCategory({
                      idCategory: category.idCategory,
                      actionType: "VIEW_CAT"
                    });
                    
                    setSelectedCategoryId(category.idCategory);
                    setSearchQuery(''); 
                  }}
                  className={`snap-start flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-left border cursor-pointer ${
                    isActive 
                      ? 'bg-app-accent text-white border-app-accent shadow-md shadow-app-accent/20' 
                      : 'bg-white text-app-primary border-neutral-100 hover:border-app-accent/30 hover:bg-neutral-50'
                  }`}
                >
                  <span className="font-semibold text-xs lg:text-sm line-clamp-1">{category.name}</span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── SECTION PRODUITS (FIXE EN HAUT, PRODUITS COMPLÈTEMENT DÉFILANTS) ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Header complètement fixe (Recherche & Filtres) */}
        <header className="flex-shrink-0 bg-[#F8F9FB]/90 backdrop-blur-xl border-b border-neutral-200/50 p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Barre de Recherche des produits */}
            <div className="relative w-full lg:max-w-md flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-app-secondary/50" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un produit dans cette catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-app-primary/20 focus:border-app-primary transition-all shadow-sm placeholder:text-app-secondary/40 text-app-primary font-medium"
              />
            </div>

            {/* Filtres de distance */}
            <div className="flex gap-2 overflow-x-auto pb-1 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-auto">
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
        </header>

        {/* Zone de défilement de la grille produits (Barre masquée) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {locationLoading && (
            <div className="flex items-center gap-3 text-sm font-medium text-app-secondary p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm w-fit mb-6 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-app-accent" />
              Ajustement des coordonnées GPS...
            </div>
          )}

          {productError && !isLoadingProducts && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto mt-10">
              <div className="p-3 bg-red-100 text-red-500 rounded-full"><ServerCrash className="h-8 w-8" /></div>
              <div>
                <h3 className="text-red-800 font-bold text-lg">Oups, une erreur est survenue</h3>
                <p className="text-red-600/80 text-sm mt-1">{productError}</p>
              </div>
            </div>
          )}

          {!productError && (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
              
              {/* Chargement squelette des produits */}
              {isLoadingProducts && [1, 2, 3, 4, 5, 6, 7, 8 , 9 , 10 , 11 , 12 , 13 , 14 , 15].map((n) => (
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

              {/* Affichage des produits */}
              {!isLoadingProducts && filteredProducts.length > 0 && filteredProducts.map((product) => (
                 <ProductCard 
                   key={product.idPrice}
                   idPrice={product.idPrice}
                   idQuincaillerie={product.idQuincaillerie}
                   name={product.name}
                   quincaillerieName={product.quincaillerieName}
                   imageUrl={product.imageUrl}
                   price={product.sellPrice}
                   pricePromo={product.pricepromo}
                   inPromotion={product.inPromotion}
                   taux={product.taux}
                   stock={product.stock}
                   latitudeQuincaillerie={product.latitudeQuincaillerie}
                   longitudeQuincaillerie={product.longitudeQuincaillerie}
                 />
              ))}

              {/* Aucun résultat de recherche produit */}
              {!isLoadingProducts && products.length > 0 && filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <Search className="h-10 w-10 text-app-secondary/30 mx-auto mb-4" />
                  <p className="text-base font-bold text-app-primary">Aucun résultat pour "{searchQuery}"</p>
                  <button onClick={() => setSearchQuery('')} className="mt-3 text-sm text-app-accent font-semibold hover:underline">
                    Effacer la recherche
                  </button>
                </div>
              )}

              {/* Aucun produit du tout dans le rayon */}
              {!isLoadingProducts && products.length === 0 && !locationLoading && selectedCategoryId && (
                 <div className="col-span-full py-20 text-center">
                   <MapPin className="h-10 w-10 text-app-secondary/30 mx-auto mb-4" />
                   <p className="text-base font-bold text-app-primary">Aucun produit dans ce rayon</p>
                   <p className="text-sm text-app-secondary mt-1">Sélectionnez une autre catégorie ou augmentez la distance.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}