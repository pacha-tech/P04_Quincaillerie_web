
"use client";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition-opacity">
      
      <div className="bg-app-card rounded-2xl shadow-xl w-5/6 md:w-full max-w-sm p-6 transform scale-100 transition-all">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full">
            <span className="text-xl">👋</span>
          </div>
          <h3 className="text-lg font-bold text-app-primary">Déconnexion</h3>
        </div>
        
        <p className="text-app-secondary text-sm mb-6">
          Êtes-vous sûr de vouloir vous déconnecter de BRIXEL ?
        </p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-lg text-app-secondary bg-app-surface transition-colors font-medium text-sm mr-10 cursor-pointer"
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
}