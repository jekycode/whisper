import Link from 'next/link';
import { LogIn, Search, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 sm:px-6 md:px-8 bg-transparent">
      
      {/* Kiri: Text Logo Whispr */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold text-gray-900 tracking-tight z-10">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#1BA0E2]" />
        Whispr.
      </div>

      {/* Kanan: Input Code Consultation & Button Login */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        
        {/* Search Bar: Sembunyi di mobile (hidden), muncul di tablet/desktop (md:block) */}
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Cek kode tiket..." 
            className="border border-gray-200 rounded-full pl-4 pr-10 py-2 text-sm w-56 lg:w-64 focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2] transition-all bg-white shadow-sm placeholder:text-gray-400" 
          />
          <button className="absolute right-3 top-2.5 text-gray-400 hover:text-[#1BA0E2] transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search Icon Khusus Mobile (opsional sebagai fallback jika input disembunyikan) */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:text-[#1BA0E2] hover:bg-gray-100 rounded-full transition-colors"
          title="Cari tiket"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Garis Pembatas (Hanya Desktop) */}
        <div className="hidden md:block w-px h-6 bg-gray-200"></div>

        {/* Login Button: Mobile (Ikon Bulat), Desktop (Pill dengan Teks) */}
        <Link 
          href="/login" 
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