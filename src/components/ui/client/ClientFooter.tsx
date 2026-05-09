import Link from 'next/link';
import {Mail, Phone, MapPin, Store } from 'lucide-react';
import { FaFacebookF, FaXTwitter, FaInstagram } from 'react-icons/fa6';

export default function ClientFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Colonne 1 : Marque & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-app-primary rounded-lg flex items-center justify-center shadow-inner">
                <Store className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl text-app-primary">Brixel</span>
            </div>
            <p className="text-sm text-app-secondary leading-relaxed">
              La première marketplace dédiée aux matériaux de construction. Commandez en ligne et récupérez vos produits dans les meilleures quincailleries.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-app-secondary hover:text-app-primary hover:bg-gray-100 transition-colors"><FaFacebookF className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-app-secondary hover:text-app-primary hover:bg-gray-100 transition-colors"><FaXTwitter className="w-4 h-4" /></a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-app-secondary hover:text-app-primary hover:bg-gray-100 transition-colors"><FaInstagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Colonne 2 : Explorer */}
          <div>
            <h4 className="font-bold text-app-primary mb-4 uppercase tracking-wider text-sm">Explorer</h4>
            <ul className="space-y-3 text-sm text-app-secondary font-medium">
              <li><Link href="/client" className="hover:text-app-primary transition-colors">Toutes les boutiques</Link></li>
              <li><Link href="/client/categories" className="hover:text-app-primary transition-colors">Catégories de matériaux</Link></li>
              <li><Link href="/client/promotions" className="hover:text-app-primary transition-colors">Promotions du moment</Link></li>
              <li><Link href="/client/commande" className="hover:text-app-primary transition-colors">Suivi de commande</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Support & Aide */}
          <div>
            <h4 className="font-bold text-app-primary mb-4 uppercase tracking-wider text-sm">Aide & Support</h4>
            <ul className="space-y-3 text-sm text-app-secondary font-medium">
              <li><Link href="/faq" className="hover:text-app-primary transition-colors">Foire aux questions (FAQ)</Link></li>
              <li><Link href="/support" className="hover:text-app-primary transition-colors">Centre d'aide</Link></li>
              <li><Link href="/retour" className="hover:text-app-primary transition-colors">Politique de retour</Link></li>
              <li><Link href="/contact" className="hover:text-app-primary transition-colors">Nous contacter</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : Coordonnées Rapides */}
          <div>
            <h4 className="font-bold text-app-primary mb-4 uppercase tracking-wider text-sm">Contactez-nous</h4>
            <ul className="space-y-3 text-sm text-app-secondary font-medium">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>+237 600 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>support@brixel.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Yaounde, Cameroun<br/>Damas, Rue de la Total</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Ligne de fond : Copyright & Légal */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-medium text-app-secondary">
            © {currentYear} Brixel. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-app-secondary">
            <Link href="#" className="hover:text-app-primary transition-colors">CGV</Link>
            <Link href="#" className="hover:text-app-primary transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-app-primary transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}