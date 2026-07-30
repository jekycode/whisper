"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Inbox, MessageSquareText, LogOut, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Inbox", icon: Inbox, path: "/dashboard/inbox" },
    { name: "Consultations", icon: MessageSquareText, path: "/dashboard/consultations" },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    const segment = pathname.split("/").pop();
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Whisper</h2>
            <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mt-1">Bimbingan Konseling</p>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link href={item.path} key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/20" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}>
                  <item.icon size={20} className={isActive ? "text-white" : "text-slate-400"} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={20} className="text-slate-400" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen w-full">
        
        {/* App Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 py-1.5 px-2 md:px-3 md:py-2 rounded-full border border-slate-200">
            <div className="text-right hidden sm:block mr-1">
              <p className="text-sm font-bold text-slate-900 leading-tight">Bapak/Ibu Guru</p>
              <p className="text-xs font-semibold text-slate-500">NIP: 19800101</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
              BK
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}