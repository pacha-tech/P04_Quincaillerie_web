import { MessageSquareDashed } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-[70vh] items-center justify-center text-center px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-app-accent/10 rounded-full flex items-center justify-center mb-6">
        <MessageSquareDashed className="w-12 h-12 text-app-accent" strokeWidth={1.5} />
      </div>
      
      <h1 className="text-2xl font-black text-app-primary mb-3">
        Messagerie
      </h1>
      
      <p className="text-app-secondary max-w-md mx-auto leading-relaxed mb-8">
        Votre boîte de réception est vide. C'est ici que vous pourrez discuter avec les vendeurs concernant vos commandes ou devis.
      </p>

      {/* Bouton désactivé pour faire joli en attendant que la feature soit prête */}
      <button 
        disabled
        className="px-6 py-3 bg-app-surface border border-app-secondary/20 text-app-secondary font-medium rounded-xl cursor-not-allowed opacity-70"
      >
        Nouvelle conversation
      </button>
    </div>
  );
}