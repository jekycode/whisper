"use server";

import { supabase } from '@/app/lib/supabase';

export async function loginAdmin(email: string, pass: string) {
  if (!email || !pass) {
    throw new Error('Email dan password wajib diisi.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    console.error('[Auth Action] Login failed:', error.message);
    throw new Error('Kredensial tidak valid.');
  }

  return { success: true, user: data.user };
}