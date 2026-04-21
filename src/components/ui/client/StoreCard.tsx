"use client";

import Image from 'next/image';
import { ArrowRight, Image as ImageIcon, MapPin } from 'lucide-react';
import { calculateDistance } from '@/src/utils/Distance';
import { Price } from '@/src/types/Price.service';
import { ProductSearch } from '@/src/types/productSearch';

export default function StoreCard({ store, product, userLocation }: { store: Price; product: ProductSearch; userLocation: { latitude: number | null; longitude: number | null } }) {
    console.log("TEST DISTANCE - User:", userLocation, "Store:", { lat: store.latitudeQuincaillerie, lon: store.longitudeQuincaillerie });

    const getDistanceLabel = () => {
        if (userLocation.latitude && userLocation.longitude && store.latitudeQuincaillerie && store.longitudeQuincaillerie) {
            const dist = calculateDistance(
                userLocation.latitude, userLocation.longitude,
                store.latitudeQuincaillerie, store.longitudeQuincaillerie
            );
            return `${dist} km`;
        }
        return "...";
    };

    return (
        <div className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
            <button className="absolute top-2 right-2 md:top-5 md:right-5 z-10 flex items-center gap-1 rounded-full bg-app-card/90 px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-medium text-app-primary opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:bg-app-accent group-hover:text-app-card shadow-sm cursor-pointer">
                Voir <ArrowRight className="h-3 w-3" />
            </button>
            
            <div className="p-2.5 md:p-4">
                <div className="relative mx-auto mb-2 md:mb-3 flex h-16 md:h-24 w-full items-center justify-center rounded-xl md:rounded-2xl bg-app-surface shadow-sm transition-all duration-300 group-hover:scale-105 border-2 border-dashed border-app-secondary/30 overflow-hidden">
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
                        <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                            -{store.taux}%
                        </div>
                    )}
                </div>
                <h3 className="text-xs md:text-base font-semibold text-app-primary mb-0.5 md:mb-1 line-clamp-1">
                    {store.quincaillerieName}
                </h3>
                <p className="flex items-center text-[10px] md:text-xs text-app-secondary mb-2 md:mb-3 line-clamp-1">
                    <span className="text-amber-500 mr-1">⭐ 4.5</span>  <MapPin className="h-2.5 w-2.5 mx-1" /> {getDistanceLabel()}
                </p>
            </div>
            
            <div className="flex items-center justify-between border-t border-app-surface bg-app-surface px-2.5 py-2 md:px-4 md:py-3">
                <div className="flex flex-col">
                    {store.inPromotion ? (
                        <>
                            <span className="text-[9px] text-app-secondary line-through mb-0.5">{store.price} F</span>
                            <span className="text-xs md:text-base font-bold text-app-accent leading-none">{store.pricePromo} F</span>
                        </>
                    ) : (
                        <span className="text-xs md:text-base font-bold text-app-accent">{store.price} F</span>
                    )}
                </div>
                <span className="inline-flex items-center rounded-full bg-app-secondary px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-xs font-semibold text-app-card transition-all duration-300 group-hover:bg-app-accent cursor-pointer">
                    Ajouter
                </span>
            </div>
        </div>
    );
}