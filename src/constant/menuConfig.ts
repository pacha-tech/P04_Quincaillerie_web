
import { UserRole, MenuItem } from '@/src/types/auth';

// J'ai ajouté `isBottom` au type MenuItem (à ajouter dans ton fichier de types si tu veux le typer strictement)
export const menuConfig: Record<string, MenuItem[]> = {
  CLIENT: [
    { id: 'accueil', label: 'Accueil', href: '/client', icon: 'home' },
    { id: 'orders', label: 'Mes commandes', href: '/client/commande', icon: 'logs' },
    { id: 'cart', label: 'Panier', href: '/client/panier', icon: 'shopping-cart' },
    { id: 'favorites', label: 'Favoris', href: '/client/favoris', icon: 'heart' },
    //{ id: 'profile', label: 'Profil', href: '/client/profil', icon: 'user' },
    //{ id: 'settings', label: 'Paramètres', href: '/client/parametre', icon: 'settings' },
    { id: 'history', label: 'Historiques', href: '/client/historiques', icon: 'history' },
    { id: 'message', label: 'Messages', href: '/client/messages', icon: 'messageSquare' },
  ],
  VENDEUR: [
    { id: 'dashboard', label: 'Dashboard', href: '/vendeur', icon: 'layoutDashboard'},
    { id: 'promotion', label: 'Promotions', href: '/vendeur/promotion', icon: 'tag' },
    { id: 'products', label: 'Mon stock', href: '/vendeur/products', icon: 'box' },
    { id: 'sales', label: 'Ventes', href: '/vendeur/ventes', icon: 'trending-up' },
    { id: 'orders', label: 'Commandes', href: '/vendeur/commandes', icon: 'logs' },
    { id: 'analytics', label: 'Statistiques', href: '/vendeur/statistiques', icon: 'bar-chart-2' },
    { id: 'store', label: 'Ma boutique', href: '/vendeur/boutique', icon: 'store' },
    { id: 'settings', label: 'Paramètres', href: '/vendeur/parametre', icon: 'settings' },
  ],
};

export const getMenuByRole = (role: UserRole): MenuItem[] => {
  return menuConfig[role] || [];
};
