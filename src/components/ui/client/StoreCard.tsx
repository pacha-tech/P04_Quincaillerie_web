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

    // ATTENTION : Remplace 'stock' par la bonne propriété de ton backend si nécessaire
    const availableStock = (store as any).stock ?? 0;

    // Vérifier la présence et la quantité de cet article dans le panier
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
        
        if (availableStock <= 0) return;

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
        <div className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
            
            {/* ── 1. BOUTON VOIR PLUS (Cliquable sur Desktop) z-20 ── */}
            <button 
                onClick={handleViewProduct}
                className="absolute top-4 right-3 md:top-6 md:right-5 z-20 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer"
            >
                Voir <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* ── 2. CALQUE INVISIBLE (Cliquable UNIQUEMENT sur Mobile) z-10 ── */}
            <div 
                className="absolute inset-0 z-10 md:hidden cursor-pointer"
                onClick={handleViewProduct}
            />
            
            {/* ── 3. CONTENU CENTRAL (Plus de onClick ici) z-0 ── */}
            <div className="relative z-0 p-3 md:p-5">
                {/* Image du Produit */}
                <div className="relative mx-auto mb-3 md:mb-4 flex h-20 md:h-32 w-full items-center justify-center rounded-xl md:rounded-2xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30 overflow-hidden">
                    {product.imageUrl ? (
                        <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            fill 
                            className="object-cover mix-blend-multiply" 
                        />
                    ) : (
                        <ImageIcon className="h-8 w-8 md:h-10 md:w-10 text-app-secondary" />
                    )}
                    {store.inPromotion && (
                        <div className="absolute top-1.5 left-1.5 bg-red-500 text-white px-2 py-0.5 rounded text-[10px] md:text-xs font-bold z-10">
                            -{store.taux}%
                        </div>
                    )}
                </div>

                {/* Nom du Produit */}
                <h3 className="text-sm md:text-base font-bold text-app-primary mb-1.5 md:mb-2 line-clamp-2 leading-tight">
                    {product.name}
                </h3>

                {/* Nom de la Quincaillerie */}
                <p className="flex items-center text-xs md:text-sm font-medium text-app-secondary mb-1.5 line-clamp-1">
                    <Store className="h-3.5 w-3.5 mr-1.5 shrink-0 text-app-accent" />
                    {store.quincaillerieName}
                </p>

                {/* Note, Distance et Quantité */}
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-app-secondary mb-1 md:mb-2">
                    <span className="flex items-center gap-0.5 bg-app-surface px-2 py-1 rounded-md text-amber-500 font-medium shrink-0">
                        ⭐ 4.5
                    </span>
                    
                    <span className="flex items-center gap-0.5 bg-app-surface px-2 py-1 rounded-md shrink-0">
                        <MapPin className="h-3 w-3 text-app-secondary" /> {getDistanceLabel()}
                    </span>
                    
                    <span className={`flex items-center gap-1 bg-app-surface px-2 py-1 rounded-md shrink-0 ${availableStock <= 0 ? 'text-red-500 font-semibold' : ''}`}>
                        <Package className="h-3 w-3" /> 
                        {availableStock <= 0 ? 'Épuisé' : `${availableStock} dispo`}
                    </span>
                </div>
            </div>
            
            {/* ── 4. ZONE INFÉRIEURE (Boutons Panier) z-20 pour être au-dessus du calque mobile ── */}
            <div className="relative z-20 flex items-center justify-between border-t border-app-surface bg-app-surface px-3 py-2.5 md:px-5 md:py-4">
                <div className="flex flex-col">
                    {store.inPromotion ? (
                        <>
                            <span className="text-[10px] md:text-xs text-app-secondary line-through leading-none mb-0.5">{store.price} F</span>
                            <span className="text-sm md:text-lg font-bold text-app-price-green">{store.pricePromo} F</span>
                        </>
                    ) : (
                        <span className="text-sm md:text-lg font-bold text-app-price-green">{store.price} F</span>
                    )}
                </div>
                
                {/* ZONE DU BOUTON PANIER */}
                <div className="flex-shrink-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-8 md:h-10 px-3">
                            <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-app-accent animate-spin" />
                        </div>
                    ) : availableStock <= 0 ? (
                        <span className="inline-flex items-center justify-center h-8 md:h-10 rounded-full bg-gray-200/60 px-4 md:px-5 text-xs md:text-sm font-semibold text-gray-400 cursor-not-allowed">
                            Rupture
                        </span>
                    ) : quantityInCart === 0 ? (
                        <button 
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center h-8 md:h-10 rounded-full bg-app-secondary px-4 md:px-5 text-xs md:text-sm font-semibold text-app-card transition-all duration-300 hover:bg-app-accent cursor-pointer"
                        >
                            Ajouter
                        </button>
                    ) : (
                        <div className="inline-flex items-center h-8 md:h-10 rounded-full bg-app-accent text-white shadow-sm overflow-hidden">
                            <button 
                                onClick={handleDecrement}
                                className="px-3 md:px-4 h-full hover:bg-black/10 transition-colors flex items-center justify-center text-sm md:text-base font-bold cursor-pointer"
                            >
                                -
                            </button>
                            <span className="px-1 md:px-2 text-xs md:text-sm font-bold min-w-[20px] text-center">
                                {quantityInCart}
                            </span>
                            <button 
                                onClick={handleIncrement}
                                className={`px-3 md:px-4 h-full transition-colors flex items-center justify-center text-sm md:text-base font-bold hover:bg-black/10 cursor-pointer `}
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