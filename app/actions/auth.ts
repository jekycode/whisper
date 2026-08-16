"use server";

import { createClient } from '@/app/lib/supabase-server';

export async function loginAdmin(email: string, pass: string) {
  if (!email || !pass) {
    throw new Error('Email dan password wajib diisi.');
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    console.error('[Auth Action] Login failed:', error.message);
    throw new Error('Kredensial tidak valid atau akun tidak ditemukan.');
  }

  return { success: true };
}