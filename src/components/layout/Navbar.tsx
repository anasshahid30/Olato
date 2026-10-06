import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { LocationSelector } from './LocationSelector';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useAuth } from '@/context/AuthContext';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { repository } from '@/lib/repository';
import { Place, Discount } from '@/lib/types';
import {
  Search,
  Heart,
  User,
  Map,
  Shield,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Grid,
  Home,
  Coffee,
  UtensilsCrossed,
  MapPin,
  TrendingUp,
  Percent,
} from 'lucide-react';

interface NavbarProps {
  onOpenAIModal?: () => void;
}

const TRENDING_SEARCHES = [
  'Café Aylanto',
  'Paola’s Cosa Nostra',
  'The Mad Italian',
  'Ox & Grill',
  'Carné Steakhouse',
  'HBL Discounts',
  'Gulberg Cafés',
];

export function Navbar({ onOpenAIModal }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedCount } = useSavedDeals();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [matchedPlaces, setMatchedPlaces] = useState<Place[]>([]);
  const [matchedDiscounts, setMatchedDiscounts] = useState<Discount[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  // Live search query matching as user types
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setMatchedPlaces([]);
      setMatchedDiscounts([]);
      return;
    }

    const places = repository.searchPlaces(q, 4);
    const deals = repository.getDiscounts({ query: q }).slice(0, 4);

    setMatchedPlaces(places);
    setMatchedDiscounts(deals);
  }, [searchQuery]);

  const handleQuickSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    setIsDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setMatchedPlaces([]);
    setMatchedDiscounts([]);
  };

  const navLinks = [
    { href: '/', label: 'Discover', icon: <Home className="w-4 h-4" /> },
    { href: '/map', label: 'Nearby', icon: <Map className="w-4 h-4" /> },
    { href: '/saved', label: 'Saved', badge: savedCount, icon: <Heart className="w-4 h-4" /> },
    { href: '/#categories', label: 'Categories', icon: <Grid className="w-4 h-4" /> },
  ];

  const isAdminArea = pathname.startsWith('/admin');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E7EC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6 shrink-0">
            <OlatoLogo size="md" />

            {isAdmin && (
              <Link
                href="/admin"
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isAdminArea
                    ? 'bg-[#5B5CE2] text-white border-[#5B5CE2]'
                    : 'bg-[#EEF0FF] text-[#5B5CE2] border-[#5B5CE2]/30 hover:bg-[#5B5CE2] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Center: Search Input Bar with Instant Dropdown (Desktop) */}
          {!isAdminArea && (
            <div
              ref={searchContainerRef}
              className="hidden lg:block flex-1 max-w-lg relative"
            >
              <form onSubmit={handleQuickSearch} className="relative w-full">
                <div className="relative w-full flex items-center bg-white border border-[#E7E7EC] rounded-2xl focus-within:border-[#5B5CE2] focus-within:ring-4 focus-within:ring-[#5B5CE2]/10 shadow-xs transition-all">
                  <Search className="w-4 h-4 text-[#6F7078] ml-3.5 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsDropdownOpen(false);
                    }}
                    placeholder="Search cafés, restaurants or discounts..."
                    className="w-full py-2.5 pr-2 text-sm text-[#15151A] bg-transparent outline-none placeholder:text-[#6F7078]"
                  />

                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 mr-1 text-[#6F7078] hover:text-[#15151A] rounded-full hover:bg-[#F4F3F0] transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* AI Natural Discovery Shortcut */}
                  {onOpenAIModal && (
                    <button
                      type="button"
                      onClick={onOpenAIModal}
                      title="AI Natural Discovery"
                      className="flex items-center gap-1 px-2.5 py-1 mr-1.5 text-xs font-bold text-[#5B5CE2] bg-[#EEF0FF] hover:bg-[#5B5CE2] hover:text-white rounded-xl transition-all shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI</span>
                    </button>
                  )}
                </div>
              </form>

              {/* Floating Instant Live Search Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E7E7EC] rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Scenario A: Query provided */}
                  {searchQuery.trim().length > 0 ? (
                    <div className="max-h-[460px] overflow-y-auto divide-y divide-[#F0F0F4]">
                      {/* Section 1: Matching Places */}
                      {matchedPlaces.length > 0 && (
                        <div className="p-3">
                          <div className="text-[10px] font-bold text-[#6F7078] uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                            <span>Places & Venues</span>
                            <span className="text-[#5B5CE2] font-semibold">
                              {matchedPlaces.length} found
                            </span>
                          </div>
                          <div className="space-y-1">
                            {matchedPlaces.map((place) => (
                              <button
                                key={place.id}
                                type="button"
                                onClick={() => handleSelectSuggestion(place.name)}
                                className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F8FC] transition-colors group cursor-pointer"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#EEF0FF] text-[#5B5CE2] flex items-center justify-center shrink-0 group-hover:bg-[#5B5CE2] group-hover:text-white transition-colors">
                                  {place.category === 'CAFE' ? (
                                    <Coffee className="w-4 h-4" />
                                  ) : (
                                    <UtensilsCrossed className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-[#15151A] truncate group-hover:text-[#5B5CE2] transition-colors">
                                    {place.name}
                                  </div>
                                  <div className="text-[11px] text-[#6F7078] truncate flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-[#6F7078]" />
                                    <span>{place.area || place.city}</span>
                                    <span>•</span>
                                    <span>{place.category === 'CAFE' ? 'Café' : 'Restaurant'}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-[#6F7078] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 2: Matching Discounts */}
                      {matchedDiscounts.length > 0 && (
                        <div className="p-3">
                          <div className="text-[10px] font-bold text-[#6F7078] uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
                            <span>Matching Deals</span>
                            <span className="text-[#19B87A] font-semibold">
                              {matchedDiscounts.length} active
                            </span>
                          </div>
                          <div className="space-y-1">
                            {matchedDiscounts.map((discount) => (
                              <Link
                                key={discount.id}
                                href={`/discounts/${discount.id}`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8F8FC] transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#E8FAF2] text-[#19B87A] flex items-center justify-center font-black text-xs shrink-0">
                                  <Percent className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-[#15151A] truncate group-hover:text-[#5B5CE2] transition-colors">
                                    {discount.offerTitle}
                                  </div>
                                  <div className="text-[11px] text-[#6F7078] truncate flex items-center gap-1.5">
                                    <span className="font-semibold text-[#15151A]">
                                      {discount.placeName}
                                    </span>
                                    {discount.bankCard && (
                                      <>
                                        <span>•</span>
                                        <span className="text-[#5B5CE2] font-medium">
                                          {discount.bankCard}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-[#19B87A] bg-[#E8FAF2] px-2 py-0.5 rounded-lg shrink-0">
                                  {discount.discountDetails}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* If no places or discounts found */}
                      {matchedPlaces.length === 0 && matchedDiscounts.length === 0 && (
                        <div className="p-6 text-center">
                          <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#6F7078] flex items-center justify-center mx-auto mb-2 border border-[#E7E7EC]">
                            <Search className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-[#15151A]">
                            No exact matches for &quot;{searchQuery}&quot;
                          </p>
                          <p className="text-[11px] text-[#6F7078] mt-1">
                            Press Enter to search all tags, categories, or banks.
                          </p>
                        </div>
                      )}

                      {/* Footer: Press Enter or View All */}
                      <div className="p-2.5 bg-[#FAF9F6] border-t border-[#E7E7EC] flex items-center justify-between text-xs">
                        <span className="text-[#6F7078] text-[11px]">
                          Press <kbd className="px-1.5 py-0.5 bg-white border border-[#E7E7EC] rounded font-mono text-[10px]">Enter</kbd> to see full results
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickSearch()}
                          className="font-bold text-[#5B5CE2] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Search</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Scenario B: Query is empty — show Trending Searches & Popular Places */
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#15151A]">
                        <TrendingUp className="w-3.5 h-3.5 text-[#5B5CE2]" />
                        <span>Popular &amp; Recommended Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TRENDING_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleSelectSuggestion(term)}
                            className="px-3 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#EEF0FF] text-[#15151A] hover:text-[#5B5CE2] border border-[#E7E7EC] hover:border-[#5B5CE2]/30 text-xs font-medium transition-all cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Nav Controls */}
          <div className="hidden md:flex items-center gap-3">
            <LocationSelector />

            {/* Nav Links */}
            <nav className="flex items-center gap-1 border-l border-[#E7E7EC] pl-3">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'text-[#5B5CE2] bg-[#EEF0FF]'
                        : 'text-[#6F7078] hover:text-[#15151A] hover:bg-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span suppressHydrationWarning className="flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Account / Profile button */}
            <Link
              href={user ? '/profile' : '/auth/login'}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#E7E7EC] bg-white hover:bg-[#F4F3F0] transition-all"
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#EEF0FF] text-[#5B5CE2] flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span suppressHydrationWarning className="text-xs font-bold text-[#15151A] max-w-[90px] truncate">
                {user ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </Link>

            {/* Prominent Right Action: Find a deal → */}
            <Link href="/search">
              <MagneticButton
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Find a deal
              </MagneticButton>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <LocationSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#15151A] rounded-xl border border-[#E7E7EC] bg-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7E7EC] bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleQuickSearch} className="flex items-center bg-[#FAF9F6] rounded-xl px-3 py-2 border border-[#E7E7EC]">
              <Search className="w-4 h-4 text-[#6F7078] mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cafés, restaurants or deals..."
                className="w-full text-sm bg-transparent outline-none text-[#15151A]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-[#6F7078] hover:text-[#15151A]"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Mobile matching live preview */}
            {searchQuery.trim().length > 0 && (
              <div className="bg-[#FAF9F6] rounded-xl p-2.5 border border-[#E7E7EC] space-y-1.5">
                <div className="text-[10px] font-bold text-[#6F7078] uppercase tracking-wider px-1">
                  Matching Results
                </div>
                {matchedPlaces.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSelectSuggestion(p.name);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-white border border-[#E7E7EC] text-xs font-bold text-[#15151A] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      {p.category === 'CAFE' ? <Coffee className="w-3.5 h-3.5 text-[#5B5CE2]" /> : <UtensilsCrossed className="w-3.5 h-3.5 text-[#5B5CE2]" />}
                      <span className="truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-[#6F7078] shrink-0 font-normal">{p.area}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleQuickSearch();
                  }}
                  className="w-full py-1.5 text-center text-xs font-bold text-[#5B5CE2] hover:underline"
                >
                  View all deals for &quot;{searchQuery}&quot; →
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border ${
                    pathname === link.href ? 'bg-[#EEF0FF] text-[#5B5CE2] border-[#5B5CE2]/30' : 'bg-[#FAF9F6] border-[#E7E7EC] text-[#15151A]'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-auto bg-[#EF4444] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E7E7EC] flex items-center gap-2">
              <Link
                href={user ? '/profile' : '/auth/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-between p-3 rounded-xl bg-white border border-[#E7E7EC] text-[#15151A] font-semibold text-sm"
              >
                <span>{user ? `Account (${user.name})` : 'Sign In / Sign Up'}</span>
                <User className="w-4 h-4 text-[#5B5CE2]" />
              </Link>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#5B5CE2] text-white font-bold rounded-xl text-sm"
              >
                Find a deal →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Bar for Native Feel */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E7EC] px-3 py-2 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            pathname === '/' ? 'text-[#5B5CE2]' : 'text-[#6F7078]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Discover</span>
        </Link>

        <Link
          href="/map"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            pathname === '/map' ? 'text-[#5B5CE2]' : 'text-[#6F7078]'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Nearby</span>
        </Link>

        <Link
          href="/saved"
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            pathname === '/saved' ? 'text-[#5B5CE2]' : 'text-[#6F7078]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-[#EF4444] text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {savedCount}
            </span>
          )}
        </Link>

        <Link
          href={user ? '/profile' : '/auth/login'}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold ${
            pathname === '/profile' || pathname.startsWith('/auth') ? 'text-[#5B5CE2]' : 'text-[#6F7078]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>
    </>
  );
}
