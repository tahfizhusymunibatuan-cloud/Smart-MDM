'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    try {
      // Strict Real Backend API Request
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: cleanUser, password: cleanPass }),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok && resData?.success && resData?.data?.access_token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', resData.data.access_token);
          localStorage.setItem('user', JSON.stringify(resData.data.user));
          localStorage.setItem('user_role', resData.data.user.role);
        }
        router.push('/');
      } else {
        setErrorMessage(
          resData?.message || 'Username atau password salah! Silakan periksa kembali data di database Neon.',
        );
      }
    } catch (err: any) {
      // Backend server is offline / stopped
      setErrorMessage(
        '❌ Gagal Terhubung ke Server Backend (http://localhost:4000). Server backend belum berjalan! Jalankan "npm run start:dev" di terminal backend terlebih dahulu.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 relative z-10 border border-border shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-white font-bold shadow-xl shadow-emerald-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Smart MDM Pondok</h1>
          <p className="text-xs text-muted-foreground">Pondok Pesantren Tahfizh Quran Al-Usymuni • Portal Otentikasi</p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Username</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Username Admin / Pengurus / Santri"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-accent/40 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-accent/40 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-500/25 touch-target"
          >
            <span>{loading ? 'Memeriksa Server Backend...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center space-y-2 pt-2 border-t border-border/50">
          <Link href="/register-santri" className="text-xs font-semibold text-emerald-500 hover:underline block">
            Santri Baru? Registrasi Mandiri & Pendaftaran HP Di Sini
          </Link>
          <div className="text-[11px] text-muted-foreground">
            Sistem Khusus Internal Pondok (Single-Tenant)
          </div>
        </div>
      </div>
    </div>
  );
}
