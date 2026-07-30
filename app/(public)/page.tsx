import React from "react";
import Link from "next/link";

export default function PublicHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 text-center relative overflow-hidden">
      
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 drop-shadow-md leading-tight">
          send me <br /> anonymous messages!
        </h1>
        
        <Link href="/login">
          <button className="bg-white rounded-full px-10 py-5 shadow-2xl hover:scale-[1.03] active:scale-95 transition-all duration-200">
            <span className="text-xl md:text-2xl font-black text-slate-900">
              Admin Login
            </span>
          </button>
        </Link>
      </div>

      <div className="absolute bottom-8 text-white/80 font-medium text-sm z-10">
        Powered by Whisper
      </div>
    </main>
  );
}