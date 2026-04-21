"use client";

import { useLocation } from '@/src/hooks/LocationContext';
import StoreCard from './StoreCard';
import { ProductSearch } from '@/src/types/productSearch';
import { Price } from '@/src/types/Price.service';

export default function SearchResultsList({ groupedProducts }: { groupedProducts: ProductSearch[] }) {
    const { latitude, longitude } = useLocation();

    return (
        <div className="space-y-1 md:mt-2">
            {groupedProducts.map((product) => {
                const stores = product.priceSearchProductsDTO || [];
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
                            {stores.map((store: Price, idx: number) => (
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