'use client';

/**
 * Hook personnalisé pour récupérer le rôle de l'utilisateur
 * Version mockée pour le développement
 * À remplacer plus tard par l'authentification Firebase réelle
 */

import { useState } from 'react';
import { UserRole } from '@/src/types/auth';

export const useAuthRole = () => {
  // Rôle mockée - sera remplacée par Firebase token claims
  const [role, setRole] = useState<UserRole>('visiteur');

  /**
   * Change le rôle (pour le développement uniquement)
   */
  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  return {
    role,
    switchRole,
    isClient: role === 'client',
    isVendeur: role === 'vendeur',
    isVisiteur: role === 'visiteur',
  };
};
