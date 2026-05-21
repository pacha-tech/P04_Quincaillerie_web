'use client';

import { useState, useEffect, useRef} from 'react';
import Link from 'next/link';
import { 
  Search, Plus, RotateCw, SlidersHorizontal, MoreVertical, 
  Package, Edit3, Trash2, Check, X, AlertCircle, ImageOff, LayoutGrid, ListFilter, Eye,
  WifiOff, Loader2
} from 'lucide-react';
import { ProductStock } from '@/src/types/ProductStock';
import { productService } from '@/src/services/ProductService';
import { useRouter } from 'next/navigation';

export default function StockPage() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [products, setProducts] = useState<ProductStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vue : 'produits' ou 'quincaillerie'
  const [currentView, setCurrentView] = useState<'produits' | 'quincaillerie'>('produits');

  // Catégorie / Quincaillerie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [sortOption, setSortOption] = useState("Date d'ajout");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [fullImage, setFullImage] = useState<{ url: string; name: string } | null>(null);

  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeMenu !== null && !Object.values(menuRefs.current).some(ref => ref && ref.contains(event.target as Node))) {
        setActiveMenu(null);
      }
      if (showFilterMenu) {
        setShowFilterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu, showFilterMenu]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await productService.getProductsByQuincaillerie();

      const products: ProductStock[] = response.map(item => ({
        idPrice: item.idPrice,
        name: item.name,
        brand: item.brand,
        category: item.category,
        sellPrice: item.sellPrice,
        inPromotion: item.inPromotion,
        pricepromo: item.pricepromo,
        stock: item.stock,
        unit: item.unit,
        imageUrl: item.imageUrl,
        purchasePrice: item.purchasePrice,
        descriptionProduit: item.descriptionProduit,
        taux: item.taux
      }));
      
      setProducts(products);
      const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Une erreur est survenue lors du chargement de vos produits.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Liste complète des catégories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Filtrage des catégories selon la barre de recherche des catégories
  const filteredCategories = categories.filter(cat => 
    cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  // Filtrage et Tri des produits
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentView === 'quincaillerie' && selectedCategory) {
      return matchesSearch && p.category === selectedCategory;
    }
    
    return matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'Ordre croissant') return a.name.localeCompare(b.name);
    if (sortOption === 'Ordre décroissant') return b.name.localeCompare(a.name);
    if (sortOption === 'Prix croissant') return a.sellPrice - b.sellPrice;
    if (sortOption === 'Prix décroissant') return b.sellPrice - a.sellPrice;
    return 0; // "Date d'ajout" par défaut
  });

  // Statistiques globales et de vue
  const totalProductsGlobal = products.length;
  const promoCountGlobal = products.filter(p => p.inPromotion).length;
  const avgPriceGlobal = totalProductsGlobal > 0
    ? products.reduce((acc, p) => acc + (p.pricepromo || p.sellPrice), 0) / totalProductsGlobal
    : 0;

  const totalProductsView = filteredProducts.length;
  const promoCountView = filteredProducts.filter(p => p.inPromotion).length;
  const avgPriceView = totalProductsView > 0
    ? filteredProducts.reduce((acc, p) => acc + (p.pricepromo || p.sellPrice), 0) / totalProductsView
    : 0;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-4rem)] flex flex-col h-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            Mon Stock
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-2">
            Gérez l'ensemble de votre inventaire de quincaillerie.
          </p>
        </div>

        <Link
          href="/vendeur/products/addProduct"
          className="flex fixed bottom-6 right-6 md:static md:bottom-auto md:right-auto items-center justify-center gap-2 px-6 py-3 md:py-2.5 bg-blue-600 text-white font-bold rounded-xl md:rounded-xl rounded-full hover:bg-blue-700 transition-all active:scale-95 shadow-lg md:shadow-sm shadow-blue-600/30 z-20"
        >
          <Plus className="w-6 h-6 md:w-5 md:h-5" />
          <span className="hidden md:inline">Ajouter</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 shrink-0">
        
        {/* STATS DESKTOP */}
        <div className="hidden md:grid grid-cols-3 gap-4 w-auto">
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[140px]">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Produits</p>
            <p className="text-3xl font-black text-gray-900">{totalProductsGlobal}</p>
          </div>
          
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[140px]">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">En promo</p>
            <p className="text-3xl font-black text-orange-600">{promoCountGlobal}</p>
          </div>
          
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm min-w-[140px]">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Prix moyen</p>
            <p className="text-3xl font-black text-green-600">{Math.round(avgPriceGlobal)} F</p>
          </div>
        </div>

        {/* STATS MOBILE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:hidden">
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Produits</p>
            <p className="text-2xl font-black text-gray-900">{totalProductsView}</p>
          </div>
          
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">En promo</p>
            <p className="text-2xl font-black text-orange-600">{promoCountView}</p>
          </div>
          
          <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Prix moyen</p>
            <p className="text-2xl font-black text-green-600">{Math.round(avgPriceView)} F</p>
          </div>
        </div>

        {/* TABS DE VUE */}
        <div className="flex bg-gray-200/60 p-1.5 rounded-xl border border-gray-300/40 w-full md:w-auto">
          <button 
            onClick={() => setCurrentView('produits')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
              currentView === 'produits' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" /> Par produit
          </button>
          <button 
            onClick={() => setCurrentView('quincaillerie')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
              currentView === 'quincaillerie' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Par catégorie
          </button>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-6 bg-transparent h-full min-h-[450px] overflow-hidden ${
        currentView === 'quincaillerie' ? 'md:items-stretch' : 'flex-col'
      }`}>
        
        {/* SIDEBAR CATÉGORIES (VUE QUINCAILLERIE) */}
        {currentView === 'quincaillerie' && (
          <div className="w-full md:w-1/4 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm shrink-0 flex flex-col gap-4 max-h-[400px] md:max-h-none overflow-y-auto">
            
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 mb-2">
              <h3 className="text-sm font-black uppercase text-gray-400 tracking-wider flex items-center gap-2 shrink-0">
                <ListFilter className="w-5 h-5 text-blue-600" />
                Catégories
              </h3>

              <div className="relative w-full xl:max-w-[160px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-600 focus:bg-white focus:ring-0 outline-none text-gray-700 transition placeholder:text-gray-400"
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat, i) => {
                  const catProductCount = products.filter(p => p.category === cat).length;
                  
                  return (
                    <button 
                      key={i}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition flex justify-between items-center cursor-pointer ${
                        selectedCategory === cat 
                        ? 'bg-blue-50/70 border border-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs shrink-0 ${
                        selectedCategory === cat ? 'bg-blue-200/50 text-blue-800' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {catProductCount}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  Aucune catégorie trouvée
                </div>
              )}
            </div>
          </div>
        )}

        {/* ZONE PRINCIPALE - TABLEAU */}
        <div className="bg-white rounded-3xl border border-gray-100 flex flex-col h-180 overflow-y-auto shadow-sm flex-1">
          
          <div className="p-4 md:p-5 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-base focus:border-blue-600 focus:bg-white focus:ring-0 outline-none text-gray-800 transition placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {currentView === 'quincaillerie' && (
              <div className="hidden lg:flex items-center gap-6 text-sm bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Total :</span>
                  <span className="font-bold text-gray-900">{totalProductsView}</span>
                </div>
                <div className="h-5 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">En promo :</span>
                  <span className="font-bold text-orange-600">{promoCountView}</span>
                </div>
                <div className="h-5 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Moyenne :</span>
                  <span className="font-bold text-green-600">{Math.round(avgPriceView)} F</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 relative self-end md:self-auto w-full md:w-auto">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex-1 md:flex-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="inline">{sortOption}</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 top-14 z-50 w-64 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col py-2 text-left">
                  {[
                    "Date d'ajout",
                    "Ordre croissant",
                    "Ordre décroissant",
                    "Prix croissant",
                    "Prix décroissant"
                  ].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-5 py-3 text-sm font-semibold hover:bg-gray-50 transition text-left cursor-pointer ${
                        sortOption === option ? 'text-blue-600 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span>{option}</span>
                      {sortOption === option && <Check className="w-5 h-5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={fetchProducts}
                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                title="Actualiser"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            /* ÉTAT DE CHARGEMENT */
            <div className="p-12 text-center text-gray-400 flex-1 flex flex-col items-center justify-center text-base gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <span className="font-medium">Chargement de votre stock...</span>
            </div>
          ) : error ? (
            /* ÉTAT D'ERREUR */
            <div className="p-12 text-center flex-1 flex flex-col items-center justify-center gap-3">
              {error.includes('connexion') ? (
                <WifiOff className="w-12 h-12 text-red-500 mb-2" />
              ) : (
                <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
              )}
              <span className="font-bold text-red-500 text-lg">Une erreur est survenue lors du chargement.</span>
              <p className="text-sm text-gray-500 max-w-md mt-1">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-600/20"
              >
                Réessayer
              </button>
            </div>
          ) : (
            /* CONTENU DE LA TABLE (AVEC SCROLL HORIZONTAL SUR MOBILE) */
            <div className="overflow-x-auto overflow-y-auto flex-1 w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50 text-xs md:text-sm text-gray-400 uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 md:p-5 font-bold">Produit</th>
                    <th className="p-4 md:p-5 font-bold">Catégorie & Marque</th>
                    <th className="p-4 md:p-5 font-bold">Stock</th>
                    <th className="p-4 md:p-5 font-bold">Prix</th>
                    <th className="p-4 md:p-5 font-bold text-center">Voir plus</th>
                    <th className="p-4 md:p-5 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.length === 0 ? (
                    /* ÉTAT STOCK VIDE GLOBAL */
                    <tr>
                      <td colSpan={6} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Package className="w-12 h-12 text-gray-300 mb-3" />
                          <h3 className="font-bold text-gray-900 text-lg">Stock vide</h3>
                          <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
                            Vous n'avez actuellement aucun produit dans votre stock.
                          </p>
                          <Link
                            href="/vendeur/products/addProduct"
                            className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
                          >
                            Ajouter mon premier produit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    /* ÉTAT RECHERCHE/FILTRE SANS RÉSULTAT */
                    <tr>
                      <td colSpan={6} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Search className="w-12 h-12 text-gray-300 mb-3" />
                          <h3 className="font-bold text-gray-900 text-lg">Aucun résultat</h3>
                          <p className="text-sm text-gray-500 max-w-sm mt-1">
                            Aucun produit ne correspond à "{searchTerm}" ou aux critères sélectionnés.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => {
                      const hasPromo = product.inPromotion && product.pricepromo != null;
                      const displayPrice = hasPromo ? product.pricepromo : product.sellPrice;
                      const discount = hasPromo
                        ? Math.round((1 - (product.pricepromo! / product.sellPrice)) * 100)
                        : 0;

                      return (
                        <tr key={product.idPrice || index} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="p-4 md:p-5">
                            <div className="flex items-center gap-4">
                              <div 
                                onClick={() => {
                                  if (product.imageUrl) {
                                    setFullImage({ url: product.imageUrl, name: product.name });
                                  }
                                }}
                                className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden cursor-pointer"
                              >
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageOff className="w-6 h-6" />
                                  </div>
                                )}
                                
                                {hasPromo && (
                                  <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-br-lg">
                                    -{discount}%
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm md:text-base">{product.name}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 md:p-5 text-sm">
                            <span className="font-medium text-gray-800 block mb-0.5">{product.category}</span>
                            <span className="text-gray-400">{product.brand}</span>
                          </td>

                          <td className="p-4 md:p-5">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/70 border border-blue-100 text-blue-700 font-bold rounded-full text-sm">
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              {product.stock} {product.unit}
                            </span>
                          </td>

                          <td className="p-4 md:p-5">
                            {hasPromo ? (
                              <div className="flex flex-col">
                                <span className="text-gray-400 text-sm line-through">
                                  {product.sellPrice.toLocaleString()} F
                                </span>
                                <span className="font-black text-green-600 text-base">
                                  {displayPrice?.toLocaleString()} F
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-gray-900 text-base">
                                {product.sellPrice.toLocaleString()} F
                              </span>
                            )}
                          </td>

                          <td className="p-4 md:p-5 text-center">
                            <button onClick={() => router.push(`/vendeur/products/${product.idPrice}`)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer mx-auto flex items-center justify-center">
                              <Eye className="w-5 h-5" />
                            </button>
                          </td>

                          <td className="p-4 md:p-5 text-center">
                            <div
                              ref={(el) => {
                                menuRefs.current[index] = el;
                              }}
                              className="relative inline-block"
                            >
                              <button
                                onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                                className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>

                              {activeMenu === index && (
                                <div className="absolute right-10 top-0 z-50 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col py-1 text-left">
                                  <button className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition duration-150 cursor-pointer">
                                    <Edit3 className="w-4 h-4 text-gray-400" /> Modifier
                                  </button>
                                  <button className="flex items-center gap-3 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition duration-150 cursor-pointer">
                                    <Trash2 className="w-4 h-4 text-red-500" /> Supprimer
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {fullImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full flex flex-col items-center relative shadow-2xl">
            <button
              onClick={() => setFullImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <img 
              src={fullImage.url || "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400"} 
              alt={fullImage.name} 
              className="w-full max-h-[400px] object-contain rounded-2xl mb-5 border border-gray-100" 
            />
            
            <h3 className="font-bold text-gray-900 text-lg text-center px-4">
              {fullImage.name}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}