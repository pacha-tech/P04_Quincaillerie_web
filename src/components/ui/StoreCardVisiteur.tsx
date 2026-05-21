import { Price } from "@/src/types/Price";
import { ProductSearch } from "@/src/types/productSearch";
import { calculateDistance } from "@/src/utils/Distance";
import { ArrowRight, ImageIcon, MapPin, Package, Store } from "lucide-react";
import { useRouter } from "next/router";
import Image from 'next/image';


export default function StoreCardVisiteur({ 
    store, 
    product, 
    userLocation 
}: { 
    store: Price; 
    product: ProductSearch; 
    userLocation: { latitude: number | null; longitude: number | null } 
}) {
    
    const router = useRouter();
    const availableStock = (store as any).stock ?? 0;

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
            </div>
        </div>
    );
}