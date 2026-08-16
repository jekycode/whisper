import Link from 'next/link';
import { LogIn, KeyRound, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 bg-transparent">

      {/* Kiri: Text Logo Whispr */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold text-gray-900 tracking-tight z-10">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#1BA0E2]" />
        Whispr.
      </div>

      {/* Kanan: Link Cek Balesan & Tombol Login */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

        {/* Cek Balesan: teks yang bisa diklik, arahkan ke halaman cek kode tersendiri */}
        <Link
          href="/konsultasi/cek"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#1BA0E2] transition-colors px-2 py-2 md:px-3 rounded-full hover:bg-blue-50"
          title="Cek Balesan Konsultasi"
        >
          <KeyRound className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Cek Balesan</span>
        </Link>

        {/* Garis Pembatas (Hanya Desktop) */}
        <div className="hidden md:block w-px h-6 bg-gray-200"></div>

        {/* Login Button: Mobile (Ikon Bulat), Desktop (Pill dengan Teks) */}
        <Link
          href="/admin/login"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all border border-gray-200 rounded-full p-2 md:px-4 md:py-2 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300"
          title="Admin Login"
        >
          <LogIn className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:inline">Admin Login</span>
        </Link>

      </div>
    </header>
  );
}