'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import {
  Star, Store, Loader2,
  AlertCircle, Phone, MapPin, Search, Info, X,
  Package, AlignLeft, Image as ImageIcon
} from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { QuincaillerieDetail } from '@/src/types/QuincaillerieDetail';
import { ProductSearch } from '@/src/types/productSearch';
import { productService } from '@/src/services/ProductService';
import { quincaillerieService } from '@/src/services/QuincaillerieService';
import ProductCard from '@/src/components/ui/client/ProductCard';
import { useLocation } from '@/src/hooks/LocationContext';
import { calculateDistance } from '@/src/utils/Distance';
import toast from 'react-hot-toast';
import { BiExit } from 'react-icons/bi';

export default function QuincaillerieDetailsPage({ params }: { params: Promise<{ quincaillerieId: string; priceId: string }> }) {
  const { quincaillerieId, priceId } = use(params);
  const { items, addToCart, updateQuantity } = useCart();
  const { latitude: userLat, longitude: userLng } = useLocation();

  const [product, setProduct] = useState<ProductSearch | null>(null);
  const [storeDetail, setStoreDetail] = useState<QuincaillerieDetail | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);

  const getDistanceLabel = () => {
    if (userLat && userLng && storeDetail?.latitude && storeDetail?.longitude) {
      const dist = calculateDistance(
        Number(userLat),
        Number(userLng),
        Number(storeDetail.latitude),
        Number(storeDetail.longitude)
      );
      if (dist < 1) return `${Math.round(dist * 1000)} m`;
      return `${dist.toFixed(1)} km`;
    }
    return "...";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [productData, storeData] = await Promise.all([
          productService.getProductSearchById(priceId),
          quincaillerieService.getQuincaillerieByIdf(quincaillerieId)
        ]);

        if (!isMounted) return;

        setProduct(productData);
        setStoreDetail(storeData);

        if (productData?.idProduct) {
          const recoData = await productService.getRecommandationByProductAndStore(
            productData.idProduct,
            quincaillerieId
          );

          if (isMounted) {
            setRecommendations(recoData);
          }
        }

      } catch (err: any) {
        if (isMounted) setError(err.message || "Impossible de charger les données");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [quincaillerieId, priceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <Loader2 className="h-9 w-9 animate-spin text-app-accent mb-3" />
        <span className="text-sm text-app-secondary font-medium tracking-wide">Ouverture de la boutique...</span>
      </div>
    );
  }

  if (error || !product || !storeDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-app-primary font-medium mb-6">{error || "Boutique ou produit introuvable"}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-app-primary text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.97] transition-all"
        >
          Retour
        </button>
      </div>
    );
  }

  const mainPrice = product.priceSearchProductsDTO?.find(p => p.idQuincaillerie === quincaillerieId) || product.priceSearchProductsDTO?.[0];
  const isOpen = storeDetail.status?.toLowerCase() === 'ouvert' || storeDetail.status?.toLowerCase() === 'open';

  const filteredRecommendations = recommendations.filter(rec =>
    rec.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartItem = mainPrice ? items?.find(item => item.idPrice === mainPrice.idPrice) : null;
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!mainPrice) return;
    if ((mainPrice.stock ?? 0) <= 0) {
      toast.error("Stock de " + product.name + " épuisé");
      return;
    }
    try {
      setIsCartLoading(true);
      await addToCart(mainPrice.idPrice);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!mainPrice) return;
    if (quantityInCart >= (mainPrice.stock ?? 0)) {
      toast.error("Stock de " + product.name + " épuisé");
      return;
    }
    try {
      setIsCartLoading(true);
      await updateQuantity(mainPrice.idPrice, 1);
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!mainPrice) return;
    try {
      setIsCartLoading(true);
      await updateQuantity(mainPrice.idPrice, -1);
    } catch (error) {
      toast.error("Erreur");
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <div className="bg-app-surface h-[calc(100vh-80px)] lg:h-[calc(100vh-90px)] overflow-hidden font-sans text-app-primary">
      <main className="w-full max-w-[1600px] mx-auto px-1.5 sm:px-4 md:px-8 py-2.5 md:py-6 h-full">

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 items-stretch h-full overflow-hidden">

          {/* =========================================
              MOBILE HEADER — TOP PRODUCT CARD (lg:hidden)
          ========================================= */}
          {mainPrice && (
            <div className="lg:hidden flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.02] flex flex-col overflow-hidden">
              <div className="p-2.5 flex gap-3">
                {/* Image à gauche */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F8F9FB] border border-dashed border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover mix-blend-multiply p-1"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-app-secondary/30" />
                  )}
                  {mainPrice.inPromotion && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold z-10 shadow-sm animate-pulse">
                      -{mainPrice.taux}%
                    </div>
                  )}
                </div>

                {/* Éléments à droite */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Boutique et Rating */}
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <button
                        onClick={() => setShowStoreDetails(!showStoreDetails)}
                        className="flex items-center text-[10px] font-bold text-app-accent bg-app-accent/5 px-2 py-0.5 rounded-full hover:bg-app-accent/10 transition-colors cursor-pointer shrink-0 max-w-[70%]"
                      >
                        <Store className="h-3 w-3 mr-1 shrink-0" />
                        <span className="truncate">{storeDetail.name}</span>
                        <Info className="h-2.5 w-2.5 ml-1 shrink-0 opacity-70" />
                      </button>
                      <span className="flex items-center gap-0.5 bg-[#F8F9FB] px-1.5 py-0.5 rounded text-[9px] text-amber-500 font-bold shrink-0">
                        ⭐ {storeDetail.averageRating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>

                    {/* Nom du produit */}
                    <h2 className="text-xs sm:text-sm font-extrabold text-app-primary line-clamp-1 leading-snug">
                      {product.name}
                    </h2>

                    {/* Description courte */}
                    <p className="text-[10px] sm:text-[11px] text-app-secondary/80 line-clamp-1 leading-relaxed mt-0.5">
                      {product.description || "Aucune description disponible pour ce produit."}
                    </p>
                  </div>

                  {/* Stock et Distance */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-app-secondary">
                      <Package className="h-2.5 w-2.5 text-app-accent" />
                      <span className={mainPrice.stock <= 0 ? 'text-red-500 font-semibold' : ''}>
                        {mainPrice.stock <= 0 ? 'Rupture' : `${mainPrice.stock} dispo`}
                      </span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-1 text-[10px] text-app-secondary bg-gray-50 px-1.5 py-0.5 rounded">
                      <MapPin className="h-2.5 w-2.5 text-app-secondary" />
                      <span>{getDistanceLabel()}</span>
                    </div>
                  </div>

                  {/* Prix et Bouton Ajouter */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-1.5 mt-1">
                    {/* Prix */}
                    <div className="flex flex-col">
                      {mainPrice.inPromotion ? (
                        <>
                          <span className="text-[8px] sm:text-[9px] text-app-secondary line-through leading-none mb-0.5">
                            {Number(mainPrice.price)} Fcfa
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-app-accent">
                            {Number(mainPrice.pricePromo)} Fcfa
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm font-extrabold text-app-primary">
                          {Number(mainPrice.price)} Fcfa
                        </span>
                      )}
                    </div>

                    {/* Action Cart */}
                    <div className="flex-shrink-0">
                      {isCartLoading ? (
                        <div className="flex items-center justify-center h-6 sm:h-7.5 px-2">
                          <Loader2 className="w-3.5 h-3.5 text-app-accent animate-spin" />
                        </div>
                      ) : mainPrice.stock <= 0 ? (
                        <span className="inline-flex items-center justify-center h-6 sm:h-7 px-2.5 rounded-full bg-gray-100 text-[9px] sm:text-[10px] font-semibold text-gray-400 cursor-not-allowed">
                          Rupture
                        </span>
                      ) : quantityInCart === 0 ? (
                        <button
                          onClick={handleAddToCart}
                          className="inline-flex items-center justify-center h-6 sm:h-7 rounded-full bg-app-primary px-3 text-[9px] sm:text-[10px] font-bold text-white transition-all duration-300 hover:bg-app-accent cursor-pointer shadow-sm"
                        >
                          Ajouter
                        </button>
                      ) : (
                        <div className="inline-flex items-center h-6 sm:h-7 rounded-full bg-app-accent text-white shadow-sm overflow-hidden border border-app-accent">
                          <button
                            onClick={handleDecrement}
                            className="px-2 h-full hover:bg-black/10 transition-colors flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1 text-[9px] sm:text-[10px] font-bold min-w-[12px] text-center">
                            {quantityInCart}
                          </span>
                          <button
                            onClick={handleIncrement}
                            className="px-2 h-full transition-colors flex items-center justify-center text-xs font-bold hover:bg-black/10 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accordéon Détails de la Boutique */}
              {showStoreDetails && (
                <div className="border-t border-gray-100 bg-[#F8F9FB] px-3.5 py-3 flex flex-col gap-2.5 text-xs animate-fadeIn transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wider">
                      Infos Boutique
                    </span>
                    <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                    <span className={`text-[10px] font-semibold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                    <X className="h-4 w-4 text-black ml-40 cursor-pointer" onClick={() => setShowStoreDetails(false)} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-app-accent flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <span className="font-semibold text-app-primary block truncate">
                          {storeDetail.quartier || "Quartier non renseigné"}
                        </span>
                        <span className="text-app-secondary block truncate">
                          {storeDetail.ville || "Ville non renseignée"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-app-accent flex-shrink-0" />
                      <a href={`tel:${storeDetail.telephone}`} className="font-semibold text-app-accent hover:underline truncate">
                        {storeDetail.telephone || "Non disponible"}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================
              COLONNE DE GAUCHE — TOTALEMENT FIXE (Desktop - lg:flex)
          ========================================= */}
          <div className="hidden lg:flex lg:w-[320px] xl:w-[360px] flex-shrink-0 flex-col gap-4 lg:h-full lg:overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* 1. PRODUIT PRINCIPAL */}
            {mainPrice && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-app-accent"></span>
                  <h2 className="text-[11px] font-bold text-app-secondary tracking-[0.12em] uppercase">
                    Produit sélectionné
                  </h2>
                </div>

                <div className="w-full max-w-[240px] mx-auto rounded-2xl shadow-md shadow-black/[0.04] bg-white overflow-hidden">
                  <ProductCard
                    idPrice={mainPrice.idPrice}
                    idQuincaillerie={quincaillerieId}
                    name={product.name}
                    quincaillerieName={storeDetail.name}
                    imageUrl={product.imageUrl}
                    price={Number(mainPrice.price)}
                    pricePromo={mainPrice.pricePromo ? Number(mainPrice.pricePromo) : undefined}
                    inPromotion={mainPrice.inPromotion}
                    taux={mainPrice.taux?.toString()}
                    stock={mainPrice.stock}
                    latitudeQuincaillerie={Number(storeDetail.latitude)}
                    longitudeQuincaillerie={Number(storeDetail.longitude)}
                    idCategory={product.idCategory}
                  />
                </div>
              </div>
            )}

            {/* 2. DÉTAILS UTILES DU PRODUIT */}
            {mainPrice && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-black/[0.02] flex flex-col gap-4">
                <h3 className="text-[13px] font-bold text-app-primary">Informations produit</h3>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4.5 w-4.5 text-blue-500" />
                  </div>
                  <p className="text-[12px] text-app-secondary font-medium">
                    <span className="text-app-primary font-bold">{mainPrice.stock ?? 0}</span>{' '}
                    {product.unite}{mainPrice.stock > 1 ? 's' : ''} en stock
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100/80">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlignLeft className="h-3.5 w-3.5 text-app-secondary" />
                    <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wide">Description</span>
                  </div>
                  <p className="text-xs text-app-secondary leading-relaxed line-clamp-3">
                    {product.description || "Aucune description n'est disponible pour ce produit."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. CARTE BOUTIQUE */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-black/[0.02] flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden relative border border-gray-100 flex-shrink-0">
                  {storeDetail.photoUrl ? (
                    <Image src={storeDetail.photoUrl} alt={storeDetail.name} fill className="object-cover" />
                  ) : (
                    <Store className="h-5 w-5 text-app-secondary" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h1 className="text-[15px] font-bold text-app-primary line-clamp-1">{storeDetail.name || "Boutique inconnue"}</h1>
                    <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-app-secondary">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-app-primary">{storeDetail.averageRating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="h-3.5 w-3.5 text-app-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-app-primary block">
                      {storeDetail.quartier || "Quartier non renseigné"}, {storeDetail.ville || "Ville non renseignée"}
                    </span>
                    <span className="text-app-secondary">
                      {storeDetail.region || "Région inconnue"}
                      {storeDetail.precision ? ` — ${storeDetail.precision}` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-3.5 w-3.5 text-app-accent flex-shrink-0" />
                  <span className="font-semibold text-app-primary">{storeDetail.telephone || "Numéro non disponible"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              COLONNE DE DROITE : RECOMMANDATIONS (SCROLLABLE INDÉPENDANT)
          ========================================= */}
          <div className="flex-1 min-w-0 lg:h-full overflow-y-auto pb-12 relative rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* EN-TÊTE COLLANT (STICKY) DANS LA ZONE SCROLLABLE */}
            <div className="sticky top-0 z-20 bg-app-surface pb-3 pt-1">
              <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.02] h-12">

                {/* Titre et Nombre */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <h3 className={`font-extrabold text-app-primary tracking-tight transition-all duration-300 whitespace-nowrap ${isSearchExpanded ? 'text-xs max-w-[85px] truncate' : 'text-sm'
                    } sm:text-[15px]`}>
                    {searchTerm ? 'Résultats' : 'Mes recommandations'}
                  </h3>
                  {!isSearchExpanded && (
                    <span className="text-[10px] sm:text-[11px] text-app-secondary font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                      {filteredRecommendations.length}
                    </span>
                  )}
                </div>

                {/* Barre de recherche responsive */}
                <div className="flex-1 flex justify-end items-center min-w-0 pl-2">

                  {/* Version Mobile / Tablette (Sous lg) */}
                  <div className="flex lg:hidden items-center justify-end w-full">
                    {isSearchExpanded ? (
                      <div className="relative w-full flex items-center">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                          className="w-full bg-gray-50 border border-gray-100 text-app-primary text-xs font-semibold rounded-full focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent focus:bg-white block pl-9 pr-16 py-1.5 transition-all outline-none"
                        />
                        <button
                          onClick={() => {
                            setIsSearchExpanded(false);
                            setSearchTerm("");
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-app-accent text-[10px] font-bold hover:opacity-80 cursor-pointer"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsSearchExpanded(true)}
                        className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-app-secondary transition-all cursor-pointer"
                      >
                        <Search className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Version Desktop (lg et plus) */}
                  <div className="hidden lg:relative lg:block lg:w-[260px] xl:w-[320px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 text-app-primary text-sm font-medium rounded-full focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent focus:bg-white block pl-10 pr-4 py-2 transition-all outline-none placeholder:text-gray-400"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* GRILLE DE RECOMMANDATIONS */}
            {filteredRecommendations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm shadow-black/[0.02] flex flex-col items-center justify-center min-h-[380px]">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-app-primary text-[15px] font-semibold">Aucune recommandation trouvée</p>
                <p className="text-app-secondary text-sm mt-1">Essayez de modifier votre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredRecommendations.map((rec) => (
                  <ProductCard
                    key={rec.idPrice}
                    idPrice={rec.idPrice}
                    idQuincaillerie={rec.idQuincaillerie || quincaillerieId}
                    name={rec.name}
                    quincaillerieName={storeDetail.name}
                    imageUrl={rec.imageUrl}
                    price={Number(rec.sellPrice || rec.price)}
                    pricePromo={rec.pricePromo ? Number(rec.pricePromo) : undefined}
                    inPromotion={rec.inPromotion || rec.inPromo}
                    taux={rec.taux?.toString()}
                    stock={rec.stock || 0}
                    latitudeQuincaillerie={Number(storeDetail.latitude)}
                    longitudeQuincaillerie={Number(storeDetail.longitude)}
                    idCategory={rec.idCategory || product.idCategory}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}