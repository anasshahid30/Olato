'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useLocation } from '@/context/LocationContext';
import { User, MapPin, Heart, GraduationCap, Shield, LogOut, Settings, Check } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateProfile } = useAuth();
  const { savedCount } = useSavedDeals();
  const { activeHub, setHub, allHubs } = useLocation();

  const [studentVerified, setStudentVerified] = useState(user?.studentVerified ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <User className="w-12 h-12 text-[#5B5CE2] mb-3" />
          <h2 className="text-xl font-bold text-[#15151A]">Please Sign In</h2>
          <p className="text-sm text-[#6F7078] mb-6">Sign in to view your profile and saved preferences.</p>
          <Link href="/auth/signin">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSavePreferences = () => {
    updateProfile({ studentVerified });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FA]">
      <Navbar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-8 py-8 w-full">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="bg-white border border-[#E7E7EC] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#5B5CE2]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#15151A]">{user.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5CE2] text-xs font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-[#6F7078]">{user.email}</p>
                <p className="text-xs text-[#19B87A] font-semibold mt-1">✓ Verified Olato Discovery Member</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/saved')}
                icon={<Heart className="w-4 h-4 text-[#EF4444]" />}
              >
                Saved ({savedCount})
              </Button>
              <Button variant="danger" size="sm" onClick={handleSignOut} icon={<LogOut className="w-4 h-4" />}>
                Sign Out
              </Button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Location Hub */}
            <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5B5CE2]" />
                <h3 className="text-lg font-bold text-[#15151A]">Default Discovery Hub</h3>
              </div>
              <p className="text-xs text-[#6F7078]">
                Set your primary city neighborhood to automatically surface deals near your home or workplace.
              </p>

              <div className="space-y-2">
                {allHubs.map((hub) => (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => setHub(hub)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                      activeHub.id === hub.id
                        ? 'bg-[#EEF0FF] border-[#5B5CE2] text-[#5B5CE2]'
                        : 'bg-white border-[#E7E7EC] hover:bg-[#F7F7FA] text-[#15151A]'
                    }`}
                  >
                    <span>{hub.name} ({hub.area})</span>
                    {activeHub.id === hub.id && <Check className="w-4 h-4 text-[#5B5CE2]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Student & Eligibility Preferences */}
            <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#5B5CE2]" />
                <h3 className="text-lg font-bold text-[#15151A]">Member Eligibility</h3>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7FA] border border-[#E7E7EC] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#15151A]">Student Deal Focus</h4>
                  <p className="text-xs text-[#6F7078]">Highlight student discounts across coffee shops</p>
                </div>
                <input
                  type="checkbox"
                  checked={studentVerified}
                  onChange={(e) => setStudentVerified(e.target.checked)}
                  className="w-5 h-5 accent-[#5B5CE2] rounded cursor-pointer"
                />
              </div>

              {user.role === 'ADMIN' && (
                <div className="p-4 rounded-2xl bg-[#EEF0FF] border border-[#5B5CE2]/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#5B5CE2]">Merchant Admin Access</h4>
                    <p className="text-xs text-[#6F7078]">You have administrative credentials to manage places</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => router.push('/admin')}>
                    Go to Portal
                  </Button>
                </div>
              )}

              <Button variant="primary" size="md" onClick={handleSavePreferences} className="w-full">
                {savedSuccess ? 'Preferences Saved!' : 'Save Profile Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
