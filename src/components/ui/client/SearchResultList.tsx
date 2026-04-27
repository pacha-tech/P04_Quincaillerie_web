"use client";

import { useLocation } from '@/src/hooks/LocationContext';
import StoreCard from './StoreCard';
import { ProductSearch } from '@/src/types/productSearch';
import { Price } from '@/src/types/Price';
import { calculateDistance } from '@/src/utils/Distance';

export default function SearchResultsList({ groupedProducts }: { groupedProducts: ProductSearch[] }) {
    const { latitude, longitude, sortBy } = useLocation();

    const getSortedStores = (stores: any[]) => {
        return [...stores].sort((a, b) => {
            // On vérifie si la boutique a un prix promo, sinon on prend le prix normal
            const priceA = a.inPromotion ? Number(a.pricePromo) : Number(a.price);
            const priceB = b.inPromotion ? Number(b.pricePromo) : Number(b.price);
            
            if (sortBy === 'price-asc') return priceA - priceB;
            if (sortBy === 'price-desc') return priceB - priceA;
            if (sortBy === 'distance') {
                const distA = (latitude && longitude && a.latitude && a.longitude) 
                    ? calculateDistance(latitude, longitude, a.latitude, a.longitude) : Infinity;
                const distB = (latitude && longitude && b.latitude && b.longitude) 
                    ? calculateDistance(latitude, longitude, b.latitude, b.longitude) : Infinity;
                return distA - distB;
            }
            return 0; // 'default'
        });
    };

    return (
        <div className="space-y-1 md:mt-2">
            {groupedProducts.map((product) => {
                const stores = product.priceSearchProductsDTO || [];
                const sortedStores = getSortedStores(stores);
                return (
                    <section key={product.idProduct} className="relative z-20 flex flex-col gap-4 w-full overflow-hidden mt-0">
                        <div className="flex items-center gap-3 px-1">
                            <h2 className="text-lg md:text-xl font-bold text-app-primary capitalize">
                                {product.name}
                            </h2>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-app-card border border-app-secondary/20 rounded-full shadow-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span className="text-[10px] md:text-xs font-semibold text-app-secondary">
                                    {stores.length} point{stores.length > 1 ? 's' : ''} de vente
                                </span>
                            </div>
                        </div>

                        <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 snap-x snap-mandatory px-1 mt-0
                            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {sortedStores.map((store: Price, idx: number) => (
                                <div key={idx} className="snap-start shrink-0 w-[160px] md:w-[220px]">
                                    <StoreCard 
                                        store={store} 
                                        product={product} 
                                        userLocation={{ latitude, longitude}} 
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}