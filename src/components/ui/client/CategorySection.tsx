'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, AlertCircle, ArrowRight } from 'lucide-react'; // Ajout de ArrowRight
import Link from 'next/link'; // Import de Link pour la navigation
import { categoryService } from '@/src/services/CategoryService'; 
import { Category } from '@/src/types/Category';

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getAllCategory();
        setCategories(data);
      } catch (err) {
        setError("Impossible de charger les catégories.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* ── EN-TÊTE : Titre + Bouton "Tout voir" ── */}
      <div className="flex items-end justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-app-primary">Catégories populaires</h2>
        <Link 
          href="/client/category"
          className="group flex items-center gap-1 text-xs md:text-sm font-medium text-app-accent hover:text-app-primary transition-colors"
        >
          Tout voir 
          <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* ── CHARGEMENT (SCROLL HORIZONTAL) ── */}
      {isLoading && !error && (
        <div className="-mx-4 md:mx-0 overflow-hidden">
          {/* Suppression de grid, utilisation de flex avec overflow-x-auto */}
          <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="snap-start flex-shrink-0 w-[120px] md:w-[150px] h-28 md:h-32 rounded-2xl p-3 border border-app-surface bg-app-card animate-pulse flex flex-col justify-center">
                <div className="mb-2 h-8 w-8 rounded-xl bg-app-surface"></div>
                <div className="h-3 w-3/4 bg-app-surface rounded mb-1"></div>
                <div className="h-2 w-full bg-app-surface rounded"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AFFICHAGE DES CATÉGORIES (SCROLL HORIZONTAL + CLIQUABLES) ── */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="-mx-4 md:mx-0 overflow-hidden">
          <div className="flex gap-3 overflow-x-auto px-4 md:px-0 pb-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category) => (
            
              <Link 
                key={category.idCategory} 
                href={`/client/category?categoryId=${category.idCategory}`}
                className="group snap-start flex-shrink-0 w-[120px] md:w-[170px] h-28 md:h-32 rounded-2xl p-3 border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-2">
                    <div className="mb-2 flex items-center justify-center h-8 w-8 rounded-xl bg-app-surface text-app-secondary transition-colors duration-300 group-hover:bg-app-accent group-hover:text-white">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <h3 className="text-xs md:text-sm font-semibold text-app-primary mb-0.5 line-clamp-1" title={category.name}>
                      {category.name}
                    </h3>
                </div>
                
                <p className="text-[10px] md:text-xs text-app-secondary line-clamp-2 leading-tight" title={category.description}>
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {!isLoading && !error && categories.length === 0 && (
        <p className="text-sm text-app-secondary">Aucune catégorie disponible.</p>
      )}
    </div>
  );
}