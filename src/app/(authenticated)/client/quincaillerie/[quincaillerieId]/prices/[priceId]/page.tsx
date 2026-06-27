'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import {
  Star, Store, Loader2,
  AlertCircle, Phone, MapPin, Search, Info,
  Package, AlignLeft
} from 'lucide-react';
import { useCart } from '@/src/hooks/CartContext';
import { QuincaillerieDetail } from '@/src/types/QuincaillerieDetail';
import { ProductSearch } from '@/src/types/productSearch';
import { productService } from '@/src/services/ProductService';
import { quincaillerieService } from '@/src/services/QuincaillerieService';
import ProductCard from '@/src/components/ui/client/ProductCard';

export default function QuincaillerieDetailsPage({ params }: { params: Promise<{ quincaillerieId: string; priceId: string }> }) {
  const { quincaillerieId, priceId } = use(params);
  const { items } = useCart();

  const [product, setProduct] = useState<ProductSearch | null>(null);
  const [storeDetail, setStoreDetail] = useState<QuincaillerieDetail | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [productData, storeData] = await Promise.all([
          productService.getProductSearchById(priceId),
          quincaillerieService.getQuincaillerieByIdf(quincaillerieId)
        ]);

        if (!isMounted) return;

        setProduct(productData);
        setStoreDetail(storeData);

        if (productData?.idProduct) {
          const recoData = await productService.getRecommandationByProductAndStore(
            productData.idProduct,
            quincaillerieId
          );

          if (isMounted) {
            setRecommendations(recoData);
          }
        }

      } catch (err: any) {
        if (isMounted) setError(err.message || "Impossible de charger les données");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [quincaillerieId, priceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <Loader2 className="h-9 w-9 animate-spin text-app-accent mb-3" />
        <span className="text-sm text-app-secondary font-medium tracking-wide">Ouverture de la boutique...</span>
      </div>
    );
  }

  if (error || !product || !storeDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-app-surface">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-app-primary font-medium mb-6">{error || "Boutique ou produit introuvable"}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-app-primary text-white rounded-full text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.97] transition-all"
        >
          Retour
        </button>
      </div>
    );
  }

  const mainPrice = product.priceSearchProductsDTO?.find(p => p.idQuincaillerie === quincaillerieId) || product.priceSearchProductsDTO?.[0];
  const isOpen = storeDetail.status?.toLowerCase() === 'ouvert' || storeDetail.status?.toLowerCase() === 'open';

  const filteredRecommendations = recommendations.filter(rec =>
    rec.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    /* 
      L'astuce principale est ici : 
      On bloque le scroll de la page entière (h-[calc(100vh-80px)] ou équivalent, overflow-hidden)
      pour pouvoir gérer le scroll indépendamment dans les colonnes.
    */
    <div className="bg-app-surface h-[calc(100vh-80px)] lg:h-[calc(100vh-90px)] overflow-hidden font-sans text-app-primary">
      <main className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 h-full">

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start h-full">

          {/* =========================================
              COLONNE DE GAUCHE — TOTALEMENT FIXE
          ========================================= */}
          {/* Sur Desktop (lg), la colonne prend 100% de la hauteur dispo (h-full) et masque ce qui dépasse (overflow-hidden) */}
          <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 flex flex-col gap-4 lg:h-full lg:overflow-hidden pb-4">

            {/* 1. PRODUIT PRINCIPAL */}
            {mainPrice && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-app-accent"></span>
                  <h2 className="text-[11px] font-bold text-app-secondary tracking-[0.12em] uppercase">
                    Produit sélectionné
                  </h2>
                </div>

                <div className="w-full max-w-[240px] mx-auto rounded-2xl shadow-md shadow-black/[0.04] bg-white overflow-hidden">
                  <ProductCard
                    idPrice={mainPrice.idPrice}
                    idQuincaillerie={quincaillerieId}
                    name={product.name}
                    quincaillerieName={storeDetail.name}
                    imageUrl={product.imageUrl}
                    price={Number(mainPrice.price)}
                    pricePromo={mainPrice.pricePromo ? Number(mainPrice.pricePromo) : undefined}
                    inPromotion={mainPrice.inPromotion}
                    taux={mainPrice.taux?.toString()}
                    stock={mainPrice.stock}
                    latitudeQuincaillerie={Number(storeDetail.latitude)}
                    longitudeQuincaillerie={Number(storeDetail.longitude)}
                    idCategory={product.idCategory}
                  />
                </div>
              </div>
            )}

            {/* 2. DÉTAILS UTILES DU PRODUIT */}
            {mainPrice && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-black/[0.02] flex flex-col gap-4">
                <h3 className="text-[13px] font-bold text-app-primary">Informations produit</h3>

                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4.5 w-4.5 text-blue-500" />
                  </div>
                  <p className="text-[12px] text-app-secondary font-medium">
                    <span className="text-app-primary font-bold">{mainPrice.stock ?? 0}</span>{' '}
                    {product.unite}{mainPrice.stock > 1 ? 's' : ''} en stock
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100/80 hidden xl:block">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlignLeft className="h-3.5 w-3.5 text-app-secondary" />
                    <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wide">Description</span>
                  </div>
                  <p className="text-xs text-app-secondary leading-relaxed line-clamp-3">
                    {product.description || "Aucune description n'est disponible pour ce produit."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. CARTE BOUTIQUE */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm shadow-black/[0.02] flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden relative border border-gray-100 flex-shrink-0">
                  {storeDetail.photoUrl ? (
                    <Image src={storeDetail.photoUrl} alt={storeDetail.name} fill className="object-cover" />
                  ) : (
                    <Store className="h-5 w-5 text-app-secondary" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h1 className="text-[15px] font-bold text-app-primary line-clamp-1">{storeDetail.name || "Boutique inconnue"}</h1>
                    <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${isOpen ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-app-secondary">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-app-primary">{storeDetail.averageRating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-300">•</span>
                    <span className={`font-semibold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                      {isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="h-3.5 w-3.5 text-app-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-app-primary block">
                      {storeDetail.quartier || "Quartier non renseigné"}, {storeDetail.ville || "Ville non renseignée"}
                    </span>
                    <span className="text-app-secondary">
                      {storeDetail.region || "Région inconnue"}
                      {storeDetail.precision ? ` — ${storeDetail.precision}` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-3.5 w-3.5 text-app-accent flex-shrink-0" />
                  <span className="font-semibold text-app-primary">{storeDetail.telephone || "Numéro non disponible"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* =========================================
              COLONNE DE DROITE : RECOMMANDATIONS (SCROLLABLE INDÉPENDANT)
          ========================================= */}
          {/* h-full + overflow-y-auto crée la zone de scroll interne */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-none pb-12 relative rounded-xl">

            {/* EN-TÊTE COLLANT (STICKY) DANS LA ZONE SCROLLABLE */}
            {/* L'arrière plan bg-app-surface empêche les produits de se voir derrière la barre quand on scroll */}
            <div className="sticky top-0 z-20 bg-app-surface pb-4 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm shadow-black/[0.02]">
                <div className="flex items-center gap-2.5 pl-1">
                  <h3 className="text-[15px] font-bold text-app-primary tracking-tight">
                    {searchTerm ? 'Résultats de recherche' : 'Mes recommandations'}
                  </h3>
                  <span className="text-[11px] text-app-secondary font-bold bg-gray-100 px-2.5 py-1 rounded-full">
                    {filteredRecommendations.length}
                  </span>
                </div>

                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 text-app-primary text-sm font-medium rounded-full focus:ring-2 focus:ring-app-accent/30 focus:border-app-accent focus:bg-white block pl-10 pr-4 py-2.5 transition-all outline-none placeholder:font-normal placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* GRILLE DE RECOMMANDATIONS */}
            {filteredRecommendations.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center shadow-sm shadow-black/[0.02] flex flex-col items-center justify-center min-h-[380px]">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-app-primary text-[15px] font-semibold">Aucune recommandation trouvée</p>
                <p className="text-app-secondary text-sm mt-1">Essayez de modifier votre recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredRecommendations.map((rec) => (
                  <ProductCard
                    key={rec.idPrice}
                    idPrice={rec.idPrice}
                    idQuincaillerie={rec.idQuincaillerie || quincaillerieId}
                    name={rec.name}
                    quincaillerieName={storeDetail.name}
                    imageUrl={rec.imageUrl}
                    price={Number(rec.sellPrice || rec.price)}
                    pricePromo={rec.pricePromo ? Number(rec.pricePromo) : undefined}
                    inPromotion={rec.inPromotion || rec.inPromo}
                    taux={rec.taux?.toString()}
                    stock={rec.stock || 0}
                    latitudeQuincaillerie={Number(storeDetail.latitude)}
                    longitudeQuincaillerie={Number(storeDetail.longitude)}
                    idCategory={rec.idCategory || product.idCategory}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}