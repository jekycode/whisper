import { redirect } from 'next/navigation';
import { checkConsultationToken } from '@/app/actions/consultations';
import { getActiveCategories } from '@/app/actions/categories';

// Mengimpor file ChatClient.tsx dari folder yang sama
import ChatClient from "./ChatClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ConsultationChatPage({ params }: PageProps) {
  // Await params untuk mendapatkan data dinamis
  const resolvedParams = await params;
  const token = resolvedParams?.token?.trim().toUpperCase();

  if (!token) {
    redirect('/konsultasi/cek');
  }

  let initialData;
  try {
    initialData = await checkConsultationToken(token);
  } catch (error) {
    console.error("Token tidak valid atau terjadi error:", error);
    redirect('/konsultasi/cek');
  }

  const categories = await getActiveCategories().catch((err) => {
    console.error("Gagal memuat kategori:", err);
    return [];
  });

  return (
    <ChatClient 
      token={token} 
      initialData={initialData} 
      categories={categories} 
    />
  );
}