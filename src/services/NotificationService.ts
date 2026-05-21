import { fetchEventSource } from '@microsoft/fetch-event-source';
import { NotificationStockAlert } from "../types/NotificationStockAlert";
import { authentification } from '../config/firebase';

const NotificationService = {
  subscribeToStockAlerts: async (
    onMessageCallback: (data: NotificationStockAlert[]) => void,
    onErrorCallback: (error: any) => void,
    signal: AbortSignal
  ) => {
    const url = "http://localhost:9010/quincaillerie/notifications/subscribe";

    // 1. On récupère le token Firebase
    let token = localStorage.getItem('firebase_token');
    if (authentification.currentUser) {
      try {
        token = await authentification.currentUser.getIdToken(false);
      } catch (err) {
        console.error("Erreur de récupération du token", err);
      }
    }

    if (!token) {
      console.error("Impossible de se connecter au SSE : Aucun token trouvé.");
      return;
    }

    
    await fetchEventSource(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
      signal: signal,
      onmessage(event) {
        
        if (event.event === 'stock-alerte-multiple') {
          try {
            const data: NotificationStockAlert[] = JSON.parse(event.data);
            onMessageCallback(data);
          } catch (err) {
            console.error("Erreur JSON:", err);
          }
        }
      },
      onerror(err) {
        console.error("Erreur de la connexion SSE :", err);
        onErrorCallback(err);
        throw err;
      }
    });
  }
};

export default NotificationService;