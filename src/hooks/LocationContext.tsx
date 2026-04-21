"use client";

import React, { createContext, useContext, useState, ReactNode , useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationState | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState({
    latitude: null as number | null,
    longitude: null as number | null,
    error: null as string | null,
    loading: false,
  });

  const requestLocation = () => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!("geolocation" in navigator)) {
      setLocation({ latitude: null, longitude: null, error: "Non supporté", loading: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setLocation({ latitude: null, longitude: null, error: "Erreur position", loading: false });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <LocationContext.Provider value={{ ...location, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation doit être utilisé dans LocationProvider");
  return context;
};