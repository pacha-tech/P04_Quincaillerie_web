"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface LocationState {
  sortBy: string;
  setSortBy: (sort: string) => void;
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  requestLocation: (force?: boolean) => void; // Permet maintenant de forcer la mise à jour si nécessaire
}

const LocationContext = createContext<LocationState | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    error: null as string | null,
    loading: false,
  });

  const [sortBy, setSortBy] = useState<string>('price-asc');

  // 1. RECHARGE DE SESSION DIRECTE AU MONTAGE
  useEffect(() => {
    const cachedLat = sessionStorage.getItem('marketplace_latitude');
    const cachedLng = sessionStorage.getItem('marketplace_longitude');

    if (cachedLat && cachedLng) {
      setLocation({
        latitude: parseFloat(cachedLat),
        longitude: parseFloat(cachedLng),
        error: null,
        loading: false,
      });
    }
  }, []);


  // 2. DEMANDE DE POSITION AMÉLIORÉE
  const requestLocation = useCallback((force = false) => {
    // Si on ne force pas le rafraîchissement, on regarde d'abord si la session existe déjà
    if (!force) {
      const cachedLat = sessionStorage.getItem('marketplace_latitude');
      const cachedLng = sessionStorage.getItem('marketplace_longitude');
      
      if (cachedLat && cachedLng) {
        setLocation({
          latitude: parseFloat(cachedLat),
          longitude: parseFloat(cachedLng),
          error: null,
          loading: false,
        });
        return;
      }
    }

    
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!("geolocation" in navigator)) {
      setLocation({ latitude: null, longitude: null, error: "Non supporté", loading: false });
      return;
    }


    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        
        sessionStorage.setItem('marketplace_latitude', lat.toString());
        sessionStorage.setItem('marketplace_longitude', lng.toString());

        
        setLocation({ latitude: lat, longitude: lng, error: null, loading: false });
      },
      (error) => {
        setLocation({ latitude: null, longitude: null, error: "Erreur position", loading: false });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: force ? 0 : 10000
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ ...location, requestLocation, sortBy, setSortBy }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation doit être utilisé dans LocationProvider");
  return context;
};