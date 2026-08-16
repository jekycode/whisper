'use client';

import { useState } from 'react';
import SidebarContent from '@/app/components/admins/sidebar';
import AdminHeader from '@/app/components/admins/topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // State untuk mengontrol Sidebar di tampilan Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. Sidebar Desktop (Selalu Tampil di Layar >= md) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 z-20">
        <SidebarContent />
      </aside>

      {/* 2. Sidebar Mobile Overlay (Muncul Saat Tombol Hamburger Diklik) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop Gelap (Klik di luar sidebar untuk menutup) */}
          <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Panel Sidebar */}
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left">
            <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* 3. Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Atas */}
        <AdminHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
        
        {/* Konten Halaman (Ter-render di sini) */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  );
}