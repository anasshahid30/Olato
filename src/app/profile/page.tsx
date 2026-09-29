'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAuth } from '@/context/AuthContext';
import { useSavedDeals } from '@/context/SavedDealsContext';
import { useLocation } from '@/context/LocationContext';
import {
  User,
  Mail,
  Heart,
  MapPin,
  GraduationCap,
  CreditCard,
  LogOut,
  Shield,
  CheckCircle2,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, updateProfile, isAdmin } = useAuth();
  const { savedCount } = useSavedDeals();
  const { activeHub, allHubs, setHub } = useLocation();

  const [studentVerified, setStudentVerified] = useState(user?.studentVerified ?? true);
  const [preferredBank, setPreferredBank] = useState('Standard Chartered');
  const [notifyDeals, setNotifyDeals] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
        <Navbar />
        <main className="flex-1 max-w-lg mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold">Please Sign In</h2>
          <p className="text-sm text-[#6F7078]">You need to be logged in to view your profile and saved discount preferences.</p>
          <Link href="/auth/login">
            <MagneticButton variant="primary" size="md">
              Sign In to Olato
            </MagneticButton>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ studentVerified });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#5B5CE2]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#EEF0FF] text-[#5B5CE2] flex items-center justify-center font-bold text-2xl">
                <User className="w-10 h-10" />
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#15151A]">{user.name}</h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5CE2] text-[10px] font-extrabold uppercase tracking-wider border border-[#5B5CE2]/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6F7078] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {studentVerified ? 'Student Verified' : 'Standard Member'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link href="/admin">
                <MagneticButton variant="outline" size="sm" icon={<Shield className="w-4 h-4 text-[#5B5CE2]" />}>
                  Admin Portal
                </MagneticButton>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/saved" className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs hover:border-[#5B5CE2]/40 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Saved Deals</span>
              <div className="text-3xl font-black text-[#15151A]">{savedCount}</div>
            </div>
            <div className="p-3 bg-[#EEF0FF] text-[#5B5CE2] rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
          </Link>

          <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Preferred Area</span>
              <div className="text-lg font-black text-[#15151A] truncate max-w-[150px]">{activeHub.name}</div>
            </div>
            <div className="p-3 bg-emerald-50 text-[#10B981] rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E7E7EC] shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider">Bank Privileges</span>
              <div className="text-lg font-black text-[#15151A] truncate max-w-[150px]">{preferredBank}</div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSavePreferences} className="bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#15151A] pb-2 border-b border-[#E7E7EC]">
            Discount Discovery Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Preferred Neighborhood Hub */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#5B5CE2]" />
                Primary Location Hub
              </label>
              <select
                value={activeHub.id}
                onChange={(e) => {
                  const found = allHubs.find((h) => h.id === e.target.value);
                  if (found) setHub(found);
                }}
                className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] text-sm text-[#15151A] font-semibold outline-none focus:border-[#5B5CE2]"
              >
                {allHubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name} ({hub.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Bank Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#5B5CE2]" />
                Primary Payment Card
              </label>
              <select
                value={preferredBank}
                onChange={(e) => setPreferredBank(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] text-sm text-[#15151A] font-semibold outline-none focus:border-[#5B5CE2]"
              >
                <option value="Standard Chartered">Standard Chartered</option>
                <option value="Alfalah">Bank Alfalah</option>
                <option value="HBL">HBL Prestige</option>
                <option value="Meezan">Meezan Bank</option>
                <option value="Faysal">Faysal Bank</option>
                <option value="All Cards">Any Visa / Mastercard</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4 pt-4 border-t border-[#E7E7EC]">
            <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E7EC]">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#15151A] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#5B5CE2]" />
                  <span>Student Discount Verification Status</span>
                </div>
                <p className="text-xs text-[#6F7078]">
                  Enables dedicated 20-30% student discounts at participating cafés and bistros.
                </p>
              </div>

              <input
                type="checkbox"
                checked={studentVerified}
                onChange={(e) => setStudentVerified(e.target.checked)}
                className="w-5 h-5 accent-[#5B5CE2] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-[#E7E7EC]">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-[#15151A] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#5B5CE2]" />
                  <span>Expiring Deal Reminders</span>
                </div>
                <p className="text-xs text-[#6F7078]">
                  Receive notifications when a deal in your saved pocket is expiring in 48 hours.
                </p>
              </div>

              <input
                type="checkbox"
                checked={notifyDeals}
                onChange={(e) => setNotifyDeals(e.target.checked)}
                className="w-5 h-5 accent-[#5B5CE2] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Preferences updated successfully!
              </span>
            ) : (
              <span className="text-xs text-[#6F7078]">Changes are saved to your local profile.</span>
            )}

            <MagneticButton variant="primary" size="sm" type="submit">
              Save Preferences
            </MagneticButton>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
