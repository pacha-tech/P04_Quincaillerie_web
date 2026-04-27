
import { UserRole, MenuItem } from '@/src/types/auth';

// J'ai ajouté `isBottom` au type MenuItem (à ajouter dans ton fichier de types si tu veux le typer strictement)
export const menuConfig: Record<string, MenuItem[]> = {
  CLIENT: [
    { id: 'accueil', label: 'Accueil', href: '/authenticated/client', icon: 'home' },
    { id: 'orders', label: 'Mes commandes', href: '/authenticated/client/commande', icon: 'logs' },
    { id: 'cart', label: 'Panier', href: '/authenticated/client/panier', icon: 'shopping-cart' },
    { id: 'favorites', label: 'Favoris', href: '/authenticated/client/favoris', icon: 'heart' },
    { id: 'profile', label: 'Profil', href: '/authenticated/client/profil', icon: 'user' },
    { id: 'settings', label: 'Paramètres', href: '/authenticated/client/parametre', icon: 'settings' },
    { 
      id: 'logout', 
      label: 'Déconnexion', 
      href: '/visiteur/logout', 
      icon: 'logOut',
    },
  ],
  VENDEUR: [
    { id: 'dashboard', label: 'Tableau de bord', href: '/authenticated/vendeur', icon: 'grid' },
    { id: 'products', label: 'Mes produits', href: '/authenticated/vendeur/products', icon: 'box' },
    { id: 'sales', label: 'Ventes', href: '/authenticated/vendeur/ventes', icon: 'trending-up' }, // 👈 J'ai corrigé les chemins ici
    { id: 'analytics', label: 'Statistiques', href: '/authenticated/vendeur/statistiques', icon: 'bar-chart-2' },
    { id: 'store', label: 'Ma boutique', href: '/authenticated/vendeur/boutique', icon: 'store' },
    { id: 'settings', label: 'Paramètres', href: '/authenticated/vendeur/parametre', icon: 'settings' },
    { 
      id: 'logout', 
      label: 'Déconnexion',
      href: '/visiteur/logout', 
      icon: 'logOut',
    },
  ],
};

export const getMenuByRole = (role: UserRole): MenuItem[] => {
  return menuConfig[role] || [];
};
