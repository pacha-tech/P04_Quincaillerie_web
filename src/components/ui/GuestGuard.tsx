"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/AuthContext';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, isLoading } = useAuth();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (isLoading) return; // On attend que le contexte charge

    // Si on a un vrai rôle (CLIENT ou VENDEUR)
    if (role && role !== "VISITEUR") {
      console.log(`Déjà connecté en tant que ${role}. Redirection vers le dashboard...`);
      // On le renvoie dans son espace dédié
      router.replace(`/${role.toLowerCase()}`);
    } else {
      // C'est un vrai visiteur, on le laisse passer
      setIsGuest(true);
    }
  }, [role, isLoading, router]);

  // Bloque l'affichage le temps de vérifier
  if (!isGuest) return null; 

  return <>{children}</>;
}