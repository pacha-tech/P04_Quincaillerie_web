import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function FavorisPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-app-surface">
      <div className="bg-app-card border border-app-surface/50 shadow-sm rounded-3xl p-8 md:p-12 text-center max-w-md w-full transition-all duration-300 hover:shadow-md">
        <div className="mx-auto flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-red-50 text-app-error mb-6 border-4 border-white shadow-inner">
          <Heart className="h-10 w-10 md:h-12 md:w-12 fill-current opacity-20" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-app-primary mb-3">Mes Favoris</h1>
        <p className="text-sm md:text-base text-app-secondary mb-8">
          C'est un peu vide par ici ! Bientôt, vous pourrez sauvegarder vos articles de quincaillerie préférés pour les retrouver en un clic.
        </p>

        <Link 
          href="/authenticated/client" 
          className="inline-flex items-center justify-center gap-2 rounded-full bg-app-surface px-6 py-3 text-sm font-semibold text-app-primary transition-all hover:bg-app-accent hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}