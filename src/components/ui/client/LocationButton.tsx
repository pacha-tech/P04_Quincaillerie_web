"use client";
/*
import { MapPin, Navigation } from 'lucide-react';
import { useLocation } from '@/src/hooks/LocationContext';

export default function LocationButton() {
  const { latitude, error, loading, requestLocation } = useLocation();

  // Si on a déjà la position, on affiche un petit message de succès
  if (latitude) {
    return (
      <div className="flex items-center gap-0 md:gap-1.5 text-xs text-green-600 bg-green-50 px-2 md:px-3 py-1.5 rounded-full border border-green-200">
        <MapPin className="h-3 w-5 md:h-3" />
        <span className=" md:hidden text-xs font-medium">Activé</span>
        <span className="hidden md:block text-xs font-medium">Position activée</span>
      </div>
    );
  }

  // Sinon, on affiche le bouton pour demander la position
  return (
    <button 
      onClick={requestLocation}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold text-app-card bg-app-accent hover:bg-app-primary transition-colors px-3 py-1.5 rounded-full shadow-sm cursor-pointer disabled:opacity-70"
    >
      <Navigation className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
      <span>{loading ? "Recherche..." : "Me localiser"}</span>
    </button>
  );
}
  */