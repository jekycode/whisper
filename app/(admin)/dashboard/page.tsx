import React from "react";
import { MessageSquareText, ShieldAlert } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Selamat Datang di Whisper!</h2>
        <p className="text-slate-500 font-medium">
          Pantau pesan anonim dari siswa dan kelola sesi konsultasi langsung dari dashboard ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-8 rounded-[32px] text-white shadow-xl shadow-pink-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold opacity-90 mb-2 flex items-center gap-2">
              <ShieldAlert size={20} />
              Pesan Anonim Baru
            </h3>
            <p className="text-6xl font-black">12</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <ShieldAlert size={160} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-amber-400 p-8 rounded-[32px] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-bold opacity-90 mb-2 flex items-center gap-2">
              <MessageSquareText size={20} />
              Permintaan Konsultasi
            </h3>
            <p className="text-6xl font-black">4</p>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-20">
            <MessageSquareText size={160} />
          </div>
        </div>
      </div>
    </div>
  );
}