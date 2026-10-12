'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { Place } from '@/lib/types';
import { Maximize2, Minimize2, Sparkles, X } from 'lucide-react';

interface LuckyWheelProps {
  places: Place[];
  isSpinning: boolean;
  onSpinEnd: (winner: Place) => void;
  onSpinStart: () => void;
}

/* ── Rich 3D Gradient Segments with high-contrast text and luminous accents ── */
const SEGMENT_PALETTE = [
  { start: '#6366F1', end: '#4338CA', accent: '#A5B4FC', text: '#ffffff' }, // Royal Indigo
  { start: '#10B981', end: '#047857', accent: '#6EE7B7', text: '#ffffff' }, // Vivid Emerald
  { start: '#F59E0B', end: '#B45309', accent: '#FDE68A', text: '#ffffff' }, // Warm Amber
  { start: '#EC4899', end: '#BE185D', accent: '#FBCFE8', text: '#ffffff' }, // Electric Rose
  { start: '#8B5CF6', end: '#6D28D9', accent: '#DDD6FE', text: '#ffffff' }, // Deep Violet
  { start: '#06B6D4', end: '#0E7490', accent: '#A5F3FC', text: '#ffffff' }, // Ocean Cyan
  { start: '#EF4444', end: '#B91C1C', accent: '#FECACA', text: '#ffffff' }, // Crimson Ruby
  { start: '#14B8A6', end: '#0F766E', accent: '#99F6E4', text: '#ffffff' }, // Deep Teal
  { start: '#F97316', end: '#C2410C', accent: '#FED7AA', text: '#ffffff' }, // Sunset Orange
  { start: '#3B82F6', end: '#1D4ED8', accent: '#BFDBFE', text: '#ffffff' }, // Cobalt Blue
];

const VIRTUAL_SIZE = 700;

export function LuckyWheel({ places, isSpinning, onSpinEnd, onSpinStart }: LuckyWheelProps) {
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);

  const animFrameRef = useRef<number>(0);
  const currentAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number>(0);
  const winnerIndexRef = useRef<number>(0);
  const hasEndedRef = useRef<boolean>(false);
  const glowPhaseRef = useRef<number>(0);
  const pointerDeflectionRef = useRef<number>(0);
  const lastPegCrossedRef = useRef<number>(-1);

  const [mounted, setMounted] = useState(false);
  const [manualFullscreen, setManualFullscreen] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When spinning starts, AUTOMATICALLY lift to fullscreen by itself — don't let user ask!
  const isFullscreen = isSpinning || manualFullscreen;

  /* ── Core 3D Wheel Drawing Function ── */
  const draw3DWheel = useCallback(
    (
      canvas: HTMLCanvasElement,
      angle: number,
      glowPhase: number = 0,
      pointerDeflection: number = 0,
      spinning: boolean = false
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || places.length === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const size = VIRTUAL_SIZE;
      const cx = size / 2;
      const cy = size / 2;
      const outerRadius = cx - 18;
      const rimWidth = 26;
      const radius = outerRadius - rimWidth;
      const segCount = places.length;
      const segAngle = (2 * Math.PI) / segCount;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      /* ── 1. Volumetric Under-Wheel Depth Shadow ── */
      ctx.save();
      ctx.shadowColor = 'rgba(15, 15, 30, 0.45)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;
      ctx.beginPath();
      ctx.arc(cx, cy + 4, outerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f1020';
      ctx.fill();
      ctx.restore();

      /* ── 2. Primary 3D Metallic Outer Bezel (Brushed Chrome & Gold Luster) ── */
      ctx.save();
      const bevelGrad = ctx.createLinearGradient(
        cx - outerRadius,
        cy - outerRadius,
        cx + outerRadius,
        cy + outerRadius
      );
      bevelGrad.addColorStop(0, '#f8fafc'); // highlight
      bevelGrad.addColorStop(0.2, '#cbd5e1'); // platinum
      bevelGrad.addColorStop(0.45, '#94a3b8'); // steel
      bevelGrad.addColorStop(0.7, '#f1f5f9'); // reflection
      bevelGrad.addColorStop(0.9, '#64748b'); // dark bevel
      bevelGrad.addColorStop(1, '#475569'); // shadow

      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = bevelGrad;
      ctx.fill();

      // Outer rim highlight rim
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stepped inner chrome channel
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius - 4, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner gold-titanium accent ring
      const innerBevelGrad = ctx.createLinearGradient(
        cx - outerRadius,
        cy + outerRadius,
        cx + outerRadius,
        cy - outerRadius
      );
      innerBevelGrad.addColorStop(0, '#1e293b');
      innerBevelGrad.addColorStop(0.5, '#334155');
      innerBevelGrad.addColorStop(1, '#0f172a');

      ctx.beginPath();
      ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
      ctx.lineWidth = rimWidth - 6;
      ctx.strokeStyle = innerBevelGrad;
      ctx.stroke();
      ctx.restore();

      /* ── 3. 3D Rivets / Animated Chasing LED Studs ── */
      ctx.save();
      const rivetCount = Math.max(16, segCount * 3);
      for (let i = 0; i < rivetCount; i++) {
        const rivetAngle = (i / rivetCount) * 2 * Math.PI;
        const rivetR = outerRadius - rimWidth / 2;
        const rx = cx + rivetR * Math.cos(rivetAngle);
        const ry = cy + rivetR * Math.sin(rivetAngle);

        const chaseOffset = (glowPhase * 8 + i) % rivetCount;
        const isChasingGlow = spinning && chaseOffset < 3.5;

        // Rivet base metal socket
        ctx.beginPath();
        ctx.arc(rx, ry, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Rivet bulb
        ctx.beginPath();
        ctx.arc(rx, ry, 3.5, 0, 2 * Math.PI);

        if (isChasingGlow) {
          ctx.save();
          ctx.shadowColor = '#6366F1';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.restore();
        } else {
          const bulbGrad = ctx.createRadialGradient(rx - 1, ry - 1, 0.5, rx, ry, 3.5);
          bulbGrad.addColorStop(0, '#ffffff');
          bulbGrad.addColorStop(0.4, '#e2e8f0');
          bulbGrad.addColorStop(1, '#64748b');
          ctx.fillStyle = bulbGrad;
          ctx.fill();
        }
      }
      ctx.restore();

      /* ── 4. Deep Recessed Slices with 3D Radial Gradients ── */
      for (let i = 0; i < segCount; i++) {
        const startAngle = angle + i * segAngle;
        const endAngle = startAngle + segAngle;
        const color = SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();

        // Radial slice lighting — deeper shadow near center, brilliant vibrant hue towards rim
        const sliceGrad = ctx.createRadialGradient(
          cx,
          cy,
          radius * 0.18,
          cx,
          cy,
          radius
        );
        sliceGrad.addColorStop(0, color.start);
        sliceGrad.addColorStop(0.65, color.end);
        sliceGrad.addColorStop(1, color.start);
        ctx.fillStyle = sliceGrad;
        ctx.fill();

        // Slice beveled edge highlight (tactile partition groove)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(startAngle), cy + radius * Math.sin(startAngle));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(endAngle), cy + radius * Math.sin(endAngle));
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        /* ── Segment Label & Typography ── */
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segAngle / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Dynamic font sizing based on slice count
        const fontSize = Math.max(12, Math.min(18, 260 / segCount));
        ctx.font = `800 ${fontSize}px "Inter", system-ui, -apple-system, sans-serif`;

        // Text drop shadow for maximum crisp legibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillStyle = color.text;

        const maxChars = segCount <= 4 ? 20 : segCount <= 6 ? 16 : 12;
        const rawName = places[i].name;
        const label = rawName.length > maxChars ? rawName.slice(0, maxChars - 1) + '…' : rawName;

        ctx.fillText(label, radius - 24, 0);

        // Subtitle area badge if wide enough
        if (segCount <= 6 && places[i].area) {
          ctx.font = `600 ${Math.max(9, fontSize * 0.65)}px "Inter", system-ui, sans-serif`;
          ctx.fillStyle = color.accent;
          const subText = places[i].area!.slice(0, 14);
          ctx.fillText(subText, radius - 24, fontSize * 0.95);
        }

        ctx.restore();
      }

      /* ── 5. Recessed Rim Inner Shadow (Depth Occlusion) ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(10, 15, 30, 0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();

      /* ── 6. Convex Glass Dome Reflection (Top Sheen) ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 1, 0, 2 * Math.PI);
      ctx.clip();

      const glassGrad = ctx.createLinearGradient(
        cx - radius * 0.8,
        cy - radius * 0.8,
        cx + radius * 0.4,
        cy + radius * 0.4
      );
      glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      glassGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.08)');
      glassGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
      glassGrad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');

      ctx.fillStyle = glassGrad;
      ctx.fillRect(0, 0, size, size);
      ctx.restore();

      /* ── 7. Center 3D Floating Push-Button Hub ── */
      const hubR = Math.max(34, radius * 0.22);

      // Hub Outer Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(10, 15, 35, 0.6)';
      ctx.shadowBlur = 22;
      ctx.shadowOffsetY = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, hubR + 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.restore();

      // Hub Chrome Ring Bevel
      ctx.save();
      const hubRingGrad = ctx.createLinearGradient(
        cx - hubR,
        cy - hubR,
        cx + hubR,
        cy + hubR
      );
      hubRingGrad.addColorStop(0, '#f8fafc');
      hubRingGrad.addColorStop(0.3, '#cbd5e1');
      hubRingGrad.addColorStop(0.7, '#64748b');
      hubRingGrad.addColorStop(1, '#334155');

      ctx.beginPath();
      ctx.arc(cx, cy, hubR + 4, 0, 2 * Math.PI);
      ctx.fillStyle = hubRingGrad;
      ctx.fill();

      // Hub Inner Button Dome (Luminous Indigo Push Button)
      ctx.beginPath();
      ctx.arc(cx, cy, hubR, 0, 2 * Math.PI);
      const hubDomeGrad = ctx.createRadialGradient(
        cx - hubR * 0.3,
        cy - hubR * 0.3,
        2,
        cx,
        cy,
        hubR
      );
      hubDomeGrad.addColorStop(0, '#818CF8');
      hubDomeGrad.addColorStop(0.4, '#6366F1');
      hubDomeGrad.addColorStop(0.85, '#4338CA');
      hubDomeGrad.addColorStop(1, '#312E81');
      ctx.fillStyle = hubDomeGrad;
      ctx.fill();

      // Button specular glint
      ctx.beginPath();
      ctx.ellipse(cx, cy - hubR * 0.42, hubR * 0.55, hubR * 0.25, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();

      // Button Text / Logo
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${Math.round(hubR * 0.48)}px "Inter", system-ui, sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(spinning ? '✦' : 'SPIN', cx, cy + 1);

      // Spinning Aura Pulse around Hub
      if (spinning) {
        ctx.beginPath();
        ctx.arc(cx, cy, hubR + 9, 0, 2 * Math.PI);
        const auraAlpha = 0.3 + 0.3 * Math.sin(glowPhase * 4);
        ctx.strokeStyle = `rgba(165, 180, 252, ${auraAlpha})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();

      /* ── 8. 3D Mechanical Pointer with Dynamic Physics Ticker ── */
      ctx.save();
      const ptrW = 28;
      const ptrH = 46;
      const ptrX = cx;
      const ptrY = 8;

      ctx.translate(ptrX, ptrY);
      ctx.rotate(pointerDeflection); // Physical flapper deflection!

      // Pointer cast shadow onto wheel
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.55)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 8;

      ctx.beginPath();
      ctx.moveTo(0, ptrH);
      ctx.lineTo(-ptrW / 2, 8);
      ctx.quadraticCurveTo(0, -6, ptrW / 2, 8);
      ctx.closePath();
      ctx.fillStyle = '#1e1b4b';
      ctx.fill();
      ctx.restore();

      // Pointer 3D Metallic Needle Body
      const ptrBodyGrad = ctx.createLinearGradient(-ptrW / 2, 0, ptrW / 2, ptrH);
      ptrBodyGrad.addColorStop(0, '#FCD34D'); // Warm gold tip
      ptrBodyGrad.addColorStop(0.3, '#F59E0B');
      ptrBodyGrad.addColorStop(0.7, '#D97706');
      ptrBodyGrad.addColorStop(1, '#B45309');

      ctx.beginPath();
      ctx.moveTo(0, ptrH);
      ctx.lineTo(-ptrW / 2, 8);
      ctx.quadraticCurveTo(0, -6, ptrW / 2, 8);
      ctx.closePath();
      ctx.fillStyle = ptrBodyGrad;
      ctx.fill();

      // Pointer center ridge (3D prism reflection)
      ctx.beginPath();
      ctx.moveTo(0, ptrH);
      ctx.lineTo(0, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top Pivot Pin / Chrome Rivet
      ctx.beginPath();
      ctx.arc(0, 8, 7, 0, 2 * Math.PI);
      const pivotGrad = ctx.createRadialGradient(-2, 6, 1, 0, 8, 7);
      pivotGrad.addColorStop(0, '#ffffff');
      pivotGrad.addColorStop(0.5, '#cbd5e1');
      pivotGrad.addColorStop(1, '#475569');
      ctx.fillStyle = pivotGrad;
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Jewel Indicator on Needle Tip
      ctx.beginPath();
      ctx.arc(0, ptrH - 6, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#EF4444';
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Undo DPR scale
    },
    [places]
  );

  /* ── Initialize Idle Card Canvas ── */
  useEffect(() => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = VIRTUAL_SIZE * dpr;
    canvas.height = VIRTUAL_SIZE * dpr;
    draw3DWheel(canvas, currentAngleRef.current, 0, 0, false);
  }, [places, draw3DWheel]);

  /* ── Spin Animation Loop on Fullscreen Portal Canvas ── */
  useEffect(() => {
    if (!isSpinning || places.length === 0) return;

    hasEndedRef.current = false;
    setWinnerName(null);

    const winnerIdx = Math.floor(Math.random() * places.length);
    winnerIndexRef.current = winnerIdx;

    const segCount = places.length;
    const segAngle = (2 * Math.PI) / segCount;
    const currentNorm = ((currentAngleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Target the center of the winning slice at top (-PI/2)
    const winnerCenter = -winnerIdx * segAngle - segAngle / 2;
    const fullSpins = (6 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
    const targetOffset = ((-Math.PI / 2) - winnerCenter - currentNorm + 2 * Math.PI * 10) % (2 * Math.PI);
    targetAngleRef.current = currentAngleRef.current + fullSpins + targetOffset;

    const totalDelta = targetAngleRef.current - currentAngleRef.current;
    const startAngle = currentAngleRef.current;
    const startTime = performance.now();
    const duration = 4800 + Math.random() * 1200;

    let prevAngle = startAngle;

    // Small delay to ensure the portal canvas has mounted with its devicePixelRatio resolution
    const initTimer = setTimeout(() => {
      const fsCanvas = fullscreenCanvasRef.current;
      if (fsCanvas) {
        const dpr = window.devicePixelRatio || 1;
        fsCanvas.width = VIRTUAL_SIZE * dpr;
        fsCanvas.height = VIRTUAL_SIZE * dpr;
      }

      const animate = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);

        // Quintic ease-out for realistic decelerating spin
        const eased = 1 - Math.pow(1 - t, 4.5);
        const newAngle = startAngle + totalDelta * eased;
        const speed = newAngle - prevAngle;
        prevAngle = newAngle;

        currentAngleRef.current = newAngle;
        glowPhaseRef.current = (now - startTime) / 180;

        // Calculate peg collisions for pointer ticker physics
        const pegIndex = Math.floor(((newAngle + Math.PI / 2) / segAngle) % segCount);
        if (pegIndex !== lastPegCrossedRef.current && speed > 0.005) {
          lastPegCrossedRef.current = pegIndex;
          pointerDeflectionRef.current = -Math.min(0.28, speed * 2.2);
        } else {
          pointerDeflectionRef.current *= 0.82;
        }

        const activeCanvas = fullscreenCanvasRef.current;
        if (activeCanvas) {
          draw3DWheel(
            activeCanvas,
            currentAngleRef.current,
            glowPhaseRef.current,
            pointerDeflectionRef.current,
            true
          );
        }

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          currentAngleRef.current = targetAngleRef.current;
          if (activeCanvas) {
            draw3DWheel(activeCanvas, currentAngleRef.current, 0, 0, false);
          }

          if (!hasEndedRef.current) {
            hasEndedRef.current = true;
            const winnerPlace = places[winnerIndexRef.current];
            setWinnerName(winnerPlace.name);

            // Update card canvas as well
            if (cardCanvasRef.current) {
              draw3DWheel(cardCanvasRef.current, currentAngleRef.current, 0, 0, false);
            }

            // Celebratory pause before handing off to the winner modal
            setTimeout(() => {
              setManualFullscreen(false);
              onSpinEnd(winnerPlace);
            }, 1200);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }, 50);

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSpinning, places, draw3DWheel, onSpinEnd]);

  /* ── Empty State ── */
  if (places.length === 0) {
    return (
      <div
        className="flex items-center justify-center w-full aspect-square max-w-[380px] mx-auto rounded-3xl border border-dashed border-[#D1D1DB] p-8 text-center"
        style={{
          background: 'radial-gradient(circle, #fcfcfd 0%, #f1f2f6 100%)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div className="space-y-3">
          <div className="text-5xl animate-bounce">🎡</div>
          <p className="text-sm font-bold text-[#15151A]">Ready to build your wheel?</p>
          <p className="text-xs text-[#6F7078] max-w-xs mx-auto">
            Select 2 or more restaurants from the panel to bring this 3D wheel to life!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── 1. Idle Card View (Neatly nestled inside the left column card) ── */}
      <div
        className="relative group cursor-pointer select-none w-full aspect-square max-w-[380px] mx-auto rounded-full transition-transform duration-300 hover:scale-[1.02]"
        onClick={() => {
          if (places.length >= 2 && !isSpinning) {
            onSpinStart();
          }
        }}
        title={places.length >= 2 ? 'Click to spin!' : 'Add at least 2 restaurants to spin'}
      >
        <canvas
          ref={cardCanvasRef}
          className="w-full h-full block rounded-full"
          style={{
            filter: 'drop-shadow(0 12px 28px rgba(30,30,60,0.18))',
          }}
          role="img"
          aria-label="3D Olato Lucky Wheel"
        />

        {/* Expand button on hover */}
        {!isFullscreen && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setManualFullscreen(true);
            }}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm border border-black/5 cursor-pointer"
            title="Expand to full screen"
            aria-label="Expand to full screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ── 2. Automatic Fullscreen Lift Portal (Renders directly into document.body) ── */}
      {mounted &&
        isFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-500"
            role="dialog"
            aria-modal="true"
            aria-label="Lucky Wheel Fullscreen Spin"
            onClick={() => {
              if (!isSpinning) setManualFullscreen(false);
            }}
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full blur-[120px] opacity-40 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #6366F1 0%, #EC4899 45%, transparent 75%)',
                }}
              />
            </div>

            {/* Header Overlay Bar */}
            <div
              className="absolute top-4 sm:top-8 left-4 right-4 sm:left-8 sm:right-8 flex items-center justify-between z-20 max-w-4xl mx-auto w-full px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-2xl">
                <Sparkles className="w-4 h-4 text-[#A5B4FC] animate-spin" />
                <span className="text-xs sm:text-sm font-black tracking-wide">
                  {isSpinning ? '🎡 Deciding your fate…' : '3D Lucky Wheel'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setManualFullscreen(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white text-xs sm:text-sm font-bold backdrop-blur-md border border-white/15 transition-all shadow-xl cursor-pointer"
                aria-label="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Minimize</span>
              </button>
            </div>

            {/* Centered 3D Wheel Element */}
            <div
              className="relative select-none animate-in zoom-in-95 duration-500 ease-out"
              style={{
                width: 'min(88vw, 80vh, 560px)',
                height: 'min(88vw, 80vh, 560px)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Volumetric Lift Drop Shadow */}
              <div className="absolute inset-x-8 -bottom-8 h-16 rounded-full bg-black/75 blur-3xl pointer-events-none" />

              {/* Fullscreen High-Res Canvas */}
              <canvas
                ref={fullscreenCanvasRef}
                className="w-full h-full block rounded-full relative z-10"
                style={{
                  filter:
                    'drop-shadow(0 25px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 45px rgba(99,102,241,0.3))',
                }}
                role="img"
                aria-label="3D Olato Lucky Wheel Fullscreen"
              />

              {/* Winner Announcement Flash Banner */}
              {winnerName && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 animate-in zoom-in-90 duration-300 pointer-events-none">
                  <div className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white text-base sm:text-lg font-black shadow-2xl shadow-[#6366F1]/50 border border-white/30 whitespace-nowrap flex items-center gap-2">
                    <span>🎉</span>
                    <span>{winnerName}!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Subtitle Status */}
            <div
              className="mt-8 text-center text-white/70 text-xs sm:text-sm font-semibold max-w-sm px-4 select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {isSpinning
                ? 'Hold tight! The wheel is choosing your dining adventure…'
                : 'Click anywhere to return to the restaurant picker.'}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
