import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Material } from '../types';
import { Plus, Search, Tag, Box } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Categories() {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(res => setItems(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Danh mục vật tư</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tiêu chuẩn định mức cung ứng</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all">
          <Plus size={16} />
          Thêm vật tư
        </button>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Tra mã, tên vật tư..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
                <th className="px-4 py-4 text-center">Đơn vị</th>
                <th className="px-4 py-4 text-center">TG Chuẩn</th>
                <th className="px-4 py-4 text-center">TG Nhập</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {loading ? (
                 <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold opacity-50 uppercase tracking-widest animate-pulse font-mono tracking-tighter">Truy xuất database...</td></tr>
              ) : items.map((item) => (
                <tr key={item.MaVatTu} className="group hover:bg-slate-50 transition-all cursor-pointer rounded-2xl">
                  <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l font-black text-slate-900 text-center">{item.MaVatTu}</td>
                  <td className="px-4 py-4 border-y border-transparent font-extrabold group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.TenVatTu}</td>
                  <td className="px-4 py-4 border-y border-transparent text-center">
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none block md:inline-block">{item.NhomVatTu}</span>
                  </td>
                  <td className="px-4 py-4 border-y border-transparent font-bold opacity-60 tracking-tighter uppercase text-center">{item.DonVi}</td>
                  <td className="px-4 py-4 border-y border-transparent font-bold text-slate-500 italic text-center">{item.TG_ThongDung}</td>
                  <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r font-bold text-slate-500 italic text-center">{item.TG_NhapKhau}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
