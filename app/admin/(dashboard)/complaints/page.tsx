"use client";

import { useState, useEffect } from "react";
import { Loader2, MessageSquareWarning, ChevronDown } from "lucide-react";
import { getAdminComplaints, updateComplaintStatus } from "@/app/actions/admin";

// ==========================================
// DEFINISI TIPE DATA (Strict TypeScript)
// ==========================================
interface Category {
  id: string;
  name: string;
  color: string | null;
}

interface CategoryRelation {
  categories: Category | Category[] | null;
}

interface Complaint {
  id: string;
  message: string;
  status: "baru" | "diproses" | "selesai";
  created_at: string;
  complaint_categories?: CategoryRelation[];
}

function extractCategories(relations?: CategoryRelation[]): Category[] {
  if (!relations) return [];
  const result: Category[] = [];
  relations.forEach((rel) => {
    if (!rel.categories) return;
    const cats = Array.isArray(rel.categories)
      ? rel.categories
      : [rel.categories];
    result.push(...cats);
  });
  return result;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedItem, setSelectedItem] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminComplaints().then((data) => {
      setComplaints(data as unknown as Complaint[]);
      setIsLoading(false);
    });
  }, []);

  const handleStatusChange = async (
    newStatus: "baru" | "diproses" | "selesai",
  ) => {
    if (!selectedItem) return;
    try {
      await updateComplaintStatus(selectedItem.id, newStatus);
      setSelectedItem({ ...selectedItem, status: newStatus });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedItem.id ? { ...c, status: newStatus } : c,
        ),
      );
    } catch (error) {
      alert("Gagal memperbarui status.");
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* ==========================================
          KIRI: DAFTAR KELUHAN
          ========================================== */}
      <div className="w-full md:w-1/3 flex flex-col border-r border-gray-200">
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
            </div>
          ) : (
            complaints.map((item) => {
              const itemCategories = extractCategories(
                item.complaint_categories,
              );

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedItem?.id === item.id ? "bg-blue-50 border-l-4 border-l-[#1BA0E2]" : "hover:bg-gray-50 border-l-4 border-l-transparent"}`}
                >
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Anonim
                  </h4>
                  <p className="text-xs text-gray-500 truncate mb-2">
                    {item.message}
                  </p>

                  {/* BADGES AREA: Kategori & Status */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === "baru" ? "bg-red-100 text-red-600" : item.status === "diproses" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    {itemCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: cat.color || "#94a3b8" }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==========================================
          KANAN: DETAIL KELUHAN
          ========================================== */}
      <div className="hidden md:flex flex-1 flex-col">
        {!selectedItem ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquareWarning className="w-16 h-16 mb-4 text-gray-300" />
            <p>Pilih keluhan untuk membaca detailnya.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-gray-50">
            <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  Detail Keluhan
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    {new Date(selectedItem.created_at).toLocaleString("id-ID")}
                  </p>
                  {extractCategories(selectedItem.complaint_categories).length >
                    0 && (
                    <>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex gap-1">
                        {extractCategories(
                          selectedItem.complaint_categories,
                        ).map((cat) => (
                          <span
                            key={cat.id}
                            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: cat.color || "#94a3b8" }}
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="relative inline-block">
                <select
                  value={selectedItem.status}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value as "baru" | "diproses" | "selesai",
                    )
                  }
                  className={`appearance-none w-44 text-sm font-semibold border rounded-xl pl-4 pr-10 py-2.5 cursor-pointer focus:outline-none focus:ring-2 transition-all shadow-sm ${
                    selectedItem.status === "baru"
                      ? "bg-red-50 text-red-700 border-red-200 focus:ring-red-200 focus:border-red-500"
                      : selectedItem.status === "diproses"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200 focus:ring-yellow-200 focus:border-yellow-500"
                        : "bg-green-50 text-green-700 border-green-200 focus:ring-green-200 focus:border-green-500"
                  }`}
                >
                  <option value="baru" className="text-gray-800 bg-white">
                    🔴 Status: Baru
                  </option>
                  <option value="diproses" className="text-gray-800 bg-white">
                    🟡 Status: Diproses
                  </option>
                  <option value="selesai" className="text-gray-800 bg-white">
                    🟢 Status: Selesai
                  </option>
                </select>

                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <ChevronDown
                    className={`w-4 h-4 ${
                      selectedItem.status === "baru"
                        ? "text-red-500"
                        : selectedItem.status === "diproses"
                          ? "text-yellow-500"
                          : "text-green-500"
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                {selectedItem.message}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
