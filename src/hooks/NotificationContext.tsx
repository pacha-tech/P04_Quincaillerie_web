import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import NotificationService from '../services/NotificationService';
import { NotificationStockAlert } from '../types/NotificationStockAlert';

interface NotificationContextType {
  alerts: NotificationStockAlert[];
  clearAlerts: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<NotificationStockAlert[]>([]);

  useEffect(() => {
    // On crée un contrôleur pour pouvoir annuler la requête quand on quitte la page
    const ctrl = new AbortController();

    NotificationService.subscribeToStockAlerts(
      (newAlerts: NotificationStockAlert[]) => {
        setAlerts((prev) => [...newAlerts, ...prev]);
        const noms = newAlerts.map(p => p.name).join(", ");
        toast.error(`Stock bas : ${noms}`, { icon: '⚠️' });
      },
      (error) => {
        console.error("Erreur de connexion SSE dans le Context", error);
      },
      ctrl.signal // On passe le signal ici !
    );

    // Nettoyage propre : On "abort" au lieu de "close()"
    return () => {
      ctrl.abort(); 
    };
  }, []);

  const clearAlerts = () => setAlerts([]);

  return (
    <NotificationContext.Provider value={{ alerts, clearAlerts, unreadCount: alerts.length }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification doit être utilisé dans un NotificationProvider");
  }
  return context;
};