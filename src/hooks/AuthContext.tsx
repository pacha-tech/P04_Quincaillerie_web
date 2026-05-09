"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { UserRole } from "@/src/types/auth";
import { getAuth, onAuthStateChanged, onIdTokenChanged, signOut , User as FirebaseUser } from "firebase/auth";
import { authentification } from "../config/firebase";
import { UserInfos } from "../types/UserInfos";
import { QuincaillerieDetail } from "../types/QuincaillerieDetail";
import { userService } from "../services/UserService";
import { quincaillerieService } from "../services/QuincaillerieService";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userInfos: UserInfos | null;
  quincaillerieDetail: QuincaillerieDetail | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser , setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userInfos , setUserInfos] = useState<UserInfos | null>(null);
  const [quincaillerieDetail , setQuincaillerieDetail] = useState<QuincaillerieDetail | null>(null);

  
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
    const auth = authentification;

    const unsubscribe = onAuthStateChanged(auth , async (user) => {
      if(user) {
        setFirebaseUser(user);

        try {
          const token = await user.getIdToken();
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role as UserRole;
          setRole(userRole);

          if(userRole == "CLIENT") {
            const response:UserInfos = await userService.getUserInfo();
            setUserInfos(response);
          }

          if(userRole == "VENDEUR") {
            const response:QuincaillerieDetail = await quincaillerieService.getProfileQuincaillerie();
            setQuincaillerieDetail(response);
          }

          // appel du service
        } catch(error) {
          console.log("erreur lors de la recuperation des infos au demarrage");
        }
      } else {
        setFirebaseUser(null);
        setUserInfos(null);
        setQuincaillerieDetail(null);
        setRole(null);
      }
      setIsLoading(false);
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
    <AuthContext.Provider value={{ role, isLoading, login, logout , quincaillerieDetail , userInfos , firebaseUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};