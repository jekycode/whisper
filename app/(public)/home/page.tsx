'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, Send, Sparkles, Mail, ArrowRight, Loader2, CheckCircle2, X, Image as ImageIcon, MessageCircle, HeartHandshake, KeyRound } from 'lucide-react';
import { getActiveCategories, type Category } from '@/app/actions/categories';
import { submitAnonymousComplaint } from '@/app/actions/complaints';
import { submitConsultationTicket } from '@/app/actions/consultations';

// Textarea tumbuh otomatis mulai dari 3 baris, maksimal 10 baris sebelum scroll
const TEXTAREA_MIN_ROWS = 3;
const TEXTAREA_MAX_ROWS = 10;

export default function HomePage() {
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);

  // Form States
  const [mode, setMode] = useState<'complaint' | 'consultation'>('complaint');
  const [complaintText, setComplaintText] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  // File Upload State & Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Textarea auto-resize ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // UI & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ isSuccess: boolean; token?: string } | null>(null);

  // Dialog State (pilihan kategori/perasaan sebelum benar-benar mengirim)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Ambil daftar kategori dari database
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getActiveCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      } finally {
        setIsLoadingCats(false);
      }
    };
    fetchCats();
  }, []);

  const filteredCategories = categories.filter(c => c.applies_to === 'both' || c.applies_to === mode);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((categoryId) => categoryId !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Formatnya nggak didukung. Cuma boleh foto (JPG, PNG, dll).');
        return;
      }
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Auto-resize textarea: mulai 3 baris, tumbuh sampai maksimal 10 baris ---
  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const computed = window.getComputedStyle(el);
    const lineHeight = parseFloat(computed.lineHeight || '24');
    const paddingTop = parseFloat(computed.paddingTop || '0');
    const paddingBottom = parseFloat(computed.paddingBottom || '0');
    const verticalPadding = paddingTop + paddingBottom;

    const minHeight = lineHeight * TEXTAREA_MIN_ROWS + verticalPadding;
    const maxHeight = lineHeight * TEXTAREA_MAX_ROWS + verticalPadding;

    const nextHeight = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustTextareaHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintText]);

  // --- Validasi form ---
  const isEmailValid = email.trim().includes('@') && email.trim().includes('.');
  const isMessageFilled = complaintText.trim().length > 0;
  const isFormValid = mode === 'complaint' ? isMessageFilled : isMessageFilled && isEmailValid;

  const handleOpenCategoryDialog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setShowCategoryDialog(true);
  };

  const handleFinalSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setSuccessData(null);

    try {
      if (mode === 'complaint') {
        await submitAnonymousComplaint({
          message: complaintText,
          categoryIds: selectedCategoryIds,
        });
        setSuccessData({ isSuccess: true });
      } else {
        const res = await submitConsultationTicket({
          message: complaintText,
          categoryIds: selectedCategoryIds,
          email
        });
        setSuccessData({ isSuccess: true, token: res.token });
      }

      setShowCategoryDialog(false);
      setComplaintText('');
      setEmail('');
      setSelectedCategoryIds([]);
      removeImage();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Waduh, ada masalah: " + error.message);
      } else {
        alert("Waduh, ada yang error nih. Coba lagi ya.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const modeCardClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200 ${
      active
        ? 'border-[#1BA0E2] bg-blue-50 text-[#1BA0E2] shadow-sm'
        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
    }`;

  const modeIconWrapClass = (active: boolean) =>
    `w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
      active ? 'bg-[#1BA0E2] text-white' : 'bg-gray-100 text-gray-400'
    }`;

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 w-full max-w-4xl mx-auto md:py-16 relative">

      {/* 1. SUCCESS OVERLAY POPUP */}
      {successData?.isSuccess && (
        <div className="absolute top-4 left-4 right-4 md:left-auto md:right-auto md:w-full max-w-md z-50 bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-lg animate-in fade-in slide-in-from-top-10 mb-8 mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Ceritamu Udah Nyampe! 🎉</h3>
          {successData.token ? (
            <div className="text-gray-600">
              <p className="mb-3 text-sm">Ini kode buat cek balesan kamu nanti. Simpan baik-baik ya:</p>
              <div className="inline-block bg-white border-2 border-green-300 rounded-lg px-6 py-2 text-2xl font-mono font-bold text-green-700 tracking-widest shadow-sm select-all">
                {successData.token}
              </div>
              <p className="text-xs mt-3 text-gray-500">(Kodenya juga udah dikirim ke emailmu)</p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Ceritamu udah aman kesimpen, nggak ada jejak sama sekali.</p>
          )}
          <button onClick={() => setSuccessData(null)} className="mt-5 px-4 py-2 bg-green-100 text-sm font-semibold text-green-700 rounded-full hover:bg-green-200 transition-colors">Oke, Paham!</button>
        </div>
      )}

      {/* 2. HEADER / HERO SECTION */}
      <div className={`text-center mb-8 flex flex-col items-center space-y-3 w-full transition-opacity ${successData ? 'opacity-30' : 'opacity-100'}`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 flex items-center justify-center gap-2 sm:gap-3 tracking-tight">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#ce8160]" />
          Punya Cerita yang Pengen Diomongin?
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
          Di sini aman kok — nggak pakai nama, nggak ada yang tau ini kamu. Cerita aja sepuasnya.
        </p>
      </div>

      {/* 3. MAIN FORM AREA */}
      <div className={`w-full max-w-3xl bg-white rounded-2xl md:rounded-[2rem] border border-gray-200 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all duration-300 overflow-hidden flex flex-col ${successData ? 'opacity-30 pointer-events-none' : ''}`}>

        {/* Toggle Mode: kartu ramping, ikon kiri + judul/deskripsi kanan */}
        <div className="grid grid-cols-2 gap-2.5 p-3 sm:p-4 bg-gray-50/60 border-b border-gray-100">
          <button
            type="button"
            onClick={() => { setMode('complaint'); setSelectedCategoryIds([]); }}
            className={modeCardClass(mode === 'complaint')}
          >
            <div className={modeIconWrapClass(mode === 'complaint')}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-sm font-semibold truncate">Cerita Aja</span>
              <span className="text-[11px] opacity-70 truncate">Anonim, tanpa nama</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setMode('consultation'); setSelectedCategoryIds([]); }}
            className={modeCardClass(mode === 'consultation')}
          >
            <div className={modeIconWrapClass(mode === 'consultation')}>
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-sm font-semibold truncate">Butuh Saran</span>
              <span className="text-[11px] opacity-70 truncate">Dibalas pakai kode rahasia</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleOpenCategoryDialog} className="flex flex-col">
          <textarea
            ref={textareaRef}
            rows={TEXTAREA_MIN_ROWS}
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Tulis aja apa yang lagi kamu rasain, aku siap mendengar..."
            className="w-full resize-none bg-transparent text-gray-800 text-base md:text-lg p-5 md:p-6 placeholder-gray-300 focus:outline-none disabled:bg-gray-50 leading-relaxed"
          />

          {/* Preview Gambar */}
          {imageFile && (
            <div className="px-5 md:px-6 pb-2">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-700 max-w-[200px] truncate">{imageFile.name}</span>
                <button type="button" onClick={removeImage} className="text-blue-400 hover:text-blue-700 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input Email Inline */}
          {mode === 'consultation' && (
            <div className="px-5 md:px-6 py-3 bg-blue-50/50 border-t border-blue-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="email"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukin emailmu, nanti dikirimin kode buat cek balesan..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between p-4 md:p-5 border-t border-gray-50 bg-white">

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSubmitting}
              className="p-2.5 text-gray-400 hover:text-[#1BA0E2] hover:bg-blue-50 transition-colors rounded-full flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Tambah Foto"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:block">Tambah Foto</span>
            </button>

            {/* Tombol ini cuma buka dialog pilih kategori, belum benar-benar kirim.
                Nonaktif selama cerita (dan email, khusus mode konsultasi) belum diisi. */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              title={!isFormValid ? (mode === 'consultation' ? 'Isi ceritamu dan emailmu dulu ya' : 'Isi ceritamu dulu ya') : undefined}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-[#1BA0E2] text-white shadow-md hover:bg-[#1588c2] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              Lanjut <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>

      {/* 4. Link kecil ke halaman cek kode (dipisah dari homepage) */}
      <Link
        href="/konsultasi/cek"
        className={`mt-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1BA0E2] transition-colors ${successData ? 'opacity-30 pointer-events-none' : ''}`}
      >
        <KeyRound className="w-4 h-4" />
        Udah pernah kirim cerita? Cek balesannya di sini
      </Link>

      {/* 5. Disclaimer kecil buat situasi darurat */}
      <p className={`mt-4 text-xs text-gray-400 text-center max-w-sm ${successData ? 'opacity-30' : ''}`}>
        Kalau kamu lagi butuh bantuan cepat atau dalam bahaya, langsung cerita ke guru BK atau orang dewasa yang kamu percaya, ya.
      </p>

      {/* 6. DIALOG: PILIH PERASAAN/KATEGORI (OPSIONAL) LALU KIRIM */}
      {showCategoryDialog && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => !isSubmitting && setShowCategoryDialog(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 sm:p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ini soal apa nih?</h3>
                <p className="text-sm text-gray-400 mt-1">Boleh pilih lebih dari satu, atau skip aja nggak masalah kok.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryDialog(false)}
                disabled={isSubmitting}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0 ml-3 disabled:opacity-40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: pilihan kategori */}
            <div className="p-5 sm:p-6 overflow-y-auto">
              {isLoadingCats ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-9 w-24 bg-gray-100 animate-pulse rounded-full"></div>
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Belum ada pilihan kategori. Nggak masalah, kamu tetap bisa lanjut kirim kok.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                          isSelected
                            ? 'bg-[#1BA0E2] border-[#1BA0E2] text-white shadow-sm scale-105'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        } disabled:opacity-50`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer: tombol kirim */}
            <div className="p-5 sm:p-6 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategoryIds([])}
                disabled={isSubmitting || selectedCategoryIds.length === 0}
                className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Batal pilih
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 bg-[#1BA0E2] text-white shadow-md hover:bg-[#1588c2] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>Ngirim <Loader2 className="w-4 h-4 ml-1 animate-spin" /></>
                ) : (
                  <>Kirim, Yuk! <Send className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}