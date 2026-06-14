'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import { useLocation } from '@/src/hooks/LocationContext';
import ProductCard from './ProductCard';

export default function PromotionsSection({ scope = 'ville' }: { scope?: string }) {
  const [promotedProducts, setPromotedProducts] = useState<ProductSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, loading: locationLoading } = useLocation();

  useEffect(() => {
    if (locationLoading) return;

    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getPromotedProducts(latitude, longitude, scope);
        setPromotedProducts(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les promotions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, [latitude, longitude, locationLoading, scope]);

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-1 md:mb-2">🔥 En promotion</h2>
        <p className="text-xs md:text-sm text-app-secondary">Profitez de nos offres exceptionnelles cette semaine</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-app-accent mb-2" />
          <span className="text-sm text-app-secondary">Chargement des promos...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs font-bold underline text-red-700">Réessayer</button>
        </div>
      )}

      {!isLoading && !error && promotedProducts.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-app-surface rounded-3xl">
          <p className="text-app-secondary text-sm italic">Aucune promotion disponible pour le moment.</p>
        </div>
      )}

      {!isLoading && !error && promotedProducts.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {promotedProducts.map((product) => {
            const activePrice = product.priceSearchProductsDTO.find(p => p.inPromotion) || product.priceSearchProductsDTO[0];
            return (
              <ProductCard
                key={product.idProduct}
                idPrice={activePrice.idPrice}
                idQuincaillerie={activePrice.idQuincaillerie}
                name={product.name}
                quincaillerieName={activePrice.quincaillerieName}
                imageUrl={product.imageUrl}
                price={Number(activePrice.price)}
                pricePromo={Number(activePrice.pricePromo)}
                inPromotion={activePrice.inPromotion}
                taux={activePrice.taux}
                stock={activePrice.stock}
                latitudeQuincaillerie={activePrice.latitudeQuincaillerie}
                longitudeQuincaillerie={activePrice.longitudeQuincaillerie}
                idCategory={product.idCategory}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}