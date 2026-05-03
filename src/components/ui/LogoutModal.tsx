"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const [mounted, setMounted] = useState(false);

  // Empêche l'affichage tant que le composant n'est pas monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  const modalContent = (
    // z-[9999] garantit qu'elle passe au-dessus de la Sidebar et de son filtre flou
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      
      {/* Fond semi-transparent prenant toute la largeur de l'écran */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Contenu de la modale */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all relative z-10 border border-gray-100">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-full">
            <span className="text-xl">👋</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Déconnexion</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-6">
          Êtes-vous sûr de vouloir vous déconnecter de BRIXEL ?
        </p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer"
          >
            Annuler
          </button>
          
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium text-sm shadow-sm cursor-pointer"
          >
            Me déconnecter
          </button>
        </div>

      </div>
    </div>
  );

  // On crée un portail pour s'assurer que la modale est attachée au body global, hors de la Sidebar
  return mounted ? createPortal(modalContent, document.body) : null;
}