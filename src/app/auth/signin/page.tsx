'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Shield, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('hamza@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    signIn(email, 'USER');
    router.push('/');
  };

  const handleAdminDemoLogin = () => {
    signIn('admin@olato.com', 'ADMIN');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7FA] p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E7E7EC] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <OlatoLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#15151A]">Welcome back</h1>
          <p className="text-sm text-[#6F7078]">Sign in to manage your saved deals and preferences</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#EF4444]/30 text-xs font-semibold text-[#EF4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6F7078] absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E7EC] bg-[#F7F7FA] text-sm text-[#15151A] focus:bg-white focus:border-[#5B5CE2] outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-[#5B5CE2] hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6F7078] absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E7EC] bg-[#F7F7FA] text-sm text-[#15151A] focus:bg-white focus:border-[#5B5CE2] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        {/* Demo Fast Logins */}
        <div className="pt-4 border-t border-[#E7E7EC] space-y-2">
          <span className="text-xs font-bold text-[#6F7078] uppercase tracking-wider block text-center mb-2">
            Instant Demo Access
          </span>

          <button
            type="button"
            onClick={handleAdminDemoLogin}
            className="w-full p-3 rounded-xl border border-[#5B5CE2]/30 bg-[#EEF0FF] hover:bg-[#5B5CE2] hover:text-white text-xs font-bold text-[#5B5CE2] transition-all flex items-center justify-center gap-2 group"
          >
            <Shield className="w-4 h-4" />
            <span>Sign In as Admin (Merchant Portal)</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#6F7078] pt-2">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#5B5CE2] font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
