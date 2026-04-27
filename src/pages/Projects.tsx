import React, { useState } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { Plus, MapPin, User as UserIcon, Trash2, Edit2, X, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorState from '../components/ErrorState';
import { motion } from 'motion/react';
import { useTableData } from '../hooks/useTableData';

export default function Projects() {
  const { 
    data: projects, 
    loading, 
    isDirty, 
    undo, 
    commit, 
    refresh 
  } = useTableData<Project>('getProjects', api.getProjects, api.saveProject);

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (project: Project | null) => {
    if (project) {
      setEditData(project);
    } else {
      setEditData({ MaDuAn: '', TenDuAn: '', BQLXD: '', TrangThai: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await commit(editData as Project);
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
    if (!confirm('Xác nhận xóa dự án này?')) return;
    try {
      await api.deleteProject(id);
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý dự án</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Danh mục dự án toàn hệ thống</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-tighter">
              <AlertCircle size={10} /> Chờ ghi file
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
            <Plus size={16} />
            Mở dự án mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse"></div>)
        ) : projects.map((p, index) => (
          <div key={`${p.MaDuAn}-${index}`} className="bento-card group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <MapPin size={24} />
              </div>
              <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(p)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 border border-transparent hover:border-blue-100">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(p.MaDuAn)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-600 border border-transparent hover:border-red-100">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{p.TenDuAn}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{p.MaDuAn}</p>
            
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50 italic">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <UserIcon size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">BQL XD</p>
                  <p className="text-xs font-bold text-slate-700">{p.BQLXD}</p>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                p.TrangThai === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600'
              )}>
                {p.TrangThai}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Dữ liệu dự án</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã dự án (Viết tắt)</label>
                <input type="text" value={editData.MaDuAn} onChange={e => setEditData({...editData, MaDuAn: e.target.value})} required className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên dự án</label>
                <input type="text" value={editData.TenDuAn} onChange={e => setEditData({...editData, TenDuAn: e.target.value})} required className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ban Quản Lý</label>
                <input type="text" value={editData.BQLXD} onChange={e => setEditData({...editData, BQLXD: e.target.value})} required className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái</label>
                <select value={editData.TrangThai} onChange={e => setEditData({...editData, TrangThai: e.target.value})} className="form-input">
                   <option value="Active">Đang triển khai</option>
                   <option value="Completed">Đã hoàn thành</option>
                   <option value="Inactive">Tạm dừng</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Hủy</button>
                <button type="submit" disabled={saving} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {saving ? '...' : <><Save size={14} /> Lưu dự án</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
