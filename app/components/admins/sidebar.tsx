'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageCircleQuestion, 
  MessageSquareWarning, 
  Tags, 
  ShieldCheck,
  X
} from 'lucide-react';

// PERBAIKAN: Menambahkan prefix '/admin' pada setiap path agar mengarah ke URL yang benar
const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Konsultasi', path: '/admin/consultations', icon: MessageCircleQuestion },
  { name: 'Keluhan', path: '/admin/complaints', icon: MessageSquareWarning },
  { name: 'Kategori', path: '/admin/categories', icon: Tags },
];

interface SidebarContentProps {
  onClose?: () => void;
}

export default function SidebarContent({ onClose }: SidebarContentProps) {
  // usePathname akan membaca URL saat ini, misal: '/admin/dashboard'
  const pathname = usePathname();

  return (
    <>
      {/* Bagian Logo */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#1BA0E2] font-bold text-xl tracking-tight">
          <ShieldCheck className="w-7 h-7" />
          Whispr.
        </div>
        {/* Tombol Tutup untuk Mobile */}
        {onClose && (
          <button 
            className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors" 
            onClick={onClose}
            title="Tutup Menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Bagian List Menu */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Menu Utama
        </p>
        
        {navItems.map((item) => {
          // INDIKATOR AKTIF: Mengecek apakah URL saat ini berawalan dengan path dari item menu
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-[#1BA0E2] text-white shadow-md' // Style jika menu aktif
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Style jika menu tidak aktif
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </>
  );
}