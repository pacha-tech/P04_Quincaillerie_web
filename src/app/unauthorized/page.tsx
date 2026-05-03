"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/AuthContext";

export default function UnauthorizedPage() {
  const router = useRouter();
  const {role} = useAuth();

  return (
    <div className="min-h-screen bg-app-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
        
        {/* Icône animée */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={48} className="text-red-500 animate-pulse" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Accès Restreint
        </h1>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          Désolé, vous n'avez pas les autorisations nécessaires pour accéder à cette page. 
          Si vous pensez qu'il s'agit d'une erreur, veuillez vous reconnecter ou contacter le support.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => router.replace(`/${role!.toLowerCase()}`)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Retourner en arrière
          </button>

          <Link 
            href="/login" 
            className="w-full flex items-center justify-center bg-app-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Se reconnecter
          </Link>
        </div>

      </div>
    </div>
  );
}