"use client";
import { useLocation } from '@/src/hooks/LocationContext';
import { ArrowDownAZ, ArrowDown01, ArrowUp10, MapPin } from 'lucide-react';

export default function FilterButton() {
    
    const { sortBy, setSortBy } = useLocation();

    return (
        <div className="relative inline-flex items-center">
            <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-app-surface border border-app-secondary/20 text-xs py-1.5 pl-2.5 pr-7 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-app-accent cursor-pointer"
            >
                <option value="dfault">Prix Croissant</option>
                <option value="price-desc">Prix Décroissant</option>
                <option value="distance">Le plus proche</option>
            </select>
            {/* L'icône change en fonction du state sortBy */}
            <div className="absolute right-2 pointer-events-none text-app-secondary">
                {sortBy === 'default' ? <ArrowDown01 className="h-3 w-3" /> : 
                 sortBy === 'price-desc' ? <ArrowUp10 className="h-3 w-3" /> : 
                 sortBy === 'distance' ? <MapPin className="h-3 w-3" /> : 
                 <ArrowDownAZ className="h-3 w-3" />}
            </div>
        </div>
    );
}