/**
 * Configuration des menus selon les rôles
 * Structure de base - à enrichir selon les besoins
 */

import { UserRole, MenuItem } from '@/src/types/auth';

export const menuConfig: Record<UserRole, MenuItem[]> = {
  client: [
    {
      id: 'accueil',
      label: 'Accueil',
      href: '/authenticated/client',
      icon: 'home',
    },
    {
      id: 'orders',
      label: 'Mes commandes',
      href: '/authenticated/client/commande',
      icon: 'shopping-cart',
    },
    {
      id: 'favorites',
      label: 'Favoris',
      href: '/client/favorites',
      icon: 'heart',
    },
    {
      id: 'profile',
      label: 'Profil',
      href: '/client/profile',
      icon: 'user',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      href: '/client/settings',
      icon: 'settings',
    },
  ],
  vendeur: [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      href: '/vendeur',
      icon: 'grid',
    },
    {
      id: 'products',
      label: 'Mes produits',
      href: '/vendeur/products',
      icon: 'box',
    },
    {
      id: 'sales',
      label: 'Ventes',
      href: '/vendeur/sales',
      icon: 'trending-up',
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      href: '/vendeur/analytics',
      icon: 'bar-chart-2',
    },
    {
      id: 'store',
      label: 'Ma boutique',
      href: '/vendeur/store',
      icon: 'store',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      href: '/vendeur/settings',
      icon: 'settings',
    },
  ],
  visiteur: [
    {
      id: 'home',
      label: 'Accueil',
      href: '/',
      icon: 'home',
    },
    {
      id: 'catalog',
      label: 'Catalogue',
      href: '/search',
      icon: 'grid',
    },
    {
      id: 'about',
      label: 'À propos',
      href: '/about',
      icon: 'info',
    },
    {
      id: 'contact',
      label: 'Contact',
      href: '/contact',
      icon: 'mail',
    },
  ],
};

/**
 * Obtenir le menu pour un rôle donné
 */
export const getMenuByRole = (role: UserRole): MenuItem[] => {
  return menuConfig[role] || [];
};
