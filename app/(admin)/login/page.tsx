'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { loginAdmin } from '@/app/actions/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      // Jika berhasil, arahkan ke dashboard admin
      router.push('/admin/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Terjadi kesalahan: " + error.message);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4 py-12">
      
      {/* Tombol Kembali ke Beranda */}
      <div className="w-full max-w-md mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Card Login */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-sm p-8 md:p-10 flex flex-col">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#1BA0E2] rounded-2xl flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masuk khusus konselor dan admin sekolah.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {errorMessage}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@sekolah.sch.id"
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2] transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-[#1BA0E2] text-white py-3 rounded-full text-sm font-medium shadow-md hover:bg-[#1588c2] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>Memproses... <Loader2 className="w-4 h-4 animate-spin" /></>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>

      </div>

      {/* Footer info kecil */}
      <div className="mt-8 text-center text-xs text-gray-400">
        Whispr Portal &bull; Aman & Terenkripsi
      </div>

    </div>
  );
}