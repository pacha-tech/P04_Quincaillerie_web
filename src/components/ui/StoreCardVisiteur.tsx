"use client";

import { Price } from "@/src/types/Price";
import { ProductSearch } from "@/src/types/productSearch";
import ProductCard from "./client/ProductCard";

export default function StoreCardVisiteur({ 
    store, 
    product 
}: { 
    store: Price; 
    product: ProductSearch; 
    userLocation: { latitude: number | null; longitude: number | null } 
}) {
    return (
        <ProductCard 
            idPrice={store.idPrice}
            idQuincaillerie={store.idQuincaillerie}
            name={product.name}
            quincaillerieName={store.quincaillerieName}
            imageUrl={product.imageUrl}
            price={Number(store.price)}
            pricePromo={Number(store.pricePromo)}
            inPromotion={store.inPromotion}
            taux={store.taux}
            stock={(store as any).stock}
            latitudeQuincaillerie={store.latitudeQuincaillerie}
            longitudeQuincaillerie={store.longitudeQuincaillerie}
            hideCartActions={true}
        />
    );
}