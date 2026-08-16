'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Search, MessageCircleQuestion } from 'lucide-react';
import { getAdminConsultations, getConsultationMessages, replyToConsultation } from '@/app/actions/admin';

// ==========================================
// DEFINISI TIPE DATA (Strict TypeScript)
// ==========================================
interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface CategoryRelation {
  categories: Category | Category[] | null;
}

interface Consultation {
  id: string;
  token: string;
  email: string;
  status: 'baru' | 'diproses' | 'selesai';
  created_at: string;
  consultation_categories?: CategoryRelation[];
}

interface Message {
  id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
}

// Fungsi Pembantu untuk mengekstrak kategori dari relasi Supabase secara aman
function extractCategories(relations?: CategoryRelation[]): Category[] {
  if (!relations) return [];
  const result: Category[] = [];
  relations.forEach((rel) => {
    if (!rel.categories) return;
    const cats = Array.isArray(rel.categories) ? rel.categories : [rel.categories];
    result.push(...cats);
  });
  return result;
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAdminConsultations().then((data) => {
      setConsultations(data as unknown as Consultation[]);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedItem) {
      getConsultationMessages(selectedItem.id).then((msgs) => {
        setMessages(msgs as unknown as Message[]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
    }
  }, [selectedItem]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedItem) return;
    setIsSending(true);
    try {
      await replyToConsultation(selectedItem.id, replyText);
      setReplyText('');
      const msgs = await getConsultationMessages(selectedItem.id);
      setMessages(msgs as unknown as Message[]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      
      setConsultations(prev => prev.map(c => c.id === selectedItem.id ? { ...c, status: 'diproses' } : c));
      setSelectedItem(prev => prev ? { ...prev, status: 'diproses' } : null);
    } catch (error) {
      alert("Gagal mengirim balasan.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* ==========================================
          KIRI: DAFTAR KONSULTASI
          ========================================== */}
      <div className="w-full md:w-1/3 flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input type="text" placeholder="Cari Tiket..." className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></div>
          ) : (
            consultations.map((item) => {
              const itemCategories = extractCategories(item.consultation_categories);
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedItem?.id === item.id ? 'bg-blue-50 border-l-4 border-l-[#1BA0E2]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm">Tiket: {item.token}</h4>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-2">{item.email}</p>
                  
                  {/* BADGES AREA: Kategori & Status */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'baru' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {item.status.toUpperCase()}
                    </span>
                    {itemCategories.map(cat => (
                      <span key={cat.id} className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: cat.color || '#94a3b8' }}>
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==========================================
          KANAN: AREA CHAT
          ========================================== */}
      <div className="hidden md:flex flex-1 flex-col bg-[#EFEAE2]">
        {!selectedItem ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageCircleQuestion className="w-16 h-16 mb-4 text-gray-300" />
            <p>Pilih tiket konsultasi untuk mulai membalas.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div>
                <h2 className="font-bold text-gray-800">Tiket: {selectedItem.token}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{selectedItem.email}</p>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex gap-1">
                    {extractCategories(selectedItem.consultation_categories).map(cat => (
                      <span key={cat.id} className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: cat.color || '#94a3b8' }}>
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isAdmin = msg.sender_type === 'admin';
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm text-sm ${isAdmin ? 'bg-[#1BA0E2] text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <div className={`text-[10px] mt-1 text-right ${isAdmin ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <form onSubmit={handleReply} className="flex gap-2 max-w-4xl mx-auto">
                <textarea 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ketik balasan untuk siswa..."
                  className="flex-1 resize-none h-12 rounded-full px-4 py-3 border focus:outline-none focus:border-[#1BA0E2] text-sm bg-white shadow-sm"
                />
                <button type="submit" disabled={isSending || !replyText.trim()} className="bg-[#1BA0E2] text-white p-3.5 rounded-full hover:bg-[#1588c2] disabled:opacity-50 transition-colors shadow-sm">
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}