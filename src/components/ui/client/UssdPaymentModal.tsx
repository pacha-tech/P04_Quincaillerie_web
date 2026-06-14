
"use client";

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Smartphone, AlertCircle } from 'lucide-react';
import { paiementService } from '@/src/services/PaiementService';
import { useAuth } from '@/src/hooks/AuthContext';

interface UssdPaymentModalProps {
  transactionId: string;
  onClose: () => void;
}

export default function UssdPaymentModal({ transactionId, onClose }: UssdPaymentModalProps) {
  // États : PENDING (en attente du code PIN), SUCCESS (paiement validé), FAILED (échec ou annulation)
  const [status, setStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED'>('PENDING');
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const {firebaseUser} = useAuth();

  // 1. Gestion du compte à rebours
  useEffect(() => {
    if (status !== 'PENDING') return;
    if (timeLeft <= 0) {
      setStatus('FAILED');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
 
    return () => clearInterval(timerId);
  }, [timeLeft, status]);

  // 2. Connexion au flux SSE dès l'ouverture du modal
  useEffect(() => {
    const abortController = new AbortController();

    const connectToSSE = async () => {
      try {
        // 💡 Si ton API nécessite un token (Firebase), récupère-le ici
        //const token = await auth.currentUser?.getIdToken();
        let token = undefined; 
       if(firebaseUser){
        token = await firebaseUser.getIdToken();
       }

       if (!token) {
          console.error("Aucun token disponible, la requête SSE sera bloquée par le serveur.");
          setStatus('FAILED');
          return;
        }

        await paiementService.subscribeToPaymentStatus(
          transactionId,
          (newStatus) => {
            // Vérifie les statuts exacts renvoyés par ton backend Spring Boot
            if (newStatus === 'SUCCESSFUL' || newStatus === 'SUCCESS') {
              setStatus('SUCCESS');
              abortController.abort(); // Coupe la connexion réseau, on a fini !
            } else if (newStatus === 'FAILED') {
              setStatus('FAILED');
              abortController.abort(); // Coupe la connexion
            }
          },
          (error) => {
            console.error("Erreur SSE :", error);
            setStatus('FAILED');
          },
          abortController.signal,
          token
        );
      } catch (error) {
        console.error("Impossible de lancer le SSE", error);
      }
    };

    connectToSSE();

    // Nettoyage à la fermeture du composant (si l'utilisateur clique sur la croix)
    return () => {
      abortController.abort();
    };
  }, [transactionId , firebaseUser]);

  // Formatage du timer (mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-in zoom-in duration-200 text-center flex flex-col items-center">
        
        {/* --- ÉTAT 1 : EN ATTENTE DU CODE PIN --- */}
        {status === 'PENDING' && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-white border-4 border-blue-50 h-24 w-24 rounded-full flex items-center justify-center shadow-inner">
                <Smartphone size={40} className="text-blue-500 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">Vérifiez votre téléphone</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              Un menu s'est affiché sur votre téléphone. Veuillez entrer votre code PIN secret pour valider le paiement. ou tapez #150*50# puis entrer votre code secret
            </p>

            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-6 w-full">
              <Loader2 size={16} className="text-app-accent animate-spin" />
              <span className="text-sm font-bold text-gray-700">En attente de validation...</span>
              <span className="text-sm font-black text-app-accent ml-auto">{formatTime(timeLeft)}</span>
            </div>

            <button 
              onClick={onClose}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Annuler la transaction
            </button>
          </>
        )}

        {/* --- ÉTAT 2 : SUCCÈS --- */}
        {status === 'SUCCESS' && (
          <>
            <div className="mb-6">
              <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">Paiement Réussi !</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium">
              Votre commande a été payée avec succès. La quincaillerie est en train de préparer votre commande.
            </p>

            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-green-500 text-white rounded-xl font-black text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 active:scale-95"
            >
              Terminer
            </button>
          </>
        )}

        {/* --- ÉTAT 3 : ÉCHEC OU TIMEOUT --- */}
        {status === 'FAILED' && (
          <>
            <div className="mb-6">
              <div className="bg-red-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                <XCircle size={48} className="text-red-500" />
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 mb-2">Paiement Échoué</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium px-2">
              {timeLeft <= 0 
                ? "Le temps imparti pour valider le paiement est écoulé." 
                : "La transaction a été annulée ou a rencontré un problème (solde insuffisant, annulation utilisateur, etc.)."}
            </p>

            <button 
              onClick={onClose}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-black text-sm hover:bg-black transition-all shadow-lg active:scale-95"
            >
              Fermer et réessayer
            </button>
          </>
        )}

      </div>
    </div>
  );
}