'use client';

import Link from 'next/link';
import { ArrowLeft, Activity } from 'lucide-react';

export default function MouvementsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-lg w-full text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-black text-app-primary mb-2">Historique des Flux</h1>
          <p className="text-sm text-app-secondary">ici c'est la page de tout ce qui se passe</p>
        </div>
        <Link 
          href="/vendeur"
          className="flex items-center gap-2 px-6 py-2.5 bg-app-primary hover:bg-app-primary/95 text-white rounded-xl text-sm font-bold shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
