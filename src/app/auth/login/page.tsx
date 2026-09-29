'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAuth } from '@/context/AuthContext';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { Shield, User, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('hamza@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(email, 'USER');
    router.push('/profile');
  };

  const handleAdminSignIn = () => {
    signIn('admin@olato.com', 'ADMIN');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#15151A]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#E7E7EC] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <OlatoLogo size="md" />
            </div>
            <h1 className="text-2xl font-black text-[#15151A] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-[#6F7078]">Sign in to access your saved local deals and preferences.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Email Address</label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] focus-within:border-[#5B5CE2] focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-[#6F7078] mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm bg-transparent outline-none text-[#15151A]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-[#5B5CE2] hover:underline font-semibold">Forgot?</a>
              </div>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] focus-within:border-[#5B5CE2] focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-[#6F7078] mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-transparent outline-none text-[#15151A]"
                  required
                />
              </div>
            </div>

            <MagneticButton variant="primary" size="md" className="w-full" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </MagneticButton>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="pt-4 border-t border-[#E7E7EC] space-y-3">
            <span className="text-[11px] font-bold text-[#6F7078] uppercase tracking-wider block text-center">
              Quick Prototype Demo Switcher
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  signIn('hamza@example.com', 'USER');
                  router.push('/profile');
                }}
                className="p-2.5 rounded-xl border border-[#E7E7EC] bg-[#FAF9F6] hover:bg-[#EEF0FF] hover:border-[#5B5CE2] text-xs font-bold text-[#15151A] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#5B5CE2]" />
                <span>Demo User</span>
              </button>

              <button
                type="button"
                onClick={handleAdminSignIn}
                className="p-2.5 rounded-xl border border-[#5B5CE2]/30 bg-[#EEF0FF] hover:bg-[#5B5CE2] hover:text-white text-xs font-bold text-[#5B5CE2] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#6F7078]">
            Don't have an account yet?{' '}
            <Link href="/auth/register" className="text-[#5B5CE2] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
