"use server";
import { supabase } from '@/app/lib/supabase';

export interface Category {
  id: string;
  name: string;
  applies_to: 'complaint' | 'consultation' | 'both';
}

export async function getActiveCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, applies_to')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Categories Action] Error fetching categories:', error.message);
    throw new Error('Gagal memuat kategori. Silakan coba lagi.');
  }

  return data as Category[];
}