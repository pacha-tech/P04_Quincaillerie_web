import { PackageSearch } from 'lucide-react';
import Link from 'next/link';

export default function HistoriquePage() {
  return (
    <div className="flex flex-col h-[70vh] items-center justify-center text-center px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-6">
        <PackageSearch className="w-12 h-12 text-app-accent" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-2xl font-black text-app-primary mb-3">
        Historique des commandes
      </h1>
      
      <p className="text-app-secondary max-w-md mx-auto mb-8 leading-relaxed">
        Vous n'avez pas encore passé de commande. Explorez nos quincailleries partenaires pour trouver ce dont vous avez besoin !
      </p>

      <Link 
        href="/client"
        className="px-6 py-3 bg-app-primary text-white font-medium rounded-xl hover:bg-app-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Commencer mes achats
      </Link>
    </div>
  );
}