import { Search, AlertCircle } from 'lucide-react';
import { searchProducts } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import LocationButton from './LocationButton';
import SearchResultsList from './SearchResultList';
import { LocationProvider } from '@/src/hooks/LocationContext';
import FilterButton from './FilterButton';

export default async function SearchPage({ query }: { query: string }) {
    let rawProducts: ProductSearch[] = [];
    let groupedProducts: ProductSearch[] = [];
    let errorMessage = "";

    if (query !== "") {
        try {
            rawProducts = await searchProducts(query);
            const mergedProducts = new Map<string, ProductSearch>();
            for (const product of rawProducts) {
                const stores = product.priceSearchProductsDTO || [];
                if (mergedProducts.has(product.name)) {
                    const existingProduct = mergedProducts.get(product.name)!;
                    existingProduct.priceSearchProductsDTO = [
                        ...(existingProduct.priceSearchProductsDTO || []),
                        ...stores
                    ];
                } else {
                    mergedProducts.set(product.name, { ...product });
                }
            }
            groupedProducts = Array.from(mergedProducts.values());
        } catch (error: any) {
            errorMessage = error.message || "Impossible de récupérer les résultats.";
        }
    }

    return (
        
        <div className="p-4 md:p-4 min-h-screen bg-app-surface max-w-7xl mx-4 space-y-8">
            {/* ── En-tête (Design Intact) ── */}
            <div className="fixed top-2 z-30 border border-app-secondary/20 p-5 md:p-6 rounded-2xl md:rounded-3xl bg-app-card shadow-sm w-6/7 md:w-4/6 h-25">
                <div className="flex justify-between items-start mb-1">
                    <p className="hidden md:block text-xs md:text-sm text-app-secondary font-medium">
                        Recherche de matériaux
                    </p>
                </div>
                {query ? (
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                        <h1 className="flex-1 truncate text-xl md:text-3xl font-bold text-app-primary">
                            Résultats pour <span className="text-app-accent">"{query}"</span>
                        </h1>
                        <div className='flex flex-row gap-3 h-8'>
                            {groupedProducts.length > 0 && (
                                <span className="shrink-0 whitespace-nowrap text-xs md:text-sm font-semibold text-app-secondary bg-app-card px-3 py-1.5 rounded-full shadow-sm border border-app-secondary/10 w-fit">
                                    {groupedProducts.length} produit{groupedProducts.length > 1 ? 's' : ''}
                                </span>
                            )}
                        
                            <FilterButton/>
                            <LocationButton />
                    
                        </div>
                    </div>
                ) : (
                    <h1 className="text-2xl md:text-3xl font-bold text-app-primary">Catalogue</h1>
                )}
            </div>

            
            {query === "" && (
                <div className="pt-50 text-center rounded-3xl bg-app-card border border-app-secondary/10 shadow-sm">
                    <Search className="h-10 w-10 text-app-secondary/50 mx-auto mb-3" />
                    <p className="text-base text-app-primary font-semibold">Que cherchez-vous aujourd'hui ?</p>
                </div>
            )}
            {errorMessage && (
                <div className="pt-50 text-center rounded-3xl bg-red-50 border border-red-100">
                    <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <p className="text-base text-red-600 font-semibold">{errorMessage}</p>
                </div>
            )}
            {query !== "" && !errorMessage && groupedProducts.length === 0 && (
                <div className="pt-50 text-center rounded-3xl bg-app-card border border-app-secondary/10 shadow-sm">
                    <Search className="h-10 w-10 text-app-secondary/50 mx-auto mb-3" />
                    <p className="text-base text-app-primary font-semibold">Aucun résultat trouvé pour "{query}"</p>
                </div>
            )}

            
            
            <div className="pt-25">

                {/* ── Liste des Résultats (Composant Client) ── */}
                {query !== "" && groupedProducts.length > 0 && !errorMessage && (
                    <SearchResultsList groupedProducts={groupedProducts} />
                )}
            </div>
        </div>
        
    );
}