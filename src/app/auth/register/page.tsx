'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useAuth } from '@/context/AuthContext';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { User, Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    signUp(name, email);
    router.push('/profile');
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
            <h1 className="text-2xl font-black text-[#15151A] tracking-tight">Create an Account</h1>
            <p className="text-xs text-[#6F7078]">Join Olato to save local discounts and unlock student verification perks.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Full Name</label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] focus-within:border-[#5B5CE2] focus-within:bg-white transition-all">
                <User className="w-4 h-4 text-[#6F7078] mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Ahmed"
                  className="w-full text-sm bg-transparent outline-none text-[#15151A]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Email Address</label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] focus-within:border-[#5B5CE2] focus-within:bg-white transition-all">
                <Mail className="w-4 h-4 text-[#6F7078] mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="w-full text-sm bg-transparent outline-none text-[#15151A]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Password</label>
              <div className="flex items-center px-3.5 py-3 rounded-2xl bg-[#FAF9F6] border border-[#E7E7EC] focus-within:border-[#5B5CE2] focus-within:bg-white transition-all">
                <Lock className="w-4 h-4 text-[#6F7078] mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full text-sm bg-transparent outline-none text-[#15151A]"
                  required
                />
              </div>
            </div>

            <MagneticButton variant="primary" size="md" className="w-full" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
              Create Account
            </MagneticButton>
          </form>

          <div className="text-center text-xs text-[#6F7078]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#5B5CE2] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
