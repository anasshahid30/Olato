'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OlatoLogo } from '@/components/brand/OlatoLogo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    signUp(name, email);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7FA] p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-[#E7E7EC] rounded-3xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <OlatoLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#15151A]">Create an Account</h1>
          <p className="text-sm text-[#6F7078]">Discover verified local deals around you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#6F7078] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E7EC] bg-[#F7F7FA] text-sm text-[#15151A] focus:bg-white focus:border-[#5B5CE2] outline-none transition-all"
                placeholder="Hamza Malik"
              />
            </div>
          </div>

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
            <label className="text-xs font-bold text-[#15151A] uppercase tracking-wider">Password</label>
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
            Create Account
          </Button>
        </form>

        <div className="text-center text-xs text-[#6F7078] pt-2">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-[#5B5CE2] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
