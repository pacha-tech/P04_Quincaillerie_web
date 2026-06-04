import { fetchEventSource } from '@microsoft/fetch-event-source';
import { authentification } from '../config/firebase';
import { NotificationStockAlert } from '../types/NotificationStockAlert';


const API_BASE_URL = "http://localhost:9010/quincaillerie/notifications";

// Fonction utilitaire pour récupérer le token Firebase
const getAuthToken = async (): Promise<string | null> => {
  let token = localStorage.getItem('firebase_token');
  if (authentification.currentUser) {
    try {
      token = await authentification.currentUser.getIdToken(false);
    } catch (err) {
      console.error("Erreur de récupération du token", err);
    }
  }
  return token;
};

const NotificationService = {
  
  // A. S'abonner au flux SSE
  subscribeToNotifications: async (
    onMessageCallback: (data: NotificationStockAlert[]) => void,
    onErrorCallback: (error: any) => void,
    signal: AbortSignal
  ) => {
    const token = await getAuthToken();

    if (!token) {
      console.error("Impossible de se connecter au SSE : Aucun token trouvé.");
      return;
    }

    await fetchEventSource(`${API_BASE_URL}/subscribe`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
      signal: signal,
      onmessage(event) {
        if (event.event === 'nouvelles-notifications') {
          try {
            const data: NotificationStockAlert[] = JSON.parse(event.data);
            onMessageCallback(data);
          } catch (err) {
            console.error("Erreur de parsing JSON SSE:", err);
          }
        }
      },
      onerror(err) {
        console.error("Erreur de la connexion SSE :", err);
        onErrorCallback(err);
        throw err; // Important pour déclencher les retentatives du fetchEventSource
      }
    });
  },

  // B. Récupérer l'historique complet (Route: /getAll)
  getHistory: async (): Promise<NotificationStockAlert[]> => {
    const token = await getAuthToken();
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_BASE_URL}/getAll`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement de l'historique");
    }
    return response.json();
  },

  // C. Marquer toutes les notifications comme lues (Route: /read)
  markAllAsRead: async (): Promise<void> => {
    const token = await getAuthToken();
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_BASE_URL}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour des notifications");
    }
  }
};

export default NotificationService;