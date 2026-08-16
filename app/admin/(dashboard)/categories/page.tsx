'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2 } from 'lucide-react';
import { getAdminCategories, saveCategory, type CategoryPayload } from '@/app/actions/admin';

// Interface Data Baca dari DB (mirip payload tapi id terjamin ada dan ada created_at)
interface Category {
  id: string;
  name: string;
  applies_to: 'complaint' | 'consultation' | 'both';
  color: string;
  is_active: boolean;
  created_at?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CategoryPayload>({
    name: '', applies_to: 'both', color: '#1BA0E2', is_active: true
  });

  const fetchData = () => {
    getAdminCategories().then((data) => {
      setCategories(data as Category[]);
      setIsLoading(false);
    });
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleEdit = (cat: Category) => {
    setFormData({ 
      id: cat.id, 
      name: cat.name, 
      applies_to: cat.applies_to, 
      color: cat.color || '#1BA0E2', 
      is_active: cat.is_active 
    });
    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveCategory(formData);
      setIsFormOpen(false);
      setFormData({ name: '', applies_to: 'both', color: '#1BA0E2', is_active: true });
      fetchData();
    } catch (error) {
      alert("Gagal menyimpan kategori.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
          <p className="text-sm text-gray-500">Kelola topik untuk keluhan dan konsultasi.</p>
        </div>
        <button 
          onClick={() => { 
            setFormData({ name: '', applies_to: 'both', color: '#1BA0E2', is_active: true }); 
            setIsFormOpen(true); 
          }} 
          className="bg-[#1BA0E2] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1588c2] shadow-sm"
        >
          <Plus className="w-4 h-4" /> Tambah Baru
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm animate-in fade-in zoom-in-95">
          <h2 className="font-bold text-lg mb-4 text-gray-800">{formData.id ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Nama Kategori</label>
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2]" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Digunakan Untuk</label>
              <select 
                value={formData.applies_to} 
                onChange={e => setFormData({...formData, applies_to: e.target.value as 'complaint' | 'consultation' | 'both'})} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1BA0E2]/20 focus:border-[#1BA0E2]"
              >
                <option value="both">Keduanya (Keluhan & Konsultasi)</option>
                <option value="complaint">Hanya Keluhan</option>
                <option value="consultation">Hanya Konsultasi</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium bg-[#1BA0E2] text-white rounded-lg flex items-center gap-2 shadow-sm hover:bg-[#1588c2] transition-colors disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Kategori'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Nama Kategori</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Tipe</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-3 font-semibold uppercase tracking-wider text-xs text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {cat.applies_to === 'both' ? 'Keduanya' : cat.applies_to}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {cat.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(cat)} className="text-[#1BA0E2] hover:text-white hover:bg-[#1BA0E2] p-2 bg-blue-50 rounded-lg transition-colors border border-blue-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}