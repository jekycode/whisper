"use server";

import { randomUUID } from 'crypto';
import { supabase } from '@/app/lib/supabase';

interface ComplaintPayload {
  message: string;
  categoryIds?: string[];
}

export async function submitAnonymousComplaint(payload: ComplaintPayload) {
  const message = payload.message?.trim();

  if (!message) {
    throw new Error('Pesan keluhan tidak boleh kosong.');
  }

  // Generate id di sisi server, supaya kita TIDAK perlu .select() balik ke
  // tabel `complaints` setelah insert. RLS sengaja tidak mengizinkan anon
  // membaca tabel ini sama sekali (lihat kebijakan complaints_admin_select),
  // jadi `.insert().select().single()` akan selalu gagal untuk user anonim
  // meskipun datanya sebenarnya berhasil tersimpan.
  const complaintId = randomUUID();

  const { error: complaintErr } = await supabase
    .from('complaints')
    .insert([{ id: complaintId, message }]);

  if (complaintErr) {
    console.error('[Complaints Action] Error submitting complaint:', complaintErr.message);
    throw new Error('Gagal mengirim keluhan. Silakan coba beberapa saat lagi.');
  }

  // Insert relasi kategori (0 atau lebih), kategori bersifat opsional
  const categoryIds = Array.from(new Set(payload.categoryIds ?? [])).filter(Boolean);

  if (categoryIds.length > 0) {
    const rows = categoryIds.map((categoryId) => ({
      complaint_id: complaintId,
      category_id: categoryId,
    }));

    const { error: categoryErr } = await supabase
      .from('complaint_categories')
      .insert(rows);

    if (categoryErr) {
      // Keluhan sudah berhasil tersimpan; kegagalan menyimpan kategori tidak
      // dianggap fatal (kategori memang opsional), tapi tetap dicatat di log.
      console.error('[Complaints Action] Error attaching categories:', categoryErr.message);
    }
  }

  return { success: true };
}