"use server";

import { randomUUID } from 'crypto';
import { supabase } from '@/app/lib/supabase';
import { createClient } from "@/app/lib/supabase-server";

interface ConsultationPayload {
  message: string;
  categoryIds?: string[];
  email: string;
}

// Format token sama seperti default DB (generate_short_token): 8 karakter
// hex uppercase. Kita generate di sini supaya tidak perlu .select() balik
// ke tabel `consultations` setelah insert (RLS tidak mengizinkan anon
// membaca tabel ini sama sekali, hanya insert).
function generateShortToken(): string {
  return randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

export async function submitConsultationTicket(payload: ConsultationPayload) {
  const message = payload.message?.trim();
  const email = payload.email?.trim();

  if (!message) {
    throw new Error('Pesan konsultasi tidak boleh kosong.');
  }

  if (!email || !email.includes('@')) {
    throw new Error('Alamat email tidak valid.');
  }

  const consultationId = randomUUID();
  const token = generateShortToken();

  // 1. Insert ke tabel consultations dengan id & token yang sudah kita
  //    tentukan sendiri (bukan mengandalkan default DB), supaya tidak perlu
  //    baca balik baris yang baru diinsert.
  const { error: consultErr } = await supabase
    .from('consultations')
    .insert([{ id: consultationId, token, email }]);

  if (consultErr) {
    console.error('[Consultations Action] Error creating ticket:', consultErr.message);
    throw new Error('Gagal membuat tiket konsultasi. Silakan coba lagi.');
  }

  // 2. Insert relasi kategori (0 atau lebih), kategori bersifat opsional
  const categoryIds = Array.from(new Set(payload.categoryIds ?? [])).filter(Boolean);

  if (categoryIds.length > 0) {
    const rows = categoryIds.map((categoryId) => ({
      consultation_id: consultationId,
      category_id: categoryId,
    }));

    const { error: categoryErr } = await supabase
      .from('consultation_categories')
      .insert(rows);

    if (categoryErr) {
      console.error('[Consultations Action] Error attaching categories:', categoryErr.message);
    }
  }

  // 3. Insert pesan pertama lewat RPC add_consultation_reply
  //    (RLS membatasi anon insert langsung ke consultation_messages)
  const { error: rpcErr } = await supabase.rpc('add_consultation_reply', {
    p_token: token,
    p_message: message,
  });

  if (rpcErr) {
    console.error('[Consultations Action] Error saving initial message:', rpcErr.message);
    throw new Error('Tiket berhasil dibuat, tetapi gagal menyimpan pesan pertama.');
  }

  return { success: true, token };
}

export async function checkConsultationToken(token: string) {
  if (!token) throw new Error('Token tidak boleh kosong.');

  const cleanToken = token.trim().toUpperCase();

  // 1. Validasi token dan ambil detail tiket konsultasi
  const { data: consultData, error: consultErr } = await supabase.rpc('get_consultation_by_token', {
    p_token: cleanToken,
  });

  if (consultErr) {
    console.error('[Consultations Action] Error checking token:', consultErr.message);
    throw new Error('Terjadi kesalahan saat memeriksa kode tiket.');
  }

  if (!consultData || consultData.length === 0) {
    throw new Error('Kode tiket tidak ditemukan atau tidak valid.');
  }

  const consultationDetail = consultData[0];

  // 2. Ambil riwayat chat/pesan menggunakan RPC baru
  const { data: messagesData, error: msgErr } = await supabase.rpc('get_consultation_messages_by_token', {
    p_token: cleanToken,
  });

  if (msgErr) {
    console.error('[Consultations Action] Error fetching messages:', msgErr.message);
    // Kita tidak melempar error di sini, cukup biarkan history kosong jika gagal muat pesan,
    // agar siswa tetap bisa masuk ke halaman chat.
  }

  // 3. Gabungkan detail konsultasi dengan riwayat pesannya
  return {
    ...consultationDetail,
    messages: messagesData || []
  };
}

export async function submitConsultationReply(token: string, message: string) {
  const trimmed = message?.trim();
 
  if (!token?.trim()) {
    throw new Error('Kode tidak boleh kosong.');
  }
  if (!trimmed) {
    throw new Error('Pesan tidak boleh kosong.');
  }
 
  const { error } = await supabase.rpc('add_consultation_reply', {
    p_token: token.trim(),
    p_message: trimmed,
  });
 
  if (error) {
    console.error('[Consultations Action] Error sending reply:', error.message);
    throw new Error('Gagal mengirim pesan. Coba lagi ya.');
  }
 
  return { success: true };
}