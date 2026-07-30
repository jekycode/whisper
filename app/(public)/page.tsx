import { Home, Inbox, MessageSquare, ShieldAlert, LogOut } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc] text-slate-800 font-sans">
      {/* SIDEBAR LEFT */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between p-6">
        <div>
          {/* Logo & Subtitle */}
          <div className="mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Whisper
            </h1>
            <p className="text-[10px] font-bold tracking-wider text-pink-500 uppercase mt-0.5">
              Bimbingan Konseling
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-2">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium shadow-md shadow-pink-200 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-medium transition-all"
            >
              <Inbox className="w-5 h-5" />
              <span>Inbox</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-medium transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Consultations</span>
            </a>
          </nav>
        </div>

        {/* Logout Bottom */}
        <button className="flex items-center gap-3 px-2 py-3 text-slate-500 hover:text-rose-600 font-medium transition-all">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
            N
          </div>
          <span className="flex items-center gap-2 text-sm">
            Logout Account
          </span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col">
        {/* HEADER TOP BAR */}
        <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Dashboard Overview
          </h2>

          {/* Profile Guru BK */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Bapak/Ibu Guru</p>
              <p className="text-[10px] text-slate-400">NIP: 19800101</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-400 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              BK
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Selamat Datang di Whisper!
            </h3>
            <p className="text-slate-400 text-sm">
              Pantau pesan anonim dari siswa dan kelola sesi konsultasi langsung dari dashboard ini.
            </p>
          </div>

          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Pesan Anonim Baru */}
            <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-6 text-white shadow-xl shadow-pink-500/20 flex flex-col justify-between h-40">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                <ShieldAlert className="w-5 h-5" />
                <span>Pesan Anonim Baru</span>
              </div>
              <span className="text-5xl font-extrabold tracking-tight">12</span>

              {/* Watermark Icon Background */}
              <ShieldAlert className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none" />
            </div>

            {/* Card 2: Permintaan Konsultasi */}
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/20 flex flex-col justify-between h-40">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90">
                <MessageSquare className="w-5 h-5" />
                <span>Permintaan Konsultasi</span>
              </div>
              <span className="text-5xl font-extrabold tracking-tight">4</span>

              {/* Watermark Icon Background */}
              <MessageSquare className="absolute -right-4 -bottom-4 w-32 h-32 opacity-15 pointer-events-none" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}