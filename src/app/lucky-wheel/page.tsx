'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LuckyWheel } from '@/components/wheel/LuckyWheel';
import { WheelRestaurantPicker } from '@/components/wheel/WheelRestaurantPicker';
import { Place } from '@/lib/types';
import {
  Sparkles,
  X,
  RotateCcw,
  Trophy,
  MapPin,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Shuffle,
} from 'lucide-react';
import Link from 'next/link';

export default function LuckyWheelPage() {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Place | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  const handleSelectionChange = useCallback((places: Place[]) => {
    setSelectedPlaces(places);
    if (winner) setWinner(null); // clear winner on selection change
  }, [winner]);

  const handleSpinStart = useCallback(() => {
    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);
  }, []);

  const handleSpinEnd = useCallback((place: Place) => {
    setIsSpinning(false);
    setWinner(place);
    setSpinCount(c => c + 1);
    setTimeout(() => setShowWinnerModal(true), 400);
  }, []);

  const handleDismissWinner = useCallback(() => {
    setShowWinnerModal(false);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPlaces([]);
    setWinner(null);
    setShowWinnerModal(false);
    setIsSpinning(false);
  }, []);

  const removePlace = useCallback((id: string) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== id));
  }, []);

  const canSpin = selectedPlaces.length >= 2 && !isSpinning;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      {/* ── Hero Header ──────────────────────────────────────────── */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#5B5CE2]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] bg-[#10B981]/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E7E7EC] text-xs font-black uppercase tracking-widest text-[#5B5CE2] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Olato Lucky Wheel</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#15151A] leading-tight">
            Can&apos;t decide?{' '}
            <span className="animate-shimmer">Let fate choose.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#6F7078] max-w-xl mx-auto leading-relaxed">
            Pick up to 10 restaurants from the full Olato catalogue, spin the wheel,
            and let it decide your next dining adventure.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* ── LEFT: Wheel ────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Wheel Container */}
            <div className="relative bg-white border border-[#E7E7EC] rounded-3xl p-6 shadow-sm space-y-5">
              {/* Spin counter */}
              {spinCount > 0 && (
                <div className="absolute top-4 right-4 text-[11px] font-bold text-[#6F7078] bg-[#F4F3F0] px-2.5 py-1 rounded-full">
                  {spinCount} spin{spinCount > 1 ? 's' : ''}
                </div>
              )}

              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-[#15151A] tracking-tight">🎡 The Wheel</h2>
                <p className="text-xs text-[#6F7078]">
                  {selectedPlaces.length === 0
                    ? 'Add at least 2 restaurants to spin'
                    : selectedPlaces.length === 1
                    ? 'Add 1 more restaurant to spin'
                    : `${selectedPlaces.length} restaurant${selectedPlaces.length > 1 ? 's' : ''} on the wheel`}
                </p>
              </div>

              {/* Wheel canvas */}
              <div className="w-full max-w-[380px] mx-auto">
                <LuckyWheel
                  places={selectedPlaces}
                  isSpinning={isSpinning}
                  onSpinEnd={handleSpinEnd}
                  onSpinStart={handleSpinStart}
                />
              </div>

              {/* Spin button */}
              <div className="flex flex-col gap-3 items-center">
                <button
                  type="button"
                  onClick={canSpin ? handleSpinStart : undefined}
                  disabled={!canSpin}
                  aria-label="Spin the wheel"
                  className={`w-full max-w-xs flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-black tracking-wide transition-all duration-200 ${
                    canSpin
                      ? 'bg-[#5B5CE2] text-white shadow-lg shadow-[#5B5CE2]/30 hover:bg-[#4B4CCB] hover:shadow-xl hover:shadow-[#5B5CE2]/40 hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-[#E7E7EC] text-[#9A9BA4] cursor-not-allowed'
                  }`}
                >
                  <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  {isSpinning ? 'Spinning…' : 'Spin the Wheel!'}
                </button>

                {selectedPlaces.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#6F7078] hover:text-[#EF4444] transition-colors"
                    aria-label="Reset selection"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset everything
                  </button>
                )}
              </div>
            </div>

            {/* ── Selection Review ─────────────────────────────── */}
            {selectedPlaces.length > 0 && (
              <div className="bg-white border border-[#E7E7EC] rounded-3xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowReview(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-[#15151A] hover:bg-[#F7F7FA] transition-colors"
                  aria-expanded={showReview}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5B5CE2]" />
                    <span>Your selection ({selectedPlaces.length} / 10)</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6F7078] transition-transform duration-200 ${showReview ? 'rotate-180' : ''}`}
                  />
                </button>

                {showReview && (
                  <div className="divide-y divide-[#F4F3F0]">
                    {selectedPlaces.map((place, i) => (
                      <div
                        key={place.id}
                        className="flex items-center gap-3 px-5 py-3 group"
                      >
                        <span className="text-xs font-black text-[#D0D0D8] w-5 shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#F4F3F0]">
                          {place.images[0] ? (
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">🍽️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#15151A] truncate">{place.name}</p>
                          {place.area && (
                            <p className="text-[11px] text-[#6F7078]">{place.area}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePlace(place.id)}
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-lg bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                          aria-label={`Remove ${place.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT: Restaurant Picker ────────────────────────── */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-[#15151A] tracking-tight">
                Choose restaurants
              </h2>
              <p className="text-sm text-[#6F7078] mt-1">
                Search the full Olato catalogue. Select up to 10 to enter the wheel.
              </p>
            </div>

            <WheelRestaurantPicker
              selected={selectedPlaces}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Winner Modal ──────────────────────────────────────────── */}
      {showWinnerModal && winner && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Winner announcement"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDismissWinner}
          />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {/* Confetti header */}
            <div className="relative bg-gradient-to-br from-[#5B5CE2] to-[#4B4CCB] p-8 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-grid-pattern-dark" />
              <div className="relative z-10 space-y-2">
                <div className="text-5xl animate-bounce">🎉</div>
                <Trophy className="w-7 h-7 text-[#FFD700] mx-auto" />
                <p className="text-xs font-black text-white/70 uppercase tracking-widest">
                  The wheel has decided!
                </p>
              </div>
            </div>

            {/* Winner info */}
            <div className="p-6 space-y-5">
              {/* Restaurant image */}
              {winner.images[0] && (
                <div className="relative h-40 rounded-2xl overflow-hidden">
                  <img
                    src={winner.images[0]}
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-[#5B5CE2] text-white text-xs font-bold">
                      {winner.category === 'CAFE' ? 'Café' : winner.category === 'RESTAURANT' ? 'Restaurant' : 'Selected Place'}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#15151A] leading-tight">{winner.name}</h3>
                {winner.area && (
                  <div className="flex items-center gap-1.5 text-sm text-[#6F7078]">
                    <MapPin className="w-4 h-4 text-[#5B5CE2]" />
                    {winner.area}{winner.city ? `, ${winner.city}` : ''}
                  </div>
                )}
                {winner.description && (
                  <p className="text-xs text-[#6F7078] leading-relaxed line-clamp-2 pt-1">
                    {winner.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winner.name + ' ' + (winner.area || '') + ' Lahore')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#5B5CE2] text-white font-bold text-sm hover:bg-[#4B4CCB] transition-colors shadow-md shadow-[#5B5CE2]/20"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWinnerModal(false);
                      setIsSpinning(false);
                      setTimeout(handleSpinStart, 100);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-[#E7E7EC] text-sm font-semibold text-[#15151A] hover:bg-[#F7F7FA] transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Spin again
                  </button>
                  <button
                    type="button"
                    onClick={handleDismissWinner}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-[#E7E7EC] text-sm font-semibold text-[#6F7078] hover:bg-[#F7F7FA] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleDismissWinner}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="Close winner modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
