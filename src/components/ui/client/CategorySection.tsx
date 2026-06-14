'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, AlertCircle, ArrowRight } from 'lucide-react'; // Ajout de ArrowRight
import Link from 'next/link'; // Import de Link pour la navigation
import { categoryService } from '@/src/services/CategoryService'; 
import { Category, Tracking } from '@/src/types/Category';
import { useRouter } from 'next/navigation';

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleClick = (idCategory: string) => {

    const track:Tracking = {
      idCategory: idCategory,
      actionType: "VIEW_CAT"
    }

    categoryService.trackCategory(track);

    router.push(`/client/category?categoryId=${idCategory}`);
  };

  return (
    <div>
      {/* ── EN-TÊTE : Titre + Bouton "Tout voir" ── */}
      <div className="flex items-end justify-between mb-2 md:mb-3">
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
          <div className="flex gap-2.5 overflow-x-auto px-4 md:px-0 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="snap-start flex-shrink-0 w-28 md:w-36 h-10 md:h-12 rounded-xl px-3 border border-app-surface bg-app-card animate-pulse flex flex-row items-center justify-start gap-2">
                <div className="h-6 w-6 rounded-lg bg-app-surface shrink-0 animate-pulse"></div>
                <div className="h-2.5 w-16 bg-app-surface rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AFFICHAGE DES CATÉGORIES (SCROLL HORIZONTAL + CLIQUABLES) ── */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="-mx-4 md:mx-0 overflow-hidden">
          <div className="flex gap-2.5 overflow-x-auto px-4 md:px-0 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((category) => (
              <button 
                key={category.idCategory} 
                onClick={() => handleClick(category.idCategory)}
                className="group snap-start flex-shrink-0 min-w-[110px] md:min-w-[135px] h-10 md:h-12 rounded-xl px-3 border border-app-surface bg-app-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow active:scale-95 cursor-pointer flex flex-row items-center justify-start gap-2"
              >
                <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-app-surface text-app-secondary transition-colors duration-300 group-hover:bg-app-accent group-hover:text-white shrink-0">
                  <LayoutGrid className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[10px] md:text-xs font-bold text-app-primary line-clamp-1 text-left" title={category.name}>
                  {category.name}
                </h3>
              </button>
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