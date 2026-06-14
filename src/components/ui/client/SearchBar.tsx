'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import useSWR from 'swr';
import { productService } from '@/src/services/ProductService';
import { ProductSuggestion } from '@/src/types/ProductSuggestion';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: allSuggestions, isLoading, error } = useSWR<ProductSuggestion[]>('product-suggestions', () => productService.getSuggestions(),
    {
      dedupingInterval: 600000,
      revalidateOnFocus: false,
    }
  );

  const filteredSuggestions = query.trim().length > 0 && allSuggestions
    ? allSuggestions.filter((item) =>
        item.nom.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      const basePath = pathname.startsWith('/client')
        ? '/client/search'
        : '/search';

      router.push(`${basePath}?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectSuggestion = (idProduct: string, productName: string) => {
    setQuery(productName);
    setShowSuggestions(false);
    
    const basePath = pathname.startsWith('/client') ? '/client/search' : '/search';
    router.push(`${basePath}?q=${encodeURIComponent(productName)}`);
  };

  const renderHighlightedText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;

    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <strong key={index} className="text-app-accent font-semibold">
              {part}
            </strong>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          {isLoading && !allSuggestions ? (
             <Loader2 className="absolute left-3 text-app-accent animate-spin" size={18} />
          ) : (
            <Search className="absolute left-3 text-app-text-muted" size={18} />
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (query.length > 0) setShowSuggestions(true);
            }}
            placeholder="Rechercher un matériau..."
            className="w-full pl-10 pr-10 py-2 bg-app-surface border border-app rounded-full focus:ring-2 focus:ring-app-accent focus:bg-app-card transition-all outline-none text-sm"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 text-app-text-muted hover:text-app-text-secondary"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* --- MENU DÉROULANT DES SUGGESTIONS --- */}
      {showSuggestions && query.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-app-surface border border-app rounded-xl shadow-lg z-50 overflow-hidden">
          
          {error && (
            <div className="p-3 text-center text-xs text-red-500">
              Impossible de charger les suggestions.
            </div>
          )}

          {!isLoading && filteredSuggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto py-2">
              {filteredSuggestions.map((item) => (
                <li 
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item.id, item.nom)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-app-card cursor-pointer transition-colors"
                >
                  <Search size={14} className="text-app-text-muted shrink-0" />
                  
                  <span className="text-sm text-app-text-primary truncate">
                    {renderHighlightedText(item.nom, query)}
                  </span>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded ml-auto whitespace-nowrap shrink-0">
                    {item.categoryName}
                  </span>
                </li>
              ))}
            </ul>
          ) : !isLoading && filteredSuggestions.length === 0 ? (
            <div className="p-3 text-center text-xs text-app-text-muted">
              Aucun matériau trouvé pour "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}