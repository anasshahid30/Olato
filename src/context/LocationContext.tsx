'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CityHub, LocationCoordinates } from '@/lib/types';
import { LAHORE_HUBS } from '@/lib/seed-data';

interface LocationContextType {
  activeHub: CityHub;
  userCoords: LocationCoordinates;
  isUsingGPS: boolean;
  setHub: (hub: CityHub) => void;
  requestGPSLocation: () => Promise<boolean>;
  allHubs: CityHub[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [activeHub, setActiveHub] = useState<CityHub>(LAHORE_HUBS[0]);
  const [userCoords, setUserCoords] = useState<LocationCoordinates>({
    latitude: LAHORE_HUBS[0].latitude,
    longitude: LAHORE_HUBS[0].longitude,
  });
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  const locationRequest = useRef(0);

  useEffect(() => {
    try {
      const savedHubId = localStorage.getItem('olato_active_hub_id');
      if (savedHubId) {
        const found = LAHORE_HUBS.find((h) => h.id === savedHubId);
        if (found) {
          setActiveHub(found);
          setUserCoords({ latitude: found.latitude, longitude: found.longitude });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setHub = (hub: CityHub) => {
    locationRequest.current += 1;
    setActiveHub(hub);
    setUserCoords({ latitude: hub.latitude, longitude: hub.longitude });
    setIsUsingGPS(false);
    try {
      localStorage.setItem('olato_active_hub_id', hub.id);
    } catch {
      // ignore
    }
  };

  const requestGPSLocation = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return false;
    }

    const requestId = ++locationRequest.current;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (requestId !== locationRequest.current) { resolve(false); return; }
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserCoords(coords);
          setIsUsingGPS(true);
          setActiveHub({
            id: 'gps-custom',
            name: 'Current Location',
            area: 'Near You',
            city: '',
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          resolve(true);
          // GPS works immediately; the area label updates when the lookup finishes.
          void fetch(`/api/location?lat=${coords.latitude}&lon=${coords.longitude}`, { signal: AbortSignal.timeout(6000) })
            .then(async (response) => {
              if (!response.ok) return;
              const location = await response.json() as { name?: string; area?: string; city?: string };
              if (requestId !== locationRequest.current || !location.name) return;
              setActiveHub({
                id: 'gps-custom',
                name: location.name,
                area: location.area || location.name,
                city: location.city || '',
                latitude: coords.latitude,
                longitude: coords.longitude,
              });
            })
            .catch(() => { /* Keep the GPS fallback when the lookup is unavailable. */ });
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          resolve(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        activeHub,
        userCoords,
        isUsingGPS,
        setHub,
        requestGPSLocation,
        allHubs: LAHORE_HUBS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
