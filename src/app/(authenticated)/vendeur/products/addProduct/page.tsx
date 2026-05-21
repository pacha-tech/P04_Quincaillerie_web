'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Upload, Edit, TrendingUp, TrendingDown, 
  Save, Info, Package
} from 'lucide-react';
import Swal from 'sweetalert2';

import { AddProductDTO } from '@/src/types/DTO/AddProductDTO';
import { Category } from '@/src/types/Category';
import { categoryService } from '@/src/services/CategoryService';
import { productService } from '@/src/services/ProductService';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // États du formulaire
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');

  // États pour gérer les messages d'erreur des champs obligatoires
  const [nameError, setNameError] = useState(false);
  const [brandError, setBrandError] = useState(false);
  const [buyPriceError, setBuyPriceError] = useState(false);
  const [sellPriceError, setSellPriceError] = useState(false);
  const [stockError, setStockError] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState('Unité');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const units = ['Unité', 'Sac', 'Kilo', 'Mètre', 'Litre', 'Paquet', 'Tonne', 'Barre'];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAllCategory();
        const formattedCategories: Category[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.name,
        }));

        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setSelectedCategory(formattedCategories[0].id);
        }
      } catch (e) {
        console.error('Erreur chargement catégories', e);
        toast.error("Erreur de chargement des categories");
      }
    };
    loadCategories();
  }, []);

  // Gestion du choix d'une image
  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return; // Empêche de changer l'image pendant le chargement
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Double sécurité

    // Réinitialisation des erreurs
    setNameError(false);
    setBrandError(false);
    setBuyPriceError(false);
    setSellPriceError(false);
    setStockError(false);

    let hasError = false;

    // Validation des champs
    if (!name.trim()) { setNameError(true); hasError = true; }
    if (!brand.trim()) { setBrandError(true); hasError = true; }
    if (!buyPrice || parseFloat(buyPrice) <= 0) { setBuyPriceError(true); hasError = true; }
    if (!sellPrice || parseFloat(sellPrice) <= 0) { setSellPriceError(true); hasError = true; }
    if (!stock || parseInt(stock) <= 0) { setStockError(true); hasError = true; }

    if (hasError) return;

    const numBuyPrice = parseFloat(buyPrice) || 0;
    const numSellPrice = parseFloat(sellPrice) || 0;

    if (!imageFile) {
      Swal.fire({
        title: 'Image manquante',
        text: 'Souhaitez-vous enregistrer ce produit sans photo ?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Continuer sans photo',
        cancelButtonText: 'Ajouter une photo',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) checkPrices(numBuyPrice, numSellPrice);
      });
      return;
    }

    checkPrices(numBuyPrice, numSellPrice);
  };

  const checkPrices = (numBuyPrice: number, numSellPrice: number) => {
    if (numSellPrice < numBuyPrice) {
      Swal.fire({
        title: 'Prix de vente inférieur',
        text: "Le prix de vente est inférieur au prix d'achat. Confirmer quand même ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#16a34a',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) executeAddProduct();
      });
    } else {
      executeAddProduct();
    }
  };

  const executeAddProduct = async () => {
    setIsLoading(true);
    const dto: AddProductDTO = {
      name: name.trim(),
      brand: brand.trim(),
      categoryId: selectedCategory,
      purchasePrice: buyPrice.trim(),
      sellingPrice: sellPrice.trim(),
      stock: parseInt(stock) || 0,
      unite: selectedUnit,
      descriptionProduit: description.trim(),
    };

    try {
      await productService.addProduct(dto, imageFile);
      
      await Swal.fire({
        title: 'Succès !',
        text: 'Produit ajouté avec succès.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      });
      
      router.back();
    } catch (e: any) {
      Swal.fire({
        title: 'Erreur lors de la création',
        text: e.message,
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    } finally {
      // Le finally garantit que le loading se désactive TOUJOURS, succès ou échec.
      setIsLoading(false);
    }
  };

  const buyValue = parseFloat(buyPrice) || 0;
  const sellValue = parseFloat(sellPrice) || 0;
  const marge = sellValue - buyValue;
  const taux = buyValue > 0 ? (marge / buyValue) * 100 : 0;

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      
      <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-4 shadow-sm relative">
        
        {/* En-tête (Marges réduites pour gagner de la place) */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => !isLoading && router.back()}
              disabled={isLoading}
              className="md:hidden p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 transition disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Ajouter un produit
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Remplissez les informations de votre nouveau produit.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Section Photo - Hauteur optimisée pour ne pas scroller */}
          <div className="flex flex-col items-center">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Photo du produit
            </label>

            <div
              onClick={() => !isLoading && document.getElementById('fileInput')?.click()}
              className={`w-32 sm:w-40 h-24 sm:h-28 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-500/50 flex flex-col items-center justify-center transition relative overflow-hidden ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            >
              {imagePreview ? (
                <div className="relative w-full h-full group">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                  {!isLoading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                        <Edit className="w-3 h-3" /> Modifier
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center p-2 text-center">
                  <div className="w-8 h-8 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-center mb-1">
                    <Upload className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-900 leading-tight">Ajouter une photo</span>
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={handlePickImage}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Section Informations générales */}
          <div>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest mb-1.5">
              <Info className="w-3.5 h-3.5" /> Informations générales
            </span>

            {/* Utilisation de GRID pour gagner de l'espace vertical */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 mb-1 block">Nom du produit</label>
                <input
                  type="text"
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError(false);
                  }}
                  placeholder="Ex: Ciment CPJ 35"
                  className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    nameError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                  }`}
                />
                {nameError && <span className="text-xs text-red-500 mt-0.5 block font-bold">Ce champ est obligatoire.</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Marque / Fabricant</label>
                <input
                  type="text"
                  disabled={isLoading}
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    if (e.target.value.trim()) setBrandError(false);
                  }}
                  placeholder="Ex: Dangote"
                  className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    brandError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                  }`}
                />
                {brandError && <span className="text-xs text-red-500 mt-0.5 block font-bold">Ce champ est obligatoire.</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Catégorie</label>
                <select
                  disabled={isLoading}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:ring-0 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-700 mb-1 block">Description</label>
                <textarea
                  disabled={isLoading}
                  rows={1}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Petite description du produit (optionnelle)"
                  className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:ring-0 outline-none transition resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section Inventaire et Prix */}
          <div>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-blue-600 uppercase tracking-widest mb-1.5">
              <Save className="w-3.5 h-3.5" /> Inventaire & Prix
            </span>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Prix d'achat</label>
                <input
                  type="number"
                  disabled={isLoading}
                  value={buyPrice}
                  onChange={(e) => {
                    setBuyPrice(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) setBuyPriceError(false);
                  }}
                  placeholder="0"
                  className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    buyPriceError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                  }`}
                />
                {buyPriceError && <span className="text-xs text-red-500 mt-0.5 block font-bold">Valeur &gt; 0.</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Prix de vente</label>
                <input
                  type="number"
                  disabled={isLoading}
                  value={sellPrice}
                  onChange={(e) => {
                    setSellPrice(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val > 0) setSellPriceError(false);
                  }}
                  placeholder="0"
                  className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    sellPriceError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                  }`}
                />
                {sellPriceError && <span className="text-xs text-red-500 mt-0.5 block font-bold">Valeur &gt; 0.</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Quantité</label>
                <input
                  type="number"
                  disabled={isLoading}
                  value={stock}
                  onChange={(e) => {
                    setStock(e.target.value);
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setStockError(false);
                  }}
                  placeholder="0"
                  className={`w-full px-3 py-2 sm:py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                    stockError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600 focus:bg-white'
                  }`}
                />
                {stockError && <span className="text-xs text-red-500 mt-0.5 block font-bold">Valeur &gt; 0.</span>}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-1 block">Unité</label>
                <select
                  disabled={isLoading}
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:ring-0 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Indicateur de marge */}
          {buyValue > 0 && sellValue > 0 && (
            <div
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 mt-1 transition-all ${
                marge >= 0 ? 'bg-green-50 border-green-100 text-green-800' : 'bg-orange-50 border-orange-100 text-orange-800'
              }`}
            >
              {marge >= 0 ? <TrendingUp className="text-green-600 w-4 h-4" /> : <TrendingDown className="text-orange-600 w-4 h-4" />}
              <span className="text-xs sm:text-sm font-bold">
                {marge >= 0
                  ? `Marge : +${marge.toLocaleString()} FCFA (${taux.toFixed(1)}%)`
                  : `Attention : Marge négative de ${Math.abs(marge).toLocaleString()} FCFA`}
              </span>
            </div>
          )}

          {/* Bouton de soumission avec spinner intégré */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 text-white font-bold rounded-xl transition-all shadow-sm ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs sm:text-sm tracking-wide">CRÉATION EN COURS...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5 text-white" />
                <span className="text-xs sm:text-sm tracking-wide">CRÉER ET AJOUTER AU STOCK</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}