'use client';

import React, { useEffect, useState } from 'react';
import { Discount } from '@/lib/types';
import { formatDistance } from '@/lib/distance';
import Link from 'next/link';

interface InteractiveMapProps {
  discounts: Discount[];
  selectedDiscountId?: string;
  onSelectDiscount?: (id: string) => void;
  centerLat?: number;
  centerLng?: number;
  className?: string;
}

export function InteractiveMap({
  discounts,
  selectedDiscountId,
  onSelectDiscount,
  centerLat = 31.5204,
  centerLng = 74.3587,
  className = 'h-[500px] w-full',
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className={`flex items-center justify-center bg-[#F7F7FA] border border-[#E7E7EC] rounded-2xl ${className}`}>
        <div className="text-center text-sm font-semibold text-[#6F7078] animate-pulse">
          Loading discovery map...
        </div>
      </div>
    );
  }

  // Dynamic Leaflet loader
  return <LeafletMapContainer {...{ discounts, selectedDiscountId, onSelectDiscount, centerLat, centerLng, className }} />;
}

function LeafletMapContainer({
  discounts,
  selectedDiscountId,
  onSelectDiscount,
  centerLat,
  centerLng,
  className,
}: InteractiveMapProps) {
  const [LModule, setLModule] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setLModule(leaflet.default || leaflet);
    });
  }, []);

  useEffect(() => {
    if (!LModule || !mapRef.current) return;

    // Initialize Map instance
    const map = LModule.map(mapRef.current, {
      zoomControl: false,
    }).setView([centerLat, centerLng], 13);

    // Add clean minimal OpenStreetMap tile layer
    LModule.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    LModule.control.zoom({ position: 'bottomright' }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [LModule, centerLat, centerLng]);

  // Update Markers
  useEffect(() => {
    if (!mapInstance || !LModule) return;

    // Clear existing markers layer
    const markersGroup = LModule.layerGroup().addTo(mapInstance);

    discounts.forEach((disc) => {
      const isSelected = disc.id === selectedDiscountId;

      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-md transition-transform duration-300 hover:scale-110 ${
            isSelected
              ? 'bg-[#5B5CE2] text-white border-white ring-4 ring-[#5B5CE2]/30 scale-110 z-30'
              : 'bg-white text-[#15151A] border-[#E7E7EC]'
          }">
            <span class="font-extrabold text-xs text-[#19B87A]">${disc.discountDetails}</span>
            <span class="font-semibold text-xs max-w-[90px] truncate">${disc.placeName}</span>
          </div>
        </div>
      `;

      const customIcon = LModule.divIcon({
        html: markerHtml,
        className: 'custom-map-pin',
        iconSize: [120, 36],
        iconAnchor: [60, 18],
      });

      const marker = LModule.marker([disc.latitude, disc.longitude], { icon: customIcon }).addTo(markersGroup);

      marker.on('click', () => {
        if (onSelectDiscount) {
          onSelectDiscount(disc.id);
        }
      });

      const popupContent = `
        <div style="padding: 12px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; color: #5B5CE2; text-transform: uppercase;">${disc.category}</div>
          <div style="font-size: 14px; font-weight: 700; color: #15151A; margin-bottom: 2px;">${disc.placeName}</div>
          <div style="font-size: 12px; font-weight: 600; color: #19B87A; margin-bottom: 6px;">${disc.offerTitle}</div>
          <div style="font-size: 11px; color: #6F7078; margin-bottom: 8px;">${disc.distance ? formatDistance(disc.distance) : 'Nearby'}</div>
          <a href="/discounts/${disc.id}" style="display: block; text-align: center; background: #5B5CE2; color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;">View Discount</a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    return () => {
      markersGroup.clearLayers();
    };
  }, [mapInstance, LModule, discounts, selectedDiscountId, onSelectDiscount]);

  return <div ref={mapRef} className={`rounded-2xl border border-[#E7E7EC] overflow-hidden ${className}`} />;
}
