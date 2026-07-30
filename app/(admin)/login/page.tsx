"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Hardcode dummy credentials
    const DUMMY_EMAIL = "bk@sekolah.id";
    const DUMMY_NIP = "19800101";
    const DUMMY_PASSWORD = "admin";

    // Simulasi delay API
    setTimeout(() => {
      if (email === DUMMY_EMAIL && nip === DUMMY_NIP && password === DUMMY_PASSWORD) {
        setError("");
        router.push("/dashboard");
      } else {
        setError("Kredensial tidak valid. Silakan periksa kembali Email, NIP, dan Password.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-400 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 w-full max-w-sm shadow-2xl text-center">
        
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Whisper</h1>
          <p className="text-slate-500 font-medium text-sm">Portal Guru BK</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-2xl border border-red-100 text-left">
              {error}
            </div>
          )}

          <input 
            type="email" 
            placeholder="Email Institusi" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-semibold placeholder-slate-400 outline-none focus:ring-4 focus:ring-pink-500/30 transition-all"
            required
            disabled={isLoading}
          />

          <input 
            type="text" 
            placeholder="NIP (Nomor Induk Pegawai)" 
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-semibold placeholder-slate-400 outline-none focus:ring-4 focus:ring-pink-500/30 transition-all"
            required
            disabled={isLoading}
          />

          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-semibold placeholder-slate-400 outline-none focus:ring-4 focus:ring-pink-500/30 transition-all"
            required
            disabled={isLoading}
          />

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full bg-black text-white font-bold text-lg rounded-full py-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/20 disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium mb-1">Testing Credentials:</p>
          <code className="text-xs text-pink-500 bg-pink-50 px-2 py-1 rounded-lg">bk@sekolah.id | 19800101 | admin</code>
        </div>
      </div>
    </div>
  );
}