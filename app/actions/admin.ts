"use server";

import { createClient } from "@/app/lib/supabase-server";

export interface CategoryPayload {
  id?: string; // Opsional karena saat Insert (tambah baru) ID belum ada
  name: string;
  applies_to: "complaint" | "consultation" | "both";
  color: string;
  is_active: boolean;
}

export interface CategoryStat {
  name: string;
  count: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: "Keluhan" | "Konsultasi";
  status: "baru" | "diproses" | "selesai";
  created_at: string;
  preview: string;
}

export interface DashboardStatsData {
  totalTickets: number;
  statusBaru: number;
  statusDiproses: number;
  statusSelesai: number;
  topCategories: CategoryStat[];
  recentActivities: RecentActivity[];
  totalKeluhan: number;
  totalKonsultasi: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  color: string | null;
}

export interface CategoryRelation {
  categories: CategoryItem | CategoryItem[] | null;
}

// ==========================================
// 1. COMPLAINTS (Keluhan)
// ==========================================
export async function getAdminComplaints() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("complaints")
    .select(
      `
      id, message, status, created_at,
      complaint_categories (
        categories ( id, name, color )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateComplaintStatus(
  id: string,
  status: "baru" | "diproses" | "selesai",
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("complaints")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

// ==========================================
// 2. CONSULTATIONS (Konsultasi)
// ==========================================
export async function getAdminConsultations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultations")
    .select(
      `
      id, token, email, status, created_at,
      consultation_categories (
        categories ( id, name, color )
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getConsultationMessages(consultationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consultation_messages")
    .select("*")
    .eq("consultation_id", consultationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function replyToConsultation(
  consultationId: string,
  message: string,
) {
  const supabase = await createClient();

  // Ambil ID admin yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("consultation_messages").insert([
    {
      consultation_id: consultationId,
      sender_type: "admin",
      sender_admin_id: user.id,
      message: message.trim(),
    },
  ]);

  if (error) throw new Error(error.message);

  // Update status konsultasi otomatis menjadi diproses jika ada balasan
  await supabase
    .from("consultations")
    .update({ status: "diproses" })
    .eq("id", consultationId);

  return { success: true };
}

// ==========================================
// 3. CATEGORIES (CRUD)
// ==========================================
export async function getAdminCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function saveCategory(category: CategoryPayload) {
  const supabase = await createClient();

  if (category.id) {
    // Update data jika ID tersedia
    const { error } = await supabase
      .from("categories")
      .update({
        name: category.name,
        applies_to: category.applies_to,
        color: category.color,
        is_active: category.is_active,
      })
      .eq("id", category.id);

    if (error) {
      console.error(
        "[Categories Action] Error updating category:",
        error.message,
      );
      throw new Error("Gagal memperbarui kategori.");
    }
  } else {
    // Insert data baru jika ID tidak ada
    const { error } = await supabase.from("categories").insert([
      {
        name: category.name,
        applies_to: category.applies_to,
        color: category.color,
        is_active: category.is_active,
      },
    ]);

    if (error) {
      console.error(
        "[Categories Action] Error inserting category:",
        error.message,
      );
      throw new Error("Gagal menambahkan kategori baru.");
    }
  }

  return { success: true };
}

export async function getDashboardStats(): Promise<DashboardStatsData> {
  const supabase = await createClient();

  // 1. Fetch Keluhan beserta relasi kategorinya
  const { data: complaints, error: err1 } = await supabase
    .from("complaints")
    .select(
      `
      id, message, status, created_at,
      complaint_categories ( categories ( id, name, color ) )
    `,
    )
    .order("created_at", { ascending: false });

  // 2. Fetch Konsultasi beserta relasi kategorinya
  const { data: consultations, error: err2 } = await supabase
    .from("consultations")
    .select(
      `
      id, email, status, created_at,
      consultation_categories ( categories ( id, name, color ) )
    `,
    )
    .order("created_at", { ascending: false });

  if (err1) throw new Error(`Error complaints: ${err1.message}`);
  if (err2) throw new Error(`Error consultations: ${err2.message}`);

  const safeComplaints = complaints || [];
  const safeConsultations = consultations || [];

  // Variabel Kalkulasi
  let statusBaru = 0;
  let statusDiproses = 0;
  let statusSelesai = 0;
  const categoryCount: Record<string, { count: number; color: string }> = {};
  const activities: RecentActivity[] = [];

  // Proses Keluhan
  safeComplaints.forEach((c) => {
    if (c.status === "baru") statusBaru++;
    if (c.status === "diproses") statusDiproses++;
    if (c.status === "selesai") statusSelesai++;

    // Hitung Kategori untuk Keluhan
    (c.complaint_categories as unknown as CategoryRelation[])?.forEach((cc) => {
      // Normalisasi: jadikan array untuk memastikan proses aman
      const catArray = Array.isArray(cc.categories)
        ? cc.categories
        : [cc.categories];

      catArray.forEach((cat) => {
        if (cat) {
          if (!categoryCount[cat.name]) {
            categoryCount[cat.name] = {
              count: 0,
              color: cat.color || "#94a3b8",
            };
          }
          categoryCount[cat.name].count++;
        }
      });
    });

    activities.push({
      id: c.id,
      type: "Keluhan",
      status: c.status as "baru" | "diproses" | "selesai",
      created_at: c.created_at,
      preview: "Anonim: " + c.message.substring(0, 50) + "...",
    });
  });

  // Proses Konsultasi
  safeConsultations.forEach((c) => {
    if (c.status === "baru") statusBaru++;
    if (c.status === "diproses") statusDiproses++;
    if (c.status === "selesai") statusSelesai++;

    // Hitung Kategori untuk Konsultasi
    (c.consultation_categories as unknown as CategoryRelation[])?.forEach(
      (cc) => {
        // Normalisasi: jadikan array untuk memastikan proses aman
        const catArray = Array.isArray(cc.categories)
          ? cc.categories
          : [cc.categories];

        catArray.forEach((cat) => {
          if (cat) {
            if (!categoryCount[cat.name]) {
              categoryCount[cat.name] = {
                count: 0,
                color: cat.color || "#94a3b8",
              };
            }
            categoryCount[cat.name].count++;
          }
        });
      },
    );

    activities.push({
      id: c.id,
      type: "Konsultasi",
      status: c.status as "baru" | "diproses" | "selesai",
      created_at: c.created_at,
      preview: `Tiket dari ${c.email}`,
    });
  });

  // Sortir Top Kategori
  const topCategories: CategoryStat[] = Object.keys(categoryCount)
    .map((name) => ({
      name,
      count: categoryCount[name].count,
      color: categoryCount[name].color,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Ambil Top 5

  // Sortir Aktivitas Terbaru (Gabungan Keluhan & Konsultasi)
  activities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  const recentActivities = activities.slice(0, 5); // Ambil 5 terbaru

  return {
    totalTickets: safeComplaints.length + safeConsultations.length,
    totalKeluhan: safeComplaints.length,
    totalKonsultasi: safeConsultations.length,
    statusBaru,
    statusDiproses,
    statusSelesai,
    topCategories,
    recentActivities,
  };
}
