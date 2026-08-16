'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Send, ShieldCheck, KeyRound } from 'lucide-react';
import { checkConsultationToken, submitConsultationReply } from '@/app/actions/consultations';
import type { Category } from '@/app/actions/categories';

type ConsultationStatus = 'baru' | 'diproses' | 'selesai';

interface ThreadMessage {
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
}

interface ConsultationData {
  id: string;
  status: ConsultationStatus;
  category_ids: string[];
  created_at: string;
  messages: ThreadMessage[];
}

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  baru: 'Menunggu Balasan',
  diproses: 'Sedang Didampingi',
  selesai: 'Sesi Selesai',
};

const STATUS_COLOR: Record<ConsultationStatus, string> = {
  baru: 'bg-blue-50 text-blue-600 border-blue-200',
  diproses: 'bg-amber-50 text-amber-600 border-amber-200',
  selesai: 'bg-green-50 text-green-600 border-green-200',
};

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari lalu`;
}

interface ChatClientProps {
  token: string;
  initialData: ConsultationData;
  categories: Category[];
}

const POLL_INTERVAL_MS = 20000;

export default function ChatClient({ token, initialData, categories }: ChatClientProps) {
  const [data, setData] = useState<ConsultationData>(initialData);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const refreshSilently = useCallback(async () => {
    try {
      const fresh = await checkConsultationToken(token);
      setData(fresh as ConsultationData);
    } catch {
      // Abaikan error agar user tidak terganggu
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(refreshSilently, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshSilently]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages.length]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      await submitConsultationReply(token, replyText);
      setReplyText('');
      await refreshSilently();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal mengirim pesan.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const categoryNames = (data.category_ids || [])
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    // Menggunakan h-[100dvh] agar menyesuaikan viewport mobile secara akurat
    <div className="h-[100dvh] w-full flex flex-col bg-[#fafafa] overflow-hidden">
      
      {/* ==========================================
          HEADER AREA
          ========================================== */}
      <header className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 bg-white shrink-0 z-10 shadow-sm">
        <Link
          href="/konsultasi/cek"
          title="Kembali"
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h1 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5 truncate">
              <KeyRound className="w-4 h-4 text-gray-400 shrink-0" /> {token}
            </h1>
            <span className={`shrink-0 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLOR[data.status]}`}>
              {STATUS_LABEL[data.status]}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">
            {categoryNames.length > 0 ? `${categoryNames.join(', ')} • ` : ''}
            Dikirim {formatRelativeTime(data.created_at)}
          </p>
        </div>
      </header>

      {/* ==========================================
          CHAT MESSAGES AREA
          ========================================== */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {data.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <ShieldCheck className="w-10 h-10 text-gray-300" />
            <p className="text-center text-xs sm:text-sm">Ruang aman dan rahasia.<br/>Tunggu balasan dari konselor ya.</p>
          </div>
        ) : (
          data.messages.map((m, i) => {
            const isUser = m.sender_type === 'user';
            return (
              <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    isUser
                      ? 'bg-[#1BA0E2] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {!isUser && (
                    <p className="text-[11px] font-bold text-[#1BA0E2] mb-1 flex items-center gap-1 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> Konselor
                    </p>
                  )}
                  <p>{m.message}</p>
                  <p className={`text-[10px] mt-1.5 text-right ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* ==========================================
          COMPOSER (INPUT FIELD) AREA
          ========================================== */}
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shrink-0 flex items-end gap-2 sm:gap-3 pb-safe">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Tulis balasan di sini..."
          rows={1}
          disabled={isSendingReply}
          onKeyDown={(e) => {
            // Mengizinkan Shift+Enter untuk baris baru di Desktop, Enter untuk kirim
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendReply();
            }
          }}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2] transition-all disabled:opacity-50 max-h-32"
        />
        <button
          onClick={handleSendReply}
          disabled={isSendingReply || !replyText.trim()}
          title="Kirim Pesan"
          className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#1BA0E2] text-white shadow-sm hover:bg-[#1588c2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
        >
          {isSendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
        </button>
      </div>
      
    </div>
  );
}