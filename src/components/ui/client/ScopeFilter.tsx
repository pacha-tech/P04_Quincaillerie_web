
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Compass } from 'lucide-react';

export default function ScopeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Récupère le scope actuel de l'URL, ou "1km" par défaut
    const currentScope = searchParams.get('scope') || 'ville';

    const scopes = [
        { label: '100m', value: '100m' },
        { label: '500m', value: '500m' },
        { label: '1 Km', value: '1km' },
        { label: '5 Km', value: '5km' },
        { label: 'Ma ville', value: 'ville' },
        { label: 'Ma région', value: 'region' },
    ];

    const handleScopeChange = (newScope: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('scope', newScope);
        router.push(`?${current.toString()}`);
    };

    return (
        <div className="flex items-center gap-1 bg-app-surface p-1 rounded-xl border border-app-primary/5 shadow-inner overflow-x-auto max-w-full">
            <div className="pl-1.5 pr-0.5 text-app-secondary shrink-0">
                <Compass className="h-3.5 w-3.5" />
            </div>
            {scopes.map((sc) => (
                <button
                    key={sc.value}
                    onClick={() => handleScopeChange(sc.value)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${currentScope === sc.value
                            ? 'bg-app-accent text-white shadow-sm scale-105'
                            : 'text-app-secondary hover:text-app-primary hover:bg-app-card'
                        }`}
                >
                    {sc.label}
                </button>
            ))}
        </div>
    );
}