import { Search, AlertCircle, PackageX } from 'lucide-react';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import SearchResultsList from './SearchResultList'; // Ton composant client de rendu de liste

interface SearchPageProps {
    query: string;
    lat: number | null;
    lng: number | null;
    scope: string;
}

export async function SearchResultsServerWrapper({ query, lat, lng, scope }: SearchPageProps) {
    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                    <Search className="h-10 w-10 text-app-secondary/50" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Que cherchez-vous aujourd'hui ?</h2>
                <p className="text-sm text-app-secondary max-w-md">
                    Tapez le nom d'un matériau, d'un outil ou d'une marque dans la barre de recherche ci-dessus pour commencer.
                </p>
            </div>
        );
    }

    try {
        const rawProducts = await productService.searchProducts(query, lat, lng, scope);
        const mergedProducts = new Map<string, ProductSearch>();
        
        for (const product of rawProducts) {
            const stores = product.priceSearchProductsDTO || [];
            const normalizedName = product.name.trim().toLowerCase();
            if (mergedProducts.has(normalizedName)) {
                const existingProduct = mergedProducts.get(normalizedName)!;
                existingProduct.priceSearchProductsDTO = [
                    ...(existingProduct.priceSearchProductsDTO || []),
                    ...stores
                ];
            } else {
                mergedProducts.set(normalizedName, { ...product });
            }
        }
        
        const groupedProducts = Array.from(mergedProducts.values());

        if (groupedProducts.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                    <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                        <PackageX className="h-10 w-10 text-app-secondary/50" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Aucun résultat</h2>
                    <p className="text-sm text-app-secondary max-w-md">
                        Nous n'avons trouvé aucun article correspondant à <span className="font-bold text-app-primary">"{query}"</span>.
                    </p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-8">
                <div className="px-4 md:px-6">
                    <span className="px-3 py-1 text-xs font-bold text-app-accent bg-app-accent/10 rounded-full border border-app-accent/20">
                        {groupedProducts.length} produit{groupedProducts.length > 1 ? 's' : ''} trouvé{groupedProducts.length > 1 ? 's' : ''}
                    </span>
                </div>
                <SearchResultsList groupedProducts={groupedProducts} />
            </div>
        );

    } catch (error: any) {
        // MAINTENANT, CE BLOC VA PARFAITEMENT S'AFFICHER !
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-red-50/50 rounded-[2rem] border border-red-100">
                <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 text-red-500">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-lg font-bold text-red-700 mb-1">Oups, un problème est survenu</h2>
                <p className="text-sm text-red-600/80">{error.message || "Impossible de récupérer les résultats."}</p>
            </div>
        );
    }
}