'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
            city: 'Lahore',
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          resolve(false);
        },
        { timeout: 8000 }
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
