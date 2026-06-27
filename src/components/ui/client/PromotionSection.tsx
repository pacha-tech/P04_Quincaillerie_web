'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, ShoppingBag } from 'lucide-react';
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
      {/* --- ETAT DE CHARGEMENT : SKELETONS --- */}
      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {/* --- ETAT D'ERREUR --- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs font-bold underline text-red-700">
            Réessayer
          </button>
        </div>
      )}

      {/* --- ETAT VIDE --- */}
      {!isLoading && !error && promotedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-app-card border border-app-surface rounded-2xl md:rounded-3xl shadow-sm text-center">
          <div className="bg-orange-50 p-4 rounded-full mb-4">
            <ShoppingBag className="h-10 w-10 text-orange-400" /> 
          </div>
          <h3 className="text-base md:text-lg font-bold text-app-primary mb-2">
            Aucune promotion en cours
          </h3>
          <p className="text-xs md:text-sm text-app-secondary max-w-md">
            Il n'y a pas d'offres à proximité pour le moment. Revenez un peu plus tard pour ne rater aucune de nos prochaines réductions !
          </p>
        </div>
      )}
      
      {/* --- ETAT SUCCES : BANNIERE + PRODUITS --- */}
      {!isLoading && !error && promotedProducts.length > 0 && (
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Bannière Promotionnelle */}
          <div className="bg-gradient-to-r from-app-accent to-app-primary rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black mb-0.5">🔥 Jusqu'à -30% ce mois-ci</h2>
              <p className="text-[11px] opacity-85">Sur nos outils en promo</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-2xl">⚡</span>
            </div>
          </div>

          {/* Grille de produits */}
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
        </div>
      )}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
      <div className="w-full h-32 md:h-40 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
      <div className="mt-auto pt-2 flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded-full w-2/3"></div>
        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}