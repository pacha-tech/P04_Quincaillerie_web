"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/src/types/auth";
import { getAuth, onIdTokenChanged, signOut } from "firebase/auth";
import { authentification } from "../config/firebase";

interface AuthState {
  role: UserRole | null;
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const auth = authentification;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const newToken = await user.getIdToken();
        localStorage.setItem('firebase_token', newToken);
        console.log("Token Firebase rafraîchi silencieusement !");
      } else {
        localStorage.removeItem('firebase_token');
      }
    });

    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole("VISITEUR");
    }
    setIsLoading(false);
  }, []);

  
  const login = (newRole: UserRole) => {
    localStorage.setItem("user_role", newRole);
    setRole(newRole);
  };

  
  const logout = async () => {
    console.log("Déconnexion en cours...");
    
    try {
      const auth = authentification;
      await signOut(auth);
      
      localStorage.removeItem("user_role");
      setRole("VISITEUR");
      
    } catch (error) {
      console.error("Erreur lors de la déconnexion Firebase :", error);
    }
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};