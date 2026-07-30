import React from "react";

export default function InboxPage() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">🤫</span>
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">Inbox Pesan Anonim</h2>
      <p className="text-slate-500 font-medium max-w-md">
        Pesan rahasia dari siswa akan muncul di sini. Integrasikan dengan database untuk melihat data sebenarnya.
      </p>
    </div>
  );
}