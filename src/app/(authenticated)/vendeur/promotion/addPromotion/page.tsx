'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Tag, Percent, Store, 
  LayoutGrid, Folder, Search, Check, Save, Loader2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { promotionService } from '@/src/services/PromotionService';
import { ProductOutPromotion } from '@/src/types/ProductOutPromotion';
import { AddPromotionDTO } from '@/src/types/DTO/AddPromotionDTO';
import toast from 'react-hot-toast';

interface ProductItem {
  idPrice: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isSelected: boolean;
}

interface CategoryItem {
  name: string;
  isSelected: boolean;
}

export default function AddPromotionPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'all'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    startDate: '',
    endDate: '',
  });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    title: false,
    discount: false,
    dateDebut: false,
    dateFin: false,
    dateLogic: false,
    selection: false,
  });

  // Extraction de loadData pour pouvoir l'appeler via le bouton "Réessayer"
  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null); // On réinitialise l'erreur
    try {
      const response = await promotionService.getAllProductOutPromotion();

      const formattedData: ProductItem[] = response.map((item: ProductOutPromotion) => ({
          idPrice: String(item.id),
          name: item.nom,
          price: item.price,
          category: item.category,
          imageUrl: item.imageUrl || '',
          isSelected: false,
      }));

      setProducts(formattedData);

      const cats = Array.from(new Set(formattedData.map(p => p.category))).map(name => ({
        name,
        isSelected: false,
      }));
      setCategories(cats);
    } catch (e) {
      setErrorMessage("Impossible de charger les produits. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  
  const discountRate = useMemo(() => {
    const num = Number(formData.discount);
    return (num > 0 && num <= 100) ? num : 0;
  }, [formData.discount]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
    );
  }, [searchQuery, products]);

  const selectionCount = useMemo(() => products.filter(p => p.isSelected).length, [products]);

  const getCalculatedPrices = (price: number) => {
    if (discountRate === 0) return { newPrice: price, difference: 0 };
    const newPrice = Math.floor(price * (1 - discountRate / 100));
    const difference = newPrice - price;
    return { newPrice, difference };
  };


  const stats = useMemo(() => {
    let totalInitial = 0;
    let totalFinal = 0;
    const selectedProducts = products.filter(p => p.isSelected);

    selectedProducts.forEach(p => {
      totalInitial += p.price;
      totalFinal += getCalculatedPrices(p.price).newPrice;
    });

    const totalDiff = totalFinal - totalInitial;
    const percentageLost = totalInitial > 0 ? (totalDiff / totalInitial) * 100 : 0;

    return {
      totalInitial,
      totalFinal,
      totalDiff,
      percentageLost
    };
  }, [products, discountRate]);

  // Statistiques par catégorie
  const getCategoryStats = (categoryName: string) => {
    const catProducts = products.filter(p => p.category === categoryName);
    let initialTotal = 0;
    let finalTotal = 0;

    catProducts.forEach(p => {
      initialTotal += p.price;
      finalTotal += getCalculatedPrices(p.price).newPrice;
    });

    return {
      count: catProducts.length,
      initialTotal,
      finalTotal,
      diff: finalTotal - initialTotal
    };
  };

  const handleProductToggled = (id: string, selected: boolean) => {
    setProducts(prev => prev.map(p => p.idPrice === id ? { ...p, isSelected: selected } : p));
    setErrors(prev => ({ ...prev, selection: false }));
  };

  const handleCategoryToggled = (name: string, selected: boolean) => {
    setProducts(prev => prev.map(p => p.category === name ? { ...p, isSelected: selected } : p));
    setCategories(prev => prev.map(c => c.name === name ? { ...c, isSelected: selected } : c));
    setErrors(prev => ({ ...prev, selection: false }));
  };

  const handleToggleAll = () => {
    const allSelected = products.every(p => p.isSelected);
    setProducts(prev => prev.map(p => ({ ...p, isSelected: !allSelected })));
    setCategories(prev => prev.map(c => ({ ...c, isSelected: !allSelected })));
    setErrors(prev => ({ ...prev, selection: false }));
  };

  const validate = () => {
    let isValid = true;
    
    const newErrors = {
      title: !formData.title.trim(),
      discount: !formData.discount || Number(formData.discount) <= 0 || Number(formData.discount) > 100,
      dateDebut: !formData.startDate,
      dateFin: !formData.endDate,
      dateLogic: false,
      selection: selectionCount === 0,
    };

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.dateLogic = true;
        isValid = false;
      }
    }

    if (newErrors.title || newErrors.discount || newErrors.dateDebut || newErrors.dateFin || newErrors.selection) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const selectedProducts = products.filter(p => p.isSelected);

      const promotionData: AddPromotionDTO = {
        nom: formData.title,
        tauxRemise: Number(formData.discount),
        dateDebut: formatDateToDDMMYYYY(formData.startDate),
        dateFin: formatDateToDDMMYYYY(formData.endDate),
        idsPrices: selectedProducts.map(p => p.idPrice),
      };

      await promotionService.addPromotion(promotionData);
      toast.success("Promotion activée avec succès !");
      router.back();
    } catch (e) {
      toast.error("Erreur lors de l'enregistrement de la promotion.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-hidden bg-app-surface">
      

      <div className="w-full lg:w-1/3 flex flex-col gap-4 h-fit lg:h-full overflow-y-auto">
        

        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="md:hidden p-1.5 md:p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-gray-600 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-lg md:text-xl font-black text-gray-900">Nouvelle Promotion</h1>
                <p className="text-xs text-gray-400">Configurez la campagne</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Nom de la campagne</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value});
                  setErrors({...errors, title: false});
                }}
                className={`w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs outline-none transition-all ${
                  errors.title ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'
                }`}
                placeholder="Ex: Solde d'été 2026"
              />
              {errors.title && <span className="text-[10px] text-red-500 mt-0.5 block">Requis.</span>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Taux (%)</label>
              <div className="relative max-w-[160px]">
                <input 
                  type="number" 
                  value={formData.discount}
                  onChange={(e) => {
                    setFormData({...formData, discount: e.target.value});
                    setErrors({...errors, discount: false});
                  }}
                  className={`w-full px-3 py-1.5 border rounded-xl text-xs outline-none transition-all ${
                    errors.discount ? 'border-red-500' : 'border-gray-200 focus:border-black'
                  }`}
                  placeholder="0"
                />
                <Percent className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.discount && <span className="text-[10px] text-red-500 mt-0.5 block">Veuillez entrer (1 à 100).</span>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Date de début</label>
                <input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className={`w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-black transition-all ${
                    errors.dateDebut ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.dateDebut && <span className="text-[10px] text-red-500 mt-0.5 block">Obligatoire.</span>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-0.5">Date de fin</label>
                <input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className={`w-full px-3 py-1.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-black transition-all ${
                    errors.dateFin ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.dateFin && <span className="text-[10px] text-red-500 mt-0.5 block">Obligatoire.</span>}
              </div>
            </div>
            
            {errors.dateLogic && <span className="text-[10px] text-red-500 block">Date de début invalide.</span>}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-800 mb-3">Statistiques de la campagne</h3>
          
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Produits sélectionnés:</span>
              <span className="font-bold text-gray-900">{selectionCount}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total initial:</span>
              <span className="font-semibold text-gray-800">{stats.totalInitial} FCFA</span>
            </div>

            {discountRate > 0 && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total après remise:</span>
                  <span className="font-bold text-green-700">{stats.totalFinal} FCFA</span>
                </div>
                
                <div className="flex justify-between text-xs pt-2 border-t border-gray-200/50">
                  <span className="text-gray-500">Variation :</span>
                  <span className={`font-black ${stats.totalDiff <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.totalDiff <= 0 ? '' : '+'}{stats.totalDiff} FCFA ({stats.percentageLost.toFixed(1)}%)
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col h-[400px] lg:h-full overflow-hidden">
        
        {/* Menu Onglets */}
        <div className="flex gap-2 border-b border-gray-100 pb-3 mb-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'products' ? 'bg-black text-white shadow' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Produits
          </button>

          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'categories' ? 'bg-black text-white shadow' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Folder className="w-3.5 h-3.5" /> Catégories
          </button>

          <button 
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'all' ? 'bg-black text-white shadow' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Boutique
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          {activeTab !== 'all' && (
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Rechercher par nom ou catégorie..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-black transition-all"
              />
            </div>
          )}
          
          {errors.selection && (
            <div className="p-2 bg-red-50 text-red-600 rounded-xl text-xs flex items-center">
              Veuillez sélectionner au moins un produit.
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 border border-gray-50 rounded-xl p-2 bg-gray-50/20 max-h-[360px] lg:max-h-none scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 h-full">
              <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
            </div>
          ) : errorMessage ? (
            /* ÉTAT D'ERREUR */
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
              <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="text-xs font-bold text-gray-900">Erreur de chargement</h3>
              <p className="text-[10px] text-gray-500 mt-1 mb-4 max-w-xs">{errorMessage}</p>
              <button 
                onClick={loadData}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold hover:bg-gray-800 transition shadow cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          ) : products.length === 0 ? (
            /* ÉTAT LISTE VIDE GLOBALE */
            <div className="flex flex-col items-center justify-center py-12 text-center h-full">
              <Tag className="w-8 h-8 text-gray-300 mb-3" />
              <h3 className="text-xs font-bold text-gray-900">Aucun produit</h3>
              <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                Vous n'avez aucun produit éligible pour une promotion actuellement.
              </p>
            </div>
          ) : activeTab === 'products' ? (
            filteredProducts.length > 0 ? (
              filteredProducts.map(p => {
                const { newPrice, difference } = getCalculatedPrices(p.price);
                return (
                  <div 
                    key={p.idPrice}
                    onClick={() => handleProductToggled(p.idPrice, !p.isSelected)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      p.isSelected ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">
                        {p.category} • <span className="font-bold text-gray-700">{p.price} FCFA</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-start gap-4">
                      {p.isSelected && discountRate > 0 && (
                        <div className="flex flex-col items-center text-[10px] font-bold">
                          <span className="text-gray-400 line-through">{p.price} Fcfa</span>
                          <span className="text-green-700">{newPrice} Fcfa</span>
                          <span className={`text-[9px] ${difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {difference <= 0 ? '' : '+'}{difference} Fcfa
                          </span>
                        </div>
                      )}
                      <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all ${
                        p.isSelected ? 'bg-black border-black text-white' : 'bg-white border-gray-300'
                      }`}>
                        {p.isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* ÉTAT RECHERCHE SANS RÉSULTAT */
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <Search className="w-8 h-8 text-gray-300 mb-3" />
                <h3 className="text-xs font-bold text-gray-900">Aucun résultat</h3>
                <p className="text-[10px] text-gray-500 mt-1 max-w-xs">
                  Aucun produit ne correspond à la recherche "{searchQuery}".
                </p>
              </div>
            )
          ) : activeTab === 'categories' ? (
            categories.map(c => {
              const statsCat = getCategoryStats(c.name);
              return (
                <div 
                  key={c.name}
                  onClick={() => handleCategoryToggled(c.name, !c.isSelected)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    c.isSelected ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col w-full">
                    <span className="text-xs font-bold">{c.name}</span>
                    <p className="text-[9px] text-gray-400 mt-0.5">Sélectionner tous les produits de cette catégorie</p>

                    {c.isSelected && (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200/50">
                        <span className="text-[10px] text-gray-600">
                          {statsCat.count} produit(s)
                        </span>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end text-[10px] font-bold">
                            <span className="text-gray-400 line-through">{statsCat.initialTotal} Fcfa</span>
                            <span className="text-green-700">{statsCat.finalTotal} Fcfa</span>
                            <span className={`text-[9px] ${statsCat.diff < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {statsCat.diff <= 0 ? '' : '+'}{statsCat.diff} Fcfa
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 pl-4">
                    <div className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all ${
                      c.isSelected ? 'bg-black border-black text-white' : 'bg-white border-gray-300'
                    }`}>
                      {c.isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Store className="w-8 h-8 text-gray-300 mb-2" />
              <h3 className="text-xs font-bold text-gray-900">Activer pour toute la boutique</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 max-w-xs leading-relaxed mb-4">
                Appliquer la promotion aux {products.length} produits du magasin.
              </p>
              
              <button 
                onClick={() => handleToggleAll()}
                className={`px-4 py-2 text-[10px] font-bold rounded-xl shadow transition cursor-pointer ${
                  products.every(p => p.isSelected) 
                    ? 'bg-red-900 text-white hover:bg-red-800' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {products.every(p => p.isSelected) ? "Désélectionner la boutique" : "Sélectionner la boutique"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">
            {selectionCount} produit(s) sélectionné(s)
          </span>

          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="hidden lg:flex px-8 py-3 bg-black text-white rounded-xl font-bold text-xs items-center justify-center gap-2 shadow transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Activation...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ACTIVER LA PROMOTION</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}