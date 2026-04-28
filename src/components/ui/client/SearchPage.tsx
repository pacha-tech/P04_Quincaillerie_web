/*
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

                
                {query !== "" && groupedProducts.length > 0 && !errorMessage && (
                    <SearchResultsList groupedProducts={groupedProducts} />
                )}
            </div>
        </div>
        
    );
}
    */


import { Search, AlertCircle, PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { searchProducts } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import LocationButton from './LocationButton';
import SearchResultsList from './SearchResultList';
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
        <div className="min-h-screen bg-app-surface w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
            
            {/* ── EN-TÊTE DE RECHERCHE (Bloqué en haut / Sticky) ── */}
            <div className="sticky top-0 z-40 bg-app-card/90 backdrop-blur-xl border border-app-primary/5 p-6 md:p-8 rounded-[2rem] shadow-md flex flex-col gap-3 transition-all">
                
                {/* BOUTON RETOUR DISCRET */}
                <Link 
                    href="/" 
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-app-secondary hover:text-app-primary transition-colors w-fit"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    Retour
                </Link>

                <div className="flex justify-between items-start mt-1">
                    <p className="text-xs md:text-sm text-app-secondary font-bold tracking-wider uppercase">
                        {query ? "Résultats de recherche" : "Catalogue"}
                    </p>
                </div>

                {query ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
                        <h1 className="flex-1 text-2xl md:text-4xl font-black text-app-primary tracking-tight line-clamp-2">
                            Pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">"{query}"</span>
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {groupedProducts.length > 0 && (
                                <span className="px-4 py-2 text-xs md:text-sm font-bold text-app-accent bg-app-accent/10 rounded-full border border-app-accent/20">
                                    {groupedProducts.length} produit{groupedProducts.length > 1 ? 's' : ''}
                                </span>
                            )}
                            <FilterButton />
                            <LocationButton />
                        </div>
                    </div>
                ) : (
                    <h1 className="text-2xl md:text-4xl font-black text-app-primary tracking-tight mt-1">
                        Trouvez vos matériaux
                    </h1>
                )}
            </div>

            {/* ── ZONE QUI DÉFILE (États & Résultats) ── */}
            <div className="flex flex-col gap-8 pb-12">
                
                {/* État 1 : Aucune recherche en cours */}
                {query === "" && (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                        <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                            <Search className="h-10 w-10 text-app-secondary/50" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Que cherchez-vous aujourd'hui ?</h2>
                        <p className="text-sm text-app-secondary max-w-md">
                            Tapez le nom d'un matériau, d'un outil ou d'une marque dans la barre de recherche ci-dessus pour commencer.
                        </p>
                    </div>
                )}

                {/* État 2 : Erreur de serveur ou de connexion */}
                {errorMessage && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-red-50/50 rounded-[2rem] border border-red-100">
                        <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4 text-red-500">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-lg font-bold text-red-700 mb-1">Oups, un problème est survenu</h2>
                        <p className="text-sm text-red-600/80">{errorMessage}</p>
                    </div>
                )}

                {/* État 3 : Aucun résultat trouvé */}
                {query !== "" && !errorMessage && groupedProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-app-card rounded-[2rem] border border-app-primary/5 shadow-sm">
                        <div className="h-20 w-20 bg-app-surface rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                            <PackageX className="h-10 w-10 text-app-secondary/50" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-app-primary mb-2">Aucun résultat</h2>
                        <p className="text-sm text-app-secondary max-w-md">
                            Nous n'avons trouvé aucun article correspondant à <span className="font-bold text-app-primary">"{query}"</span>. Essayez de vérifier l'orthographe ou d'utiliser des termes plus généraux.
                        </p>
                    </div>
                )}

                {/* Liste des résultats */}
                {query !== "" && groupedProducts.length > 0 && !errorMessage && (
                    <SearchResultsList groupedProducts={groupedProducts} />
                )}
            </div>
            
        </div>
    );
}