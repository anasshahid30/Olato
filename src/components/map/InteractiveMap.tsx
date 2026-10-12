'use client';

import { groupDiscounts } from '@/lib/group-discounts';

import React, { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Discount } from '@/lib/types';
import { formatDistance } from '@/lib/distance';

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
  const [LModule, setLModule] = useState<typeof import('leaflet') | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((leaflet) => {
      if (!cancelled) setLModule(leaflet);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!LModule || !mapRef.current) return;

    // Initialize Map instance
    const map = LModule.map(mapRef.current, {
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // Add clean minimal OpenStreetMap tile layer
    LModule.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    LModule.control.zoom({ position: 'bottomright' }).addTo(map);
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      mapInstanceRef.current = null;
      map.remove();
    };
  }, [LModule]);

  // Move the existing map instead of destroying it when the location changes.
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !LModule) return;
    const center: [number, number] = [centerLat ?? 31.5204, centerLng ?? 74.3587];
    map.setView(center, 13);
    const location = LModule.circleMarker(center, { radius: 8, color: '#FFFFFF', weight: 3, fillColor: '#5B5CE2', fillOpacity: 1 }).addTo(map);
    location.bindTooltip('Your selected location');
    return () => { location.remove(); };
  }, [LModule, centerLat, centerLng]);

  // Update Markers
  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    if (!mapInstance || !LModule) return;

    // Clear existing markers layer
    const markersGroup = LModule.layerGroup().addTo(mapInstance);

    groupDiscounts(discounts).forEach((disc) => {
      if (
        typeof disc.latitude !== 'number' ||
        typeof disc.longitude !== 'number' ||
        isNaN(disc.latitude) ||
        isNaN(disc.longitude)
      ) {
        return;
      }

      const isSelected = disc.offers?.some((offer) => offer.id === selectedDiscountId);

      const markerHtml = `
        <div class="relative group cursor-pointer">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-md transition-transform duration-300 hover:scale-110 ${
            isSelected
              ? 'bg-[#5B5CE2] text-white border-white ring-4 ring-[#5B5CE2]/30 scale-110 z-30'
              : 'bg-white text-[#15151A] border-[#E7E7EC]'
          }">
            <span class="font-extrabold text-xs text-[#19B87A]">${disc.offers && disc.offers.length > 1 ? `${disc.offers.length} offers` : disc.discountDetails}</span>
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
          ${(disc.offers || []).length > 1 ? `<div style="max-height:180px;overflow-y:auto">${disc.offers!.map((offer) => `<a href="/discounts/${encodeURIComponent(offer.id)}" style="display:block;padding:8px 0;border-top:1px solid #E7E7EC;font-size:12px"><strong>${escapeHtml(offer.discountDetails)}</strong> · ${escapeHtml(offer.bankCard || (offer.studentEligible ? 'Student offer' : 'General offer'))}</a>`).join('')}</div>` : ''}
          <a href="/discounts/${disc.id}" style="display: block; text-align: center; background: #5B5CE2; color: white; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-decoration: none;">View Discount</a>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    return () => {
      markersGroup.clearLayers();
      if (mapInstanceRef.current === mapInstance) {
        mapInstance.removeLayer(markersGroup);
      }
    };
  }, [LModule, discounts, selectedDiscountId, onSelectDiscount]);

  return (
    <div className={`relative isolate z-0 rounded-2xl border border-[#E7E7EC] overflow-hidden ${className}`}>
      <div ref={mapRef} className="h-full w-full" />
      {!LModule && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F7F7FA] text-sm font-semibold text-[#6F7078] animate-pulse">
          Loading discovery map...
        </div>
      )}
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
