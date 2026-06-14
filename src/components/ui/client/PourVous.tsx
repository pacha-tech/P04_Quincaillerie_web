'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { productService } from '@/src/services/ProductService';
import { ProductInCategory } from '@/src/types/ProductInCategory';
import { useLocation } from '@/src/hooks/LocationContext';
import ProductCard from './ProductCard';

export default function PourVousSection({ scope = 'ville' }: { scope?: string }) {
  const [products, setProducts] = useState<ProductInCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, loading: locationLoading } = useLocation();

  useEffect(() => {
    if (locationLoading) return;

    const fetchPourVous = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // On envoie la localisation et le scope dynamique
        const data = await productService.getForYouProducts(latitude, longitude, scope);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les recommandations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPourVous();
  }, [latitude, longitude, locationLoading, scope]);

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-app-primary mb-1 md:mb-2">Pour vous</h2>
        <p className="text-xs md:text-sm text-app-secondary">Découvrez nos produits les plus demandés</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-app-accent mb-2" />
          <span className="text-sm text-app-secondary">Recherche de vos recommandations...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs font-bold underline text-red-700">Réessayer</button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-app-surface rounded-3xl">
          <p className="text-app-secondary text-sm italic">Aucun produit recommandé à proximité pour le moment.</p>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.idPrice}
              idPrice={product.idPrice}
              idQuincaillerie={product.idQuincaillerie}
              name={product.name}
              quincaillerieName={product.quincaillerieName}
              imageUrl={product.imageUrl}
              price={Number(product.sellPrice)}
              pricePromo={product.pricepromo ? Number(product.pricepromo) : undefined}
              inPromotion={product.inPromotion}
              taux={product.taux}
              stock={product.stock}
              latitudeQuincaillerie={product.latitudeQuincaillerie}
              longitudeQuincaillerie={product.longitudeQuincaillerie}
              idCategory={product.idCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}