import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { authentification } from '../config/firebase';
import { NotificationStockAlert } from '../types/NotificationStockAlert';
import NotificationService from '../services/NotificationService';

interface NotificationContextType {
  notifications: NotificationStockAlert[];
  markNotificationsAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  // Remplacement total de NotificationStockAlert par SystemNotification
  const [notifications, setNotifications] = useState<NotificationStockAlert[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 1. Surveille Firebase
  useEffect(() => {
    const unsubscribe = authentification.onAuthStateChanged((user) => {
      setIsAuthReady(!!user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Initialisation : Historique + SSE
  useEffect(() => {
    if (!isAuthReady) return;

    const ctrl = new AbortController();

    const initSystem = async () => {
      // A. Chargement de l'historique depuis la base de données
      try {
        const history = await NotificationService.getHistory();
        setNotifications(history);
      } catch (err) { 
        console.error("Erreur lors de la récupération de l'historique des notifications:", err); 
      }

      // B. Branchement au flux Temps Réel
      NotificationService.subscribeToNotifications(
        (newNotifs: NotificationStockAlert[]) => {
          
          setNotifications((prev) => {
            // DÉDOUBLONNAGE basé sur 'id' (le champ DTO)
            const combined = [...newNotifs, ...prev];
            const uniqueMap = new Map(combined.map(item => [item.idNotification, item]));
            return Array.from(uniqueMap.values()).sort((a, b) => {
              // Optionnel: On s'assure qu'elles restent triées de la plus récente à la plus ancienne
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : Date.now();
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : Date.now();
              return dateB - dateA;
            });
          });

          // Toasts intelligents
          newNotifs.forEach(notif => {
            toast(notif.message, { 
              icon: notif.type === 'STOCK_BAS' ? '⚠️' : '🔔',
              duration: 5000 
            });
          });
        },
        (error) => console.error("Erreur de connexion SSE", error),
        ctrl.signal
      );
    };

    initSystem();

    return () => ctrl.abort(); 
  }, [isAuthReady]);


  const markNotificationsAsRead = async () => {
    if (unreadCount === 0) return; 

    // 1. SAUVEGARDE DE L'ÉTAT INITIAL (Backup)
    const previousNotifications = [...notifications];

    // 2. MISE À JOUR OPTIMISTE (L'UI change instantanément pour l'utilisateur)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    // 3. APPEL AU BACKEND
    try {
      await NotificationService.markAllAsRead();
    } catch (err) {
      console.error("Erreur lors de la mise à jour des notifications sur le serveur", err);
      
      // 4. ROLLBACK : Le serveur a échoué, on restaure l'état non-lu
      setNotifications(previousNotifications);
      
      // 5. FEEDBACK VISUEL : On prévient l'utilisateur que l'action a échoué
      toast.error("Erreur réseau : impossible de marquer les notifications comme lues.");
    }
  };

  // 4. Badge rouge
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{ notifications, markNotificationsAsRead, unreadCount }}>
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