import Link from 'next/link';
import { Store, LifeBuoy, ShieldCheck, Headphones } from 'lucide-react';

export default function VendeurFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-app-primary text-white pt-10 pb-6 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
          
          {/* Colonne 1 : Marque Partenaire */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="text-app-accent font-medium text-sm ml-1">Brixel</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              L'outil de gestion dédié aux quincailleries. Développez votre chiffre d'affaires en vendant vos matériaux en ligne.
            </p>
          </div>

          {/* Colonne 2 : Gestion Boutique */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs text-white/50">Gestion de boutique</h4>
            <ul className="space-y-2.5 text-sm text-white/80 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Tableau de bord</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Gestion des produits</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Commandes en cours</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Portefeuille & Paiements</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Ressources Vendeur */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs text-white/50">Ressources</h4>
            <ul className="space-y-2.5 text-sm text-white/80 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Guide d'utilisation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Commissions et Tarifs</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Outils marketing</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Assistance Technique */}
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs text-white/50">Assistance Technique</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 w-full p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium border border-white/5">
                <Headphones className="w-4 h-4 text-app-accent" />
                Contacter le support
              </button>
              <button className="flex items-center gap-3 w-full p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium border border-white/5">
                <LifeBuoy className="w-4 h-4 text-app-accent" />
                Ouvrir un ticket
              </button>
            </div>
          </div>

        </div>

        {/* Ligne de fond : Copyright & Légal Vendeur */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-white/50">
            © {currentYear} Brixel
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-white/50">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Paiements sécurisés</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <Link href="/vendeur/cgu" className="hover:text-white transition-colors">Conditions Générales d'Utilisation Partenaires</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}