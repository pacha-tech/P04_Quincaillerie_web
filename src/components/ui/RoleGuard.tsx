
"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/AuthContext';
import { useLocation } from '@/src/hooks/LocationContext';

export default function RoleGuard({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const router = useRouter();
  const { role, isLoading } = useAuth();
  const { requestLocation , loading } = useLocation();

  const [authorized, setAuthorized] = useState(false);

  /*

  useEffect(() => {
    // On empêche le Guard de prendre une décision hâtive si le contexte n'a pas fini de charger
    console.log("LE ROLE QUI VEUT SWITCHER EST: ", role);

    if (isLoading) return; 

    console.log("URL Actuelle :", window.location.pathname);
    console.log("Rôle du Cerveau :", role);
    console.log("Rôle exigé par cette page :", allowedRole);

    if (!role || role !== allowedRole) {
      if(role !== "VISITEUR"){
        console.log("DÉCISION : Expulsion vers /unauthorized");
        router.push('/unauthorized');
        return;
      } else {
        console.log("DÉCISION PAS CONNECTE: Expulsion vers /login");
        router.push('/login');
        return;
      }
    } else {
      console.log("DÉCISION : Accès autorisé");
      setAuthorized(true);
    }
  }, [router, role, isLoading, allowedRole]);
  */

  useEffect(() => {
    if (isLoading) return; 

    if (!role || role !== allowedRole) {
      if(role !== "VISITEUR"){
        router.push('/unauthorized');
        return;
      } else {
        router.push('/login');
        return;
      }
    } else {
      setAuthorized(true);
      
      if (allowedRole === 'CLIENT' || allowedRole === 'VISITEUR') {
        requestLocation();
      }
    }
  }, [router, role, isLoading, allowedRole, requestLocation]);

  // Bloque l'affichage du HTML de la page tant qu'on n'est pas autorisé
  if (!authorized) return null; 

  console.log("LE ROLE QUI VEUT SWITCHER EST: ", role);

  return <>{children}</>;
}