'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, UserCircle, LogOut } from 'lucide-react';
import { supabase } from '@/app/lib/supabase'; // Pastikan path ini sesuai dengan struktur Anda

interface AdminHeaderProps {
  onOpenMenu: () => void;
}

export default function AdminHeader({ onOpenMenu }: AdminHeaderProps) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>('Memuat...');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminEmail(user?.email || 'Admin');
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Arahkan ke URL login Anda sesuai struktur
    router.push('/login'); 
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger untuk Mobile */}
        <button 
          onClick={onOpenMenu} 
          className="md:hidden p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="hidden md:block font-bold text-gray-800 text-lg">
          Portal Admin
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Info User */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <UserCircle className="w-5 h-5 text-gray-400" />
          <span className="hidden sm:inline">{adminEmail}</span>
        </div>
        
        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
        
        {/* Tombol Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}