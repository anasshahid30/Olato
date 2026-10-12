'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Place } from '@/lib/types';
import { repository } from '@/lib/repository';
import {
  Search,
  X,
  Check,
  Coffee,
  UtensilsCrossed,
  Star,
  Loader2,
  Plus,
  Minus,
  Shuffle,
  MapPin,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

const MAX_SELECTION = 10;
const PAGE_SIZE = 12;
const DEBOUNCE_MS = 300;

const CATEGORY_OPTIONS = [
  { id: 'ALL', label: 'All Places', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'CAFE', label: 'Cafés', icon: <Coffee className="w-3.5 h-3.5" /> },
  { id: 'RESTAURANT', label: 'Restaurants', icon: <UtensilsCrossed className="w-3.5 h-3.5" /> },
  { id: 'FEATURED_PLACE', label: 'Selected Places', icon: <Star className="w-3.5 h-3.5" /> },
];

interface WheelRestaurantPickerProps {
  selected: Place[];
  onSelectionChange: (places: Place[]) => void;
}

export function WheelRestaurantPicker({ selected, onSelectionChange }: WheelRestaurantPickerProps) {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sessionViewed, setSessionViewed] = useState<Place[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load all places from repository (synced from Supabase)
  useEffect(() => {
    const load = () => {
      const places = repository.getPlaces().filter(p => p.status === 'Active');
      setAllPlaces(places);
    };
    load();
    const unsub = repository.subscribe(load);
    return () => unsub();
  }, []);

  // Debounce search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setIsLoading(true);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
      setIsLoading(false);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  // Filtered + searched + paginated results
  const filteredPlaces = useMemo(() => {
    let base = allPlaces;

    if (activeCategory !== 'ALL') {
      base = base.filter(p => p.category === activeCategory);
    }

    if (debouncedQuery.trim()) {
      const results = repository.searchPlaces(debouncedQuery.trim(), 200);
      const resultIds = new Set(results.map(r => r.id));
      // Filter to match category too
      base = results.filter(r =>
        activeCategory === 'ALL' || r.category === activeCategory
      );
    }

    return base;
  }, [allPlaces, debouncedQuery, activeCategory]);

  const totalCount = filteredPlaces.length;
  const visiblePlaces = filteredPlaces.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePlaces.length < totalCount;

  // Featured / popular = isFeatured places
  const popularPlaces = useMemo(
    () => allPlaces.filter(p => p.isFeatured).slice(0, 6),
    [allPlaces]
  );

  // Discover categories derived from actual data
  const categoryCounts = useMemo(() => ({
    CAFE: allPlaces.filter(p => p.category === 'CAFE').length,
    RESTAURANT: allPlaces.filter(p => p.category === 'RESTAURANT').length,
    FEATURED_PLACE: allPlaces.filter(p => p.category === 'FEATURED_PLACE').length,
  }), [allPlaces]);

  // Close panel on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const isSelected = useCallback((id: string) => selected.some(s => s.id === id), [selected]);
  const atLimit = selected.length >= MAX_SELECTION;

  const togglePlace = useCallback((place: Place) => {
    if (isSelected(place.id)) {
      onSelectionChange(selected.filter(s => s.id !== place.id));
    } else {
      if (atLimit) return;
      onSelectionChange([...selected, place]);
      // Track session viewed
      setSessionViewed(prev => {
        if (prev.some(p => p.id === place.id)) return prev;
        return [place, ...prev].slice(0, 6);
      });
    }
  }, [selected, isSelected, atLimit, onSelectionChange]);

  const handleSurpriseMe = useCallback(() => {
    const eligible = allPlaces.filter(p => !isSelected(p.id));
    if (eligible.length === 0 || atLimit) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    onSelectionChange([...selected, pick]);
    setSessionViewed(prev => {
      if (prev.some(p => p.id === pick.id)) return prev;
      return [pick, ...prev].slice(0, 6);
    });
  }, [allPlaces, isSelected, atLimit, selected, onSelectionChange]);

  const showRecommendations = isFocused && !debouncedQuery.trim();
  const showResults = isFocused && (debouncedQuery.trim() || activeCategory !== 'ALL');
  const showDefaultList = !isFocused || (!debouncedQuery.trim() && !showRecommendations);

  const categoryLabel = (cat: string) => {
    if (cat === 'CAFE') return 'Café';
    if (cat === 'RESTAURANT') return 'Restaurant';
    if (cat === 'FEATURED_PLACE') return 'Selected Place';
    return cat;
  };

  return (
    <div ref={containerRef} className="relative w-full space-y-4">
      {/* ── Search Bar ─────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border transition-all duration-200 ${
            isFocused
              ? 'border-[#5B5CE2] ring-4 ring-[#5B5CE2]/10 shadow-md'
              : 'border-[#E7E7EC] shadow-sm hover:border-[#C8C9D8]'
          }`}
        >
          <Search className="w-5 h-5 text-[#5B5CE2] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search restaurants, cafés, or cuisines…"
            className="flex-1 text-sm text-[#15151A] bg-transparent outline-none placeholder:text-[#9A9BA4]"
            aria-label="Search restaurants"
            aria-expanded={isFocused}
            aria-haspopup="listbox"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="wheel-results-panel"
          />

          {isLoading && <Loader2 className="w-4 h-4 text-[#5B5CE2] animate-spin shrink-0" />}

          {searchQuery && !isLoading && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
              className="p-1 text-[#6F7078] hover:text-[#15151A] rounded-full hover:bg-[#F4F3F0] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isFocused && (
            <button
              type="button"
              onClick={() => { setIsFocused(false); setSearchQuery(''); }}
              className="text-xs font-semibold text-[#6F7078] hover:text-[#15151A] shrink-0 transition-colors px-1"
              aria-label="Close search"
            >
              Close
            </button>
          )}
        </div>

        {/* Results count */}
        {isFocused && debouncedQuery && (
          <p className="mt-1.5 ml-1 text-xs text-[#6F7078]" aria-live="polite" aria-atomic="true">
            {isLoading ? 'Searching…' : `${totalCount} result${totalCount !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      {/* ── Category Filter (always visible when focused) ─────────── */}
      {isFocused && (
        <div
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
          role="group"
          aria-label="Filter by category"
        >
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { setActiveCategory(cat.id); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#5B5CE2] text-white shadow-sm'
                  : 'bg-white border border-[#E7E7EC] text-[#6F7078] hover:text-[#15151A] hover:border-[#C8C9D8]'
              }`}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.icon}
              {cat.label}
              {cat.id !== 'ALL' && categoryCounts[cat.id as keyof typeof categoryCounts] > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  activeCategory === cat.id ? 'bg-white/20' : 'bg-[#F4F3F0]'
                }`}>
                  {categoryCounts[cat.id as keyof typeof categoryCounts]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Recommendations Panel (focused + empty query) ─────────── */}
      {showRecommendations && !debouncedQuery && activeCategory === 'ALL' && (
        <div
          id="wheel-results-panel"
          ref={panelRef}
          className="w-full bg-white border border-[#E7E7EC] rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label="Restaurant recommendations"
        >
          <div className="divide-y divide-[#F4F3F0]">
            {/* Popular / Featured */}
            {popularPlaces.length > 0 && (
              <section className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#5B5CE2]" />
                  <h3 className="text-xs font-extrabold text-[#15151A] uppercase tracking-wider">
                    Popular choices
                  </h3>
                </div>
                <div className="space-y-1">
                  {popularPlaces.map(place => (
                    <PlaceResultRow
                      key={place.id}
                      place={place}
                      isSelected={isSelected(place.id)}
                      atLimit={atLimit}
                      onToggle={() => togglePlace(place)}
                      categoryLabel={categoryLabel(place.category)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Session history */}
            {sessionViewed.filter(p => !isSelected(p.id)).length > 0 && (
              <section className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#F59E0B]" />
                  <h3 className="text-xs font-extrabold text-[#15151A] uppercase tracking-wider">
                    Recently selected
                  </h3>
                </div>
                <div className="space-y-1">
                  {sessionViewed.filter(p => !isSelected(p.id)).map(place => (
                    <PlaceResultRow
                      key={place.id}
                      place={place}
                      isSelected={isSelected(place.id)}
                      atLimit={atLimit}
                      onToggle={() => togglePlace(place)}
                      categoryLabel={categoryLabel(place.category)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Surprise Me */}
            {!atLimit && (
              <section className="p-4">
                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#EEF0FF] to-[#F0FDF4] border border-[#5B5CE2]/20 hover:border-[#5B5CE2]/50 text-[#5B5CE2] font-semibold text-sm transition-all group"
                >
                  <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Surprise me — pick one at random
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ── Search Results Panel ───────────────────────────────────── */}
      {isFocused && (debouncedQuery.trim() || activeCategory !== 'ALL') && (
        <div
          id="wheel-results-panel"
          ref={panelRef}
          className="w-full bg-white border border-[#E7E7EC] rounded-2xl shadow-xl overflow-hidden"
          role="listbox"
          aria-label="Search results"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#6F7078]">
              <Loader2 className="w-4 h-4 animate-spin text-[#5B5CE2]" />
              Searching…
            </div>
          ) : visiblePlaces.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <p className="text-sm font-semibold text-[#15151A]">No restaurants found</p>
              <p className="text-xs text-[#6F7078]">Try another name, category, or cuisine.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                className="mx-auto mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#5B5CE2] hover:underline"
              >
                <X className="w-3.5 h-3.5" /> Clear search
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F4F3F0]">
              <div className="p-3 space-y-1">
                {visiblePlaces.map(place => (
                  <PlaceResultRow
                    key={place.id}
                    place={place}
                    isSelected={isSelected(place.id)}
                    atLimit={atLimit}
                    onToggle={() => togglePlace(place)}
                    categoryLabel={categoryLabel(place.category)}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => setPage(p => p + 1)}
                    className="text-xs font-bold text-[#5B5CE2] hover:underline"
                  >
                    Load more ({totalCount - visiblePlaces.length} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Default grid of all places when not focused ───────────── */}
      {!isFocused && (
        <div className="space-y-4">
          {/* Limit warning */}
          {atLimit && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <span>Maximum {MAX_SELECTION} restaurants selected. Deselect one to add another.</span>
            </div>
          )}

          {/* Category filter (collapsed view) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORY_OPTIONS.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#5B5CE2] text-white shadow-sm'
                    : 'bg-white border border-[#E7E7EC] text-[#6F7078] hover:text-[#15151A]'
                }`}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
            role="list"
            aria-label="Available restaurants"
          >
            {filteredPlaces.slice(0, page * PAGE_SIZE).map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={isSelected(place.id)}
                atLimit={atLimit}
                onToggle={() => togglePlace(place)}
                categoryLabel={categoryLabel(place.category)}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2.5 rounded-xl border border-[#E7E7EC] text-xs font-bold text-[#5B5CE2] hover:bg-[#EEF0FF] transition-colors"
              >
                Show more ({totalCount - visiblePlaces.length} more)
              </button>
            </div>
          )}

          {filteredPlaces.length === 0 && (
            <div className="text-center py-8 text-sm text-[#6F7078]">
              No restaurants in this category.
              <button
                type="button"
                onClick={() => setActiveCategory('ALL')}
                className="ml-2 font-semibold text-[#5B5CE2] hover:underline"
              >
                Show all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compact row for dropdown panels ──────────────────────────────────────────
interface RowProps {
  place: Place;
  isSelected: boolean;
  atLimit: boolean;
  onToggle: () => void;
  categoryLabel: string;
}

function PlaceResultRow({ place, isSelected, atLimit, onToggle, categoryLabel }: RowProps) {
  const canAdd = isSelected || !atLimit;
  return (
    <div
      role="option"
      aria-selected={isSelected}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
        isSelected
          ? 'bg-[#EEF0FF] border border-[#5B5CE2]/30'
          : canAdd
          ? 'hover:bg-[#F7F7FA] border border-transparent'
          : 'opacity-50 cursor-not-allowed border border-transparent'
      }`}
      onClick={canAdd ? onToggle : undefined}
    >
      {/* Image */}
      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[#F4F3F0]">
        {place.images[0] ? (
          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#9A9BA4] text-xs">
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#15151A] truncate">{place.name}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-[#6F7078] mt-0.5">
          <span className="font-semibold text-[#5B5CE2]">{categoryLabel}</span>
          {place.area && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />{place.area}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={e => { e.stopPropagation(); if (canAdd) onToggle(); }}
        aria-label={isSelected ? `Remove ${place.name}` : `Add ${place.name}`}
        className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
          isSelected
            ? 'bg-[#5B5CE2] text-white'
            : canAdd
            ? 'bg-[#F4F3F0] text-[#6F7078] hover:bg-[#5B5CE2] hover:text-white group-hover:bg-[#5B5CE2] group-hover:text-white'
            : 'bg-[#F4F3F0] text-[#D0D0D8]'
        }`}
        disabled={!canAdd}
      >
        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─── Full card for the grid view (not focused) ────────────────────────────────
function PlaceCard({ place, isSelected, atLimit, onToggle, categoryLabel }: RowProps) {
  const canAdd = isSelected || !atLimit;

  return (
    <div
      role="listitem"
      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
        isSelected
          ? 'bg-[#EEF0FF] border-[#5B5CE2]/40 shadow-sm'
          : 'bg-white border-[#E7E7EC] hover:border-[#C8C9D8] hover:shadow-sm'
      }`}
    >
      {/* Image */}
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#F4F3F0]">
        {place.images[0] ? (
          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#15151A] truncate leading-tight">{place.name}</p>
        <p className="text-[11px] font-semibold text-[#5B5CE2] mt-0.5">{categoryLabel}</p>
        {place.area && (
          <div className="flex items-center gap-1 text-[11px] text-[#6F7078] mt-0.5">
            <MapPin className="w-3 h-3" />{place.area}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={canAdd ? onToggle : undefined}
        aria-label={isSelected ? `Remove ${place.name}` : `Add ${place.name} to wheel`}
        disabled={!canAdd}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          isSelected
            ? 'bg-[#5B5CE2] text-white shadow-sm'
            : canAdd
            ? 'bg-[#F4F3F0] text-[#6F7078] hover:bg-[#5B5CE2] hover:text-white'
            : 'bg-[#F4F3F0] text-[#D0D0D8] cursor-not-allowed'
        }`}
      >
        {isSelected ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Added
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5" />
            Add
          </>
        )}
      </button>
    </div>
  );
}
