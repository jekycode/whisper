import React from "react";
import { 
  MessageSquareText, 
  ShieldAlert, 
  UserCheck, 
  TrendingUp, 
  Clock,
  ArrowRight
} from "lucide-react";

export default function DashboardHome() {
  // Dummy Data: Tren Isu Siswa
  const issueTrends = [
    { category: "Kecemasan Akademik", percentage: 75, color: "bg-blue-500" },
    { category: "Masalah Pertemanan", percentage: 60, color: "bg-purple-500" },
    { category: "Perundungan (Bullying)", percentage: 30, color: "bg-rose-500" },
    { category: "Masalah Keluarga", percentage: 45, color: "bg-orange-500" },
  ];

  // Dummy Data: Aktivitas Terbaru
  const recentActivities = [
    {
      id: 1,
      type: "anonymous",
      title: "Pesan Anonim Baru",
      desc: "Seseorang mengirimkan laporan terkait kejadian di kelas 11 IPA 2.",
      time: "10 menit yang lalu",
      icon: ShieldAlert,
      color: "text-pink-500",
      bgColor: "bg-pink-100",
    },
    {
      id: 2,
      type: "consultation",
      title: "Permintaan Konsultasi (Budi S.)",
      desc: "NISN: 0012345678 - Topik: Bimbingan Karir & Kuliah.",
      time: "1 jam yang lalu",
      icon: MessageSquareText,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
    {
      id: 3,
      type: "resolved",
      title: "Sesi Selesai (Siti A.)",
      desc: "Konsultasi tatap muka selesai dan ditandai sebagai 'Terselesaikan'.",
      time: "Kemarin, 14:30",
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      
      {/* Welcome Header */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Dashboard Statistik BK</h2>
          <p className="text-slate-500 font-medium">
            Pantau kondisi emosional siswa dan kelola jadwal bimbingan Anda hari ini.
          </p>
        </div>
        <div className="bg-slate-100 px-5 py-3 rounded-2xl flex items-center gap-3">
          <Clock size={20} className="text-slate-500" />
          <span className="font-bold text-slate-700">Periode: Juli 2026</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <div className="bg-gradient-to-br from-pink-500 to-rose-400 p-6 rounded-[32px] text-white shadow-xl shadow-pink-500/20 relative overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] transition-transform">
          <div className="relative z-10 flex justify-between items-start">
            <h3 className="text-lg font-bold opacity-90 leading-tight">Pesan Anonim<br/>Belum Dibaca</h3>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><ShieldAlert size={24} /></div>
          </div>
          <div className="relative z-10 flex items-baseline gap-2">
            <p className="text-6xl font-black">12</p>
            <span className="font-semibold text-pink-100">+3 hari ini</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-amber-400 p-6 rounded-[32px] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] transition-transform">
          <div className="relative z-10 flex justify-between items-start">
            <h3 className="text-lg font-bold opacity-90 leading-tight">Menunggu<br/>Konsultasi</h3>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><MessageSquareText size={24} /></div>
          </div>
          <div className="relative z-10 flex items-baseline gap-2">
            <p className="text-6xl font-black">4</p>
            <span className="font-semibold text-orange-100">Menunggu jadwal</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-400 to-teal-400 p-6 rounded-[32px] text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] transition-transform">
          <div className="relative z-10 flex justify-between items-start">
            <h3 className="text-lg font-bold opacity-90 leading-tight">Sesi Konsultasi<br/>Selesai</h3>
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><UserCheck size={24} /></div>
          </div>
          <div className="relative z-10 flex items-baseline gap-2">
            <p className="text-6xl font-black">28</p>
            <span className="font-semibold text-emerald-100">Bulan ini</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-700 leading-tight">Tingkat Respons<br/>Pesan</h3>
            <div className="bg-blue-100 text-blue-500 p-2 rounded-xl"><TrendingUp size={24} /></div>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 mb-1">85<span className="text-2xl text-slate-400">%</span></p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Trend Kategori Isu */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900">Tren Isu Siswa</h3>
          </div>
          <p className="text-sm font-semibold text-slate-500 mb-6">Berdasarkan klasifikasi pesan anonim dan konsultasi bulan ini.</p>
          
          <div className="space-y-6">
            {issueTrends.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>{item.category}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className={`${item.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900">Aktivitas Terbaru</h3>
            <button className="text-pink-500 font-bold text-sm hover:text-pink-600 flex items-center gap-1">
              Lihat Semua <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex items-start gap-4 bg-slate-50/50 hover:bg-white cursor-pointer">
                <div className={`p-3 rounded-2xl ${activity.bgColor} ${activity.color} shrink-0`}>
                  <activity.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-slate-900 truncate">{activity.title}</h4>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 line-clamp-2">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}