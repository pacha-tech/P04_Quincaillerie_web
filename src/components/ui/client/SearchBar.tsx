'use client'; // Obligatoire pour l'interactivité

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // 👈 Ajout de usePathname
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname(); // 👈 Permet de lire l'URL actuelle

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // 👈 LA MAGIE EST ICI :
      // Si on est déjà dans /authenticated, on y reste. Sinon on va vers la recherche publique.
      const basePath = pathname.startsWith('/authenticated')
        ? '/authenticated/client/search'
        : '/search';

      router.push(`${basePath}?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-app-text-muted" size={18} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un matériau..."
          className="w-full pl-10 pr-10 py-2 bg-app-surface border border-app rounded-full focus:ring-2 focus:ring-app-accent focus:bg-app-card transition-all outline-none text-sm"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 text-app-text-muted hover:text-app-text-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}