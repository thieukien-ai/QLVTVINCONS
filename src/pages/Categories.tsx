import React, { useState } from 'react';
import { api } from '../services/api';
import { Material } from '../types';
import { Plus, Search, Trash2, Edit2, X, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorState from '../components/ErrorState';
import { motion } from 'motion/react';
import { useTableData } from '../hooks/useTableData';

export default function Categories() {
  const { 
    data: items, 
    loading, 
    isDirty, 
    undo, 
    commit, 
    refresh 
  } = useTableData<Material>('getCategories', api.getCategories, api.saveCategory, 'MaVatTu');

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Material>>({});
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenEdit = (item: Material | null) => {
    if (item) {
      setEditData(item);
    } else {
      setEditData({ MaVatTu: '', TenVatTu: '', NhomVatTu: '', DonVi: '', TG_ThongDung: '7 ngày', TG_NhapKhau: '45 ngày' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await commit(editData as Material);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        alert(result.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa vật tư này khỏi danh mục?')) return;
    try {
      await api.deleteCategory(id);
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredItems = items.filter(i => 
    i.MaVatTu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.TenVatTu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.NhomVatTu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Danh mục vật tư</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tiêu chuẩn định mức cung ứng</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-tighter">
              <AlertCircle size={10} /> Chờ đồng bộ
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button 
              onClick={undo}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 text-amber-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all font-sans"
            >
              <RotateCcw size={16} /> Hoàn tác
            </button>
          )}
          <button 
            onClick={() => handleOpenEdit(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all"
          >
            <Plus size={16} /> Thêm vật tư
          </button>
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Tra mã, tên vật tư..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-separate border-spacing-y-2 px-4 pb-4 mt-2">
            <thead className="bg-white text-slate-400 font-black uppercase tracking-widest text-[9px] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4 text-center">Mã</th>
                <th className="px-4 py-4">Tên vật tư</th>
                <th className="px-4 py-4 text-center">Nhóm</th>
                <th className="px-4 py-4 text-center">ĐVT</th>
                <th className="px-4 py-4 text-center">TG Chuẩn</th>
                <th className="px-4 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {loading ? (
                 <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold opacity-50 uppercase tracking-widest animate-pulse font-mono tracking-tighter">Truy xuất database...</td></tr>
              ) : filteredItems.map((item, index) => (
                <tr key={`${item.MaVatTu}-${index}`} className="group hover:bg-slate-50 transition-all rounded-2xl">
                  <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l font-black text-slate-900 text-center">{item.MaVatTu}</td>
                  <td className="px-4 py-4 border-y border-transparent font-extrabold group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.TenVatTu}</td>
                  <td className="px-4 py-4 border-y border-transparent text-center">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none block md:inline-block">{item.NhomVatTu}</span>
                  </td>
                  <td className="px-4 py-4 border-y border-transparent font-bold opacity-60 tracking-tighter uppercase text-center">{item.DonVi}</td>
                  <td className="px-4 py-4 border-y border-transparent font-bold text-slate-500 italic text-center">{item.TG_ThongDung}</td>
                  <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(item.MaVatTu)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 overflow-hidden">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Thông tin vật tư</h2>
            <form onSubmit={handleSave} className="flex flex-col max-h-[85vh]">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Mã vật tư</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.MaVatTu} onChange={e => setEditData({...editData, MaVatTu: e.target.value})} required className="form-input w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Nhóm hàng</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.NhomVatTu} onChange={e => setEditData({...editData, NhomVatTu: e.target.value})} required className="form-input w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Tên vật tư</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.TenVatTu} onChange={e => setEditData({...editData, TenVatTu: e.target.value})} required className="form-input w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Đơn vị tính</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.DonVi} onChange={e => setEditData({...editData, DonVi: e.target.value})} required className="form-input w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">TG cung ứng</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.TG_ThongDung} onChange={e => setEditData({...editData, TG_ThongDung: e.target.value})} required className="form-input w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Ghi chú</label>
                  <div className="col-span-2">
                    <input type="text" value={editData.TG_NhapKhau} onChange={e => setEditData({...editData, TG_NhapKhau: e.target.value})} placeholder="VD: Hàng nhập khẩu 45 ngày..." className="form-input w-full" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Đóng</button>
                <button type="submit" disabled={saving} className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                   {saving ? '...' : <><Save size={16} /> Lưu danh mục</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
