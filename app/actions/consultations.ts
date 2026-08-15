"use server";

import { randomUUID } from 'crypto';
import { supabase } from '@/app/lib/supabase';

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

// Untuk fitur "Cek Kode Tiket" di halaman utama.
// Mengembalikan `category_ids: string[]` (array), bukan `category_id` tunggal.
export async function checkConsultationToken(token: string) {
  if (!token) throw new Error('Token tidak boleh kosong.');

  const { data, error } = await supabase.rpc('get_consultation_by_token', {
    p_token: token,
  });

  if (error) {
    console.error('[Consultations Action] Error checking token:', error.message);
    throw new Error('Terjadi kesalahan saat memeriksa token.');
  }

  if (!data || data.length === 0) {
    throw new Error('Token tidak ditemukan atau tidak valid.');
  }

  return data[0];
}