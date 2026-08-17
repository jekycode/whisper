"use server";

import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Fungsi helper untuk inisialisasi Supabase secara lokal (Lazy Initialization)
// Fallback string mencegah error saat Next.js mengevaluasi modul di tahap build
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return createClient(supabaseUrl, supabaseKey);
}

interface ConsultationPayload {
  message: string;
  categoryIds?: string[];
  email: string;
}

function generateShortToken(): string {
  return randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

export async function submitConsultationTicket(payload: ConsultationPayload) {
  // Panggil client di dalam fungsi
  const supabase = getSupabaseClient();

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

  const { error: consultErr } = await supabase
    .from('consultations')
    .insert([{ id: consultationId, token, email }]);

  if (consultErr) {
    console.error('[Consultations Action] Error creating ticket:', consultErr.message);
    throw new Error('Gagal membuat tiket konsultasi. Silakan coba lagi.');
  }

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
  // Panggil client di dalam fungsi
  const supabase = getSupabaseClient();

  if (!token) throw new Error('Token tidak boleh kosong.');

  const cleanToken = token.trim().toUpperCase();

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

  const { data: messagesData, error: msgErr } = await supabase.rpc('get_consultation_messages_by_token', {
    p_token: cleanToken,
  });

  if (msgErr) {
    console.error('[Consultations Action] Error fetching messages:', msgErr.message);
  }

  return {
    ...consultationDetail,
    messages: messagesData || []
  };
}

export async function submitConsultationReply(token: string, message: string) {
  // Panggil client di dalam fungsi
  const supabase = getSupabaseClient();

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