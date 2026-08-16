'use client';

import { useState, useEffect } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  MessageSquareWarning, 
  MessageCircleQuestion, 
  Activity
} from 'lucide-react';
import { getDashboardStats, type DashboardStatsData } from '@/app/actions/admin';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#1BA0E2]" />
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-red-500">Gagal memuat data statistik.</div>;

  // Mencari nilai tertinggi untuk menghitung persentase visual bar
  const maxCategoryCount = stats.topCategories.length > 0 ? stats.topCategories[0].count : 1;

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50 font-sans">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ikhtisar Bimbingan Konseling</h1>
        <p className="text-sm text-gray-500 mt-1">Pantau kondisi psikologis dan keresahan siswa secara real-time.</p>
      </div>

      {/* 4 CARDS: RINGKASAN STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Keseluruhan */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Laporan Masuk</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.totalTickets}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-[#1BA0E2] rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Butuh Atensi (Baru) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Butuh Atensi (Baru)</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.statusBaru}</h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Sedang Diproses */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Sedang Didampingi</p>
            <h3 className="text-3xl font-bold text-yellow-600">{stats.statusDiproses}</h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Selesai */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Kasus Selesai</p>
            <h3 className="text-3xl font-bold text-green-600">{stats.statusSelesai}</h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* BAGIAN BAWAH: CHARTS & AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (Lebar 2/3): TOP KATEGORI & SUMBER */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Top Kategori */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ce8160]" />
                Top Kategori Masalah Siswa
              </h3>
            </div>
            
            {stats.topCategories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Belum ada data kategori terkumpul.</p>
            ) : (
              <div className="space-y-5">
                {stats.topCategories.map((cat, index) => {
                  const percentage = Math.round((cat.count / maxCategoryCount) * 100);
                  return (
                    <div key={index} className="relative">
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-gray-700">{cat.name}</span>
                        <span className="text-gray-500">{cat.count} Laporan</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: cat.color || '#1BA0E2' // Fallback color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card Perbandingan Sumber Laporan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Keluhan Anonim</p>
                <h4 className="text-2xl font-bold text-gray-800">{stats.totalKeluhan}</h4>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <MessageCircleQuestion className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tiket Konsultasi</p>
                <h4 className="text-2xl font-bold text-gray-800">{stats.totalKonsultasi}</h4>
              </div>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (Lebar 1/3): AKTIVITAS TERBARU */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              Aktivitas Terbaru
            </h3>

            {stats.recentActivities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Belum ada aktivitas masuk.</p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="mt-1">
                      {activity.type === 'Keluhan' ? (
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {activity.type}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(activity.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium line-clamp-2">
                        {activity.preview}
                      </p>
                      <div className="mt-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          activity.status === 'baru' ? 'bg-red-100 text-red-600' : 
                          activity.status === 'diproses' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {activity.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}