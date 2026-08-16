import { redirect } from 'next/navigation';
import { checkConsultationToken } from '@/app/actions/consultations';
import { getActiveCategories } from '@/app/actions/categories';

// Mengimpor file ChatClient.tsx yang baru saja Anda buat di folder yang sama
import ChatClient from "./ChatClient";

interface PageProps {
  // Gunakan Promise untuk Next.js 15, atau hapus Promise jika menggunakan Next.js 14
  params: Promise<{ token: string }>;
}

export default async function ConsultationChatPage({ params }: PageProps) {
  // Hapus kata 'await' jika Anda menggunakan Next.js 14
  const { token: rawToken } = await params;
  const token = rawToken?.trim().toUpperCase();

  if (!token) {
    redirect('/konsultasi/cek');
  }

  let initialData;
  try {
    initialData = await checkConsultationToken(token);
  } catch {
    redirect('/konsultasi/cek');
  }

  const categories = await getActiveCategories().catch(() => []);

  // Merender komponen Client dengan mengirimkan data awal
  return <ChatClient token={token} initialData={initialData} categories={categories} />;
}