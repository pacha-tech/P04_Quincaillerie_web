"use client";

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocation } from '@/src/hooks/LocationContext';
import { Search, AlertCircle, PackageX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { productService } from '@/src/services/ProductService';
import { ProductSearch } from '@/src/types/productSearch';
import SearchResultsList from './SearchResultList';
import FilterButton from './FilterButton';
import SearchSkeleton from './SearchSkeleton';
import ScopeFilter from './ScopeFilter';



function URLCoordinatesSynchronizer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { latitude, longitude } = useLocation();

    useEffect(() => {
        
        if (!latitude || !longitude) return;

        
        const hasLatInUrl = searchParams.has('lat');
        const hasLngInUrl = searchParams.has('lng');

        
        if (!hasLatInUrl || !hasLngInUrl) {
            const current = new URLSearchParams(Array.from(searchParams.entries()));
            current.set('lat', latitude.toString());
            current.set('lng', longitude.toString());
            
            if (!current.get('scope')) {
                current.set('scope', '1km');
            }
            
            
            router.replace(`?${current.toString()}`);
        }
    }, [latitude, longitude, searchParams, router]);

    return null;
}

interface SearchPageProps {
    query: string;
    children: React.ReactNode;
}


export default function SearchPage({ query, children }: SearchPageProps) {
    return (
        <div className="min-h-screen bg-app-surface w-full animate-in fade-in duration-500 pb-12">
            <URLCoordinatesSynchronizer />
            
            <div className="sticky top-0 left-0 right-0 z-40 bg-app-surface px-4 md:px-6 pt-4 pb-2 md:pt-6 md:pb-4">
                <div className="absolute bottom-full left-0 right-0 h-1 bg-app-surface pointer-events-none z-0"></div>

                <div className="w-full bg-app-card border border-app-primary/5 p-3 md:px-5 md:py-3 rounded-2xl md:rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 relative z-10">
                    
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-4">
                        <Link 
                            href="/" 
                            className="md:hidden group inline-flex items-center gap-1.5 text-[10px] font-semibold text-app-secondary hover:text-app-primary transition-colors shrink-0"
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
                                <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight">
                                    Trouvez vos matériaux
                                </h1>
                            )}
                        </div>
                    </div>

                    {query && (
                        <div className="flex items-center flex-wrap gap-2 md:gap-3 shrink-0 mt-1 md:mt-0">
                        
                            <ScopeFilter />
                            <FilterButton />
                            {/*<LocationButton />*/}
                        </div>
                    )}
                </div>
            </div>

            <div className="relative flex flex-col gap-8 px-4 md:px-6 pt-6 z-0">
                {children}
            </div>
        </div>
    );
}