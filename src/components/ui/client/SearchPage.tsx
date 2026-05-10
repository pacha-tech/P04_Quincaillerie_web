
{/*
import { Suspense } from 'react';
import { Search, AlertCircle, PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import LocationButton from './LocationButton';
import SearchResultsList from './SearchResultList';
import FilterButton from './FilterButton';
import SearchSkeleton from './SearchSkeleton'; // 👈 Ton nouveau Skeleton

// 1️⃣ LE COMPOSANT ASYNCHRONE QUI FAIT LE FETCH
async function SearchResultsFetcher({ query }: { query: string }) {
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
        const rawProducts = await productService.searchProducts(query);
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

        // Si aucun résultat
        if (groupedProducts.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                    <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                        <PackageX className="h-10 w-10 text-app-secondary/50" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Aucun résultat</h2>
                    <p className="text-sm text-app-secondary max-w-md">
                        Nous n'avons trouvé aucun article correspondant à <span className="font-bold text-app-primary">"{query}"</span>. Essayez de vérifier l'orthographe ou d'utiliser des termes plus généraux.
                    </p>
                </div>
            );
        }

        // Succès
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


export default function SearchPage({ query }: { query: string }) {
    return (
        <div className="min-h-screen bg-app-surface w-full animate-in fade-in duration-500 pb-12">
            
         
            <div className="sticky top-0 z-40 w-full bg-app-surface px-4 md:px-6 pt-4 pb-2 md:pt-6 md:pb-4">
                <div className="absolute bottom-full left-0 right-0 h-40 bg-app-surface pointer-events-none z-0"></div>

                <div className="w-full bg-app-card border border-app-primary/5 p-3 md:px-5 md:py-3 rounded-2xl md:rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <Link 
                            href="/" 
                            className=" md:hidden group inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-app-secondary hover:text-app-primary transition-colors shrink-0"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            Retour
                        </Link>


                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            {query ? (
                                <>
                                    <span className="text-xs md:text-sm text-app-secondary font-medium tracking-wide">
                                        Résultats pour
                                    </span>
                                    <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight line-clamp-1">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">
                                            "{query}"
                                        </span>
                                    </h1>
                                </>
                            ) : (
                                <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight mt-1 md:mt-0">
                                    Trouvez vos matériaux
                                </h1>
                            )}
                        </div>
                    </div>

                    {query && (
                        <div className="flex items-center flex-wrap gap-2 md:gap-3 shrink-0 mt-1 md:mt-0">
                            <FilterButton />
                            <LocationButton />
                        </div>
                    )}
                </div>
                <div className="absolute top-full left-0 right-0 h-8 md:h-12 bg-gradient-to-b from-app-surface to-transparent pointer-events-none z-10"></div>
            </div>

            
            <div className="relative flex flex-col gap-8 px-4 md:px-6 mt-4 relative z-0">
                <Suspense key={query} fallback={<SearchSkeleton />}>
                    <SearchResultsFetcher query={query} />
                </Suspense>
            </div>
            
        </div>
    );
}
    */}

    import { Suspense } from 'react';
import { Search, AlertCircle, PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import LocationButton from './LocationButton';
import SearchResultsList from './SearchResultList';
import FilterButton from './FilterButton';
import SearchSkeleton from './SearchSkeleton';

// 1️⃣ LE COMPOSANT ASYNCHRONE QUI FAIT LE FETCH
async function SearchResultsFetcher({ query }: { query: string }) {
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
        const rawProducts = await productService.searchProducts(query);
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

        // Si aucun résultat
        if (groupedProducts.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                    <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                        <PackageX className="h-10 w-10 text-app-secondary/50" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Aucun résultat</h2>
                    <p className="text-sm text-app-secondary max-w-md">
                        Nous n'avons trouvé aucun article correspondant à <span className="font-bold text-app-primary">"{query}"</span>. Essayez de vérifier l'orthographe ou d'utiliser des termes plus généraux.
                    </p>
                </div>
            );
        }

        // Succès
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


export default function SearchPage({ query }: { query: string }) {
    return (
        <div className="min-h-screen bg-app-surface w-full animate-in fade-in duration-500 pb-12">
            
            {/* ── CORRECTION ICI : passage en "fixed top-0 left-0 right-0" ── */}
            <div className="sticky top-0 left-0 right-0 z-40 bg-app-surface px-4 md:px-6 pt-4 pb-2 md:pt-6 md:pb-4">
                <div className="absolute bottom-full left-0 right-0 h-1 bg-app-surface pointer-events-none z-0"></div>

                <div className="w-full bg-app-card border border-app-primary/5 p-3 md:px-5 md:py-3 rounded-2xl md:rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <Link 
                            href="/" 
                            className=" md:hidden group inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-app-secondary hover:text-app-primary transition-colors shrink-0"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                            Retour
                        </Link>


                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            {query ? (
                                <>
                                    <span className="text-xs md:text-sm text-app-secondary font-medium tracking-wide">
                                        Résultats pour
                                    </span>
                                    <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight line-clamp-1">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">
                                            "{query}"
                                        </span>
                                    </h1>
                                </>
                            ) : (
                                <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight mt-1 md:mt-0">
                                    Trouvez vos matériaux
                                </h1>
                            )}
                        </div>
                    </div>

                    {query && (
                        <div className="flex items-center flex-wrap gap-2 md:gap-3 shrink-0 mt-1 md:mt-0">
                            <FilterButton />
                            <LocationButton />
                        </div>
                    )}
                </div>
               {/*<div className="absolute top-full left-0 right-0 h-8 md:h-12 bg-gradient-to-b from-app-surface to-transparent pointer-events-none z-10"></div>*/}
            </div>

            {/* ── CORRECTION ICI : Ajout de l'espacement "pt-36 md:pt-40" ── */}
            <div className="relative flex flex-col gap-8 px-4 md:px-6 pt-30 md:pt-5 z-0">
                <Suspense key={query} fallback={<SearchSkeleton />}>
                    <SearchResultsFetcher query={query} />
                </Suspense>
            </div>
            
        </div>
    );
}