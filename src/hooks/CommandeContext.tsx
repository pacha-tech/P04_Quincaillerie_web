"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Commande } from "../types/Commande";
import { commandeService } from "../services/CommandeService";
import { useAuth } from "./AuthContext";
import { StatutCommande } from "../utils/StatutCommande";

interface CommandeContextType {
    commandes: Commande[];
    count: number;
    isFetching: boolean;
    refresh: () => Promise<void>;
    error: string | null;
}

const CommandeContext = createContext<CommandeContextType | null>(null);

export const CommandeProvider = ({ children }: { children: React.ReactNode }) => {
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [count, setCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { role, isLoading: authLoading } = useAuth();

    const refresh = useCallback(async () => {
        
        if (authLoading || !role) return;

        setIsFetching(true);
        setError(null);
        try {
            let response: Commande[] = [];

            if (role === "CLIENT") {
                response = await commandeService.getAllCommandeByUser();
                
                const pending = response.filter(c => c.statut === StatutCommande.EN_ATTENTE_PAIEMENT).length;
                setCount(pending);
            } 
            else if (role === "VENDEUR") {
                response = await commandeService.getAllCommandeByQuincaillerie();
                
                const pending = response.filter(c => c.statut === StatutCommande.EN_ATTENTE_VALIDATION).length;
                setCount(pending);
            }

            setCommandes(response);
        } catch (error:any) {
            console.error("Erreur lors du rafraîchissement des commandes", error);
            setError(error.message);
        } finally {
            setIsFetching(false);
        }
    }, [role, authLoading]);

    
    useEffect(() => {
        refresh();
        
        // Polling toutes les 5 minutes pour garder les compteurs à jour
        const interval = setInterval(refresh, 300000);
        return () => clearInterval(interval);
    }, [refresh]);

    return (
        <CommandeContext.Provider value={{ commandes, count,isFetching,refresh , error}}>
            {children}
        </CommandeContext.Provider>
    );
};

export const useCommande = () => {
    const context = useContext(CommandeContext);
    if (!context) {
        throw new Error("useCommande doit être utilisé à l'intérieur d'un CommandeProvider");
    }
    return context;
};