/**
 * Types d'authentification et d'autorisation
 */

export type UserRole = 'client' | 'vendeur' | 'visiteur';

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string; // Nom de l'icône (ex: 'home', 'settings', etc.)
  active?: boolean;
}

export interface AuthContext {
  role: UserRole;
  userId?: string;
  email?: string;
}
