"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Store, MapPin, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import { calculateDistance } from '@/src/utils/Distance';
import { Price } from '@/src/types/Price';
import { ProductSearch } from '@/src/types/productSearch';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function StoreCard({ 
    store, 
    product, 
    userLocation 
}: { 
    store: Price; 
    product: ProductSearch; 
    userLocation: { latitude: number | null; longitude: number | null } 
}) {
    const { items, addToCart, updateQuantity } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const availableStock = (store as any).stock ?? 0;

    const cartItem = items?.find(item => item.idPrice === store.idPrice);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const getDistanceLabel = () => {
        if (userLocation.latitude && userLocation.longitude && store.latitudeQuincaillerie && store.longitudeQuincaillerie) {
            const dist = calculateDistance(
                Number(userLocation.latitude), 
                Number(userLocation.longitude),
                Number(store.latitudeQuincaillerie), 
                Number(store.longitudeQuincaillerie)
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
        router.push(`/client/quincaillerie/${store.idQuincaillerie}/prices/${store.idPrice}`);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (availableStock <= 0){
            toast.error("stock de " + product.name + " epuisé");
            return;
        } 

        try {
            setIsLoading(true);
            await addToCart(store.idPrice);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout au panier");
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncrement = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (quantityInCart >= availableStock) {
            toast.error("stock de " + product.name + " epuisé");
            return; 
        }

        try {
            setIsLoading(true);
            await updateQuantity(store.idPrice, 1);
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
            await updateQuantity(store.idPrice, -1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]">
            
            {/* ── 1. BOUTON VOIR PLUS ── */}
            <button 
                onClick={handleViewProduct}
                className="absolute top-3 right-2.5 md:top-4 md:right-3.5 z-20 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[11px] font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer"
            >
                Voir <ArrowRight className="h-3 w-3" />
            </button>

            {/* ── 2. CALQUE INVISIBLE MOBILE ── */}
            <div 
                className="absolute inset-0 z-10 md:hidden cursor-pointer"
                onClick={handleViewProduct}
            />
            
            {/* ── 3. CONTENU CENTRAL ── */}
            <div className="relative z-0 p-2.5 md:p-3.5">
                {/* Image du Produit */}
                <div className="relative mx-auto mb-2 md:mb-2.5 flex h-16 md:h-24 w-full items-center justify-center rounded-lg md:rounded-xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-102 border border-dashed border-app-secondary/20 overflow-hidden">
                    {product.imageUrl ? (
                        <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            fill 
                            className="object-cover mix-blend-multiply" 
                        />
                    ) : (
                        <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-app-secondary" />
                    )}
                    {store.inPromotion && (
                        <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold z-10">
                            -{store.taux}%
                        </div>
                    )}
                </div>

                {/* Nom du Produit */}
                <h3 className="text-xs md:text-sm font-bold text-app-primary mb-1 md:mb-1.5 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Nom de la Quincaillerie */}
                <p className="flex items-center text-[11px] md:text-xs font-medium text-app-secondary mb-1 line-clamp-1">
                    <Store className="h-3 w-3 mr-1 shrink-0 text-app-accent" />
                    {store.quincaillerieName}
                </p>

                {/* Note, Distance et Quantité */}
                <div className="flex flex-wrap items-center gap-1 md:gap-1.5 text-[9px] md:text-[11px] text-app-secondary mb-0.5 md:mb-1">
                    <span className="flex items-center gap-0.5 bg-app-surface px-1.5 py-0.5 rounded text-amber-500 font-medium shrink-0">
                        ⭐ 4.5
                    </span>
                    
                    <span className="flex items-center gap-0.5 bg-app-surface px-1.5 py-0.5 rounded shrink-0">
                        <MapPin className="h-2.5 w-2.5 text-app-secondary" /> {getDistanceLabel()}
                    </span>
                    
                    <span className={`flex items-center gap-1 bg-app-surface px-1.5 py-0.5 rounded shrink-0 ${availableStock <= 0 ? 'text-red-500 font-semibold' : ''}`}>
                        <Package className="h-2.5 w-2.5" /> 
                        {availableStock <= 0 ? 'Épuisé' : `${availableStock} dispo`}
                    </span>
                </div>
            </div>
            
            {/* ── 4. ZONE INFÉRIEURE ── */}
            <div className="relative z-20 flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-3.5 md:py-2.5">
                <div className="flex flex-col">
                    {store.inPromotion ? (
                        <>
                            <span className="text-[9px] md:text-[10px] text-app-secondary line-through leading-none mb-0.5">{store.price} F</span>
                            <span className="text-xs md:text-base font-bold text-app-price-green">{store.pricePromo} F</span>
                        </>
                    ) : (
                        <span className="text-xs md:text-base font-bold text-app-price-green">{store.price} F</span>
                    )}
                </div>
                
                {/* ZONE DU BOUTON PANIER */}
                <div className="flex-shrink-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-7 md:h-8.5 px-2">
                            <Loader2 className="w-4 h-4 md:w-5 h-5 text-app-accent animate-spin" />
                        </div>
                    ) : availableStock <= 0 ? (
                        <span className="inline-flex items-center justify-center h-7 md:h-8.5 rounded-full bg-gray-200/60 px-3 md:px-4 text-[10px] md:text-xs font-semibold text-gray-400 cursor-not-allowed">
                            Rupture
                        </span>
                    ) : quantityInCart === 0 ? (
                        <button 
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center h-7 md:h-8.5 rounded-full bg-app-secondary px-3 md:px-4 text-[10px] md:text-xs font-semibold text-app-card transition-all duration-300 hover:bg-app-accent cursor-pointer"
                        >
                            Ajouter
                        </button>
                    ) : (
                        <div className="inline-flex items-center h-7 md:h-8.5 rounded-full bg-app-accent text-white shadow-sm overflow-hidden">
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