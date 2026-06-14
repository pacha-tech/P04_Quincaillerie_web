'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/src/hooks/CartContext';
import { useLocation } from '@/src/hooks/LocationContext';
import { calculateDistance } from '@/src/utils/Distance';
import toast from 'react-hot-toast';
import {
  MapPin, Loader2, Image as ImageIcon,
  Store, Package, ArrowRight
} from 'lucide-react';
import { Tracking } from '@/src/types/Category';
import { categoryService } from '@/src/services/CategoryService';

interface ProductCardProps {
  idPrice: string;
  idQuincaillerie: string;
  name: string;
  quincaillerieName?: string;
  imageUrl?: string;
  price: number;
  pricePromo?: number;
  inPromotion?: boolean;
  taux?: string;
  stock?: number;
  latitudeQuincaillerie?: number;
  longitudeQuincaillerie?: number;
  hideCartActions?: boolean;
  idCategory?: string;
}

export default function ProductCard({
  idPrice,
  idQuincaillerie,
  name,
  quincaillerieName,
  imageUrl,
  price,
  pricePromo,
  inPromotion,
  taux,
  stock = 0,
  latitudeQuincaillerie,
  longitudeQuincaillerie,
  idCategory,
  hideCartActions = false
}: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { latitude: userLat, longitude: userLng } = useLocation();

  const cartItem = items?.find(item => item.idPrice === idPrice);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const getDistanceLabel = () => {
    if (userLat && userLng && latitudeQuincaillerie && longitudeQuincaillerie) {
      const dist = calculateDistance(
        Number(userLat),
        Number(userLng),
        Number(latitudeQuincaillerie),
        Number(longitudeQuincaillerie)
      );
      if (dist < 1) return `${Math.round(dist * 1000)} m`;
      return `${dist.toFixed(1)} km`;
    }
    return "...";
  };

  const handleViewProduct = () => {
    const productData = {
      idPrice,
      idQuincaillerie,
      name,
      quincaillerieName,
      imageUrl,
      sellPrice: price,
      pricepromo: pricePromo,
      inPromotion,
      taux,
      stock,
      latitudeQuincaillerie,
      longitudeQuincaillerie,
    };

    if(idCategory != null) {
      const track:Tracking = {
        idCategory: idCategory,
        actionType: "VIEW_PROD"
      }
      categoryService.trackCategory(track);
    }
    
    sessionStorage.setItem('brixel_preloaded_product', JSON.stringify(productData));
    router.push(`/client/quincaillerie/${idQuincaillerie}/prices/${idPrice}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (stock <= 0) { toast.error("Stock de " + name + " épuisé"); return; }
    try {
      setIsLoading(true);
      await addToCart(idPrice);
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (quantityInCart >= stock) { toast.error("Stock de " + name + " épuisé"); return; }
    try {
      setIsLoading(true);
      await updateQuantity(idPrice, 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      setIsLoading(true);
      await updateQuantity(idPrice, -1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] flex flex-col h-full">
      {/* Bouton Voir Plus */}
      <button
        onClick={handleViewProduct}
        className="absolute top-3 right-2.5 md:top-4 md:right-3.5 z-20 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[11px] font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer"
      >
        Voir <ArrowRight className="h-3 w-3" />
      </button>

      {/* Zone cliquable mobile */}
      <div className="absolute inset-0 z-10 md:hidden cursor-pointer" onClick={handleViewProduct} />

      {/* Contenu central */}
      <div className="relative z-0 p-2.5 md:p-3.5 flex flex-col flex-grow">
        {/* Conteneur Image */}
        <div className="relative mx-auto mb-2 md:mb-2.5 flex h-24 md:h-32 w-full items-center justify-center rounded-lg md:rounded-xl bg-[#F8F9FB] transition-all duration-300 group-hover:scale-102 border border-dashed border-neutral-200 overflow-hidden shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover mix-blend-multiply p-2" />
          ) : (
            <ImageIcon className="h-8 w-8 text-app-secondary/30" />
          )}
          {inPromotion && (
            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold z-10 shadow-sm animate-pulse">
              -{taux}%
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-xs md:text-sm font-bold text-app-primary mb-1 md:mb-1.5 line-clamp-2 leading-tight min-h-[2.5rem] flex-grow">
          {name}
        </h3>

        {/* Quincaillerie */}
        <p className="flex items-center text-[11px] md:text-xs font-medium text-app-secondary mb-1 line-clamp-1">
          <Store className="h-3 w-3 mr-1 shrink-0 text-app-accent" />
          {quincaillerieName || 'Quincaillerie'}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1 md:gap-1.5 text-[9px] md:text-[11px] text-app-secondary mt-auto">
          <span className="flex items-center gap-0.5 bg-[#F8F9FB] px-1.5 py-0.5 rounded text-amber-500 font-medium shrink-0">⭐ 4.5</span>
          <span className="flex items-center gap-0.5 bg-[#F8F9FB] px-1.5 py-0.5 rounded shrink-0">
            <MapPin className="h-2.5 w-2.5 text-app-secondary" /> {getDistanceLabel()}
          </span>
          <span className={`flex items-center gap-1 bg-[#F8F9FB] px-1.5 py-0.5 rounded shrink-0 ${stock <= 0 ? 'text-red-500 font-semibold' : ''}`}>
            <Package className="h-2.5 w-2.5" />
            {stock <= 0 ? 'Épuisé' : `${stock} dispo`}
          </span>
        </div>
      </div>

      {/* Zone Prix & Actions */}
      <div className="relative z-20 flex items-center justify-between border-t border-app-surface bg-[#F8F9FB]/50 px-2.5 py-2 md:px-3.5 md:py-2.5 mt-auto">
        <div className="flex flex-col">
          {inPromotion ? (
            <>
              <span className="text-[9px] md:text-[10px] text-app-secondary line-through leading-none mb-0.5">{price} Fcfa</span>
              <span className="text-xs md:text-base font-bold text-app-primary">{pricePromo} Fcfa</span>
            </>
          ) : (
            <span className="text-xs md:text-base font-bold text-app-primary">{price} Fcfa</span>
          )}
        </div>

        {!hideCartActions && (
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-7 md:h-8.5 px-2">
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-app-accent animate-spin" />
              </div>
            ) : stock <= 0 ? (
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
        )}
      </div>
    </div>
  );
}
