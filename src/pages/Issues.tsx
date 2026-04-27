import React, { useState } from 'react';
import { api } from '../services/api';
import { OptimizationIssue } from '../types';
import { Plus, ShieldAlert, CheckCircle2, Trash2, Edit2, X, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorState from '../components/ErrorState';
import { motion } from 'motion/react';
import { useTableData } from '../hooks/useTableData';

export default function Issues() {
  const { 
    data: issues, 
    loading, 
    isDirty, 
    undo, 
    commit, 
    refresh 
  } = useTableData<OptimizationIssue>('getIssues', api.getIssues, api.saveIssue);

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<OptimizationIssue>>({});
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (issue: OptimizationIssue | null) => {
    if (issue) {
      setEditData(issue);
    } else {
      setEditData({ 
        ID: `SV-${Date.now()}`,
        DuAn: '', 
        LoaiVuViec: '', 
        PhuongAn: 'PA1', 
        NguoiPhuTrach: '', 
        Deadline: new Date().toISOString().split('T')[0], 
        TrangThai: 'Đang xử lý' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await commit(editData as OptimizationIssue);
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
    if (!confirm('Xác nhận xóa báo cáo sự vụ này?')) return;
    try {
      await api.deleteIssue(id);
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vấn đề & Tối ưu</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Xử lý tình huống PA1/PA2</p>
          </div>
          {isDirty && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-tighter">
              <AlertCircle size={10} /> Chờ ghi dữ liệu
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
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all font-sans"
          >
            <Plus size={16} /> Báo cáo sự vụ
          </button>
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-separate border-spacing-y-2 px-4 pb-4 mt-2">
            <thead className="bg-white text-slate-400 font-black uppercase tracking-widest text-[9px] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4">Dự án</th>
                <th className="px-4 py-4">Nội dung sự việc</th>
                <th className="px-4 py-4 text-center">Phương án</th>
                <th className="px-4 py-4">Đối ứng</th>
                <th className="px-4 py-4">Hạn chót</th>
                <th className="px-4 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {loading ? (
                 <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest opacity-50">Truy xuất dữ liệu...</td></tr>
              ) : issues.map((issue, index) => (
                <tr key={`${issue.ID}-${index}`} className="group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all rounded-2xl relative">
                  <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l font-black text-blue-600 uppercase tracking-tighter">{issue.DuAn}</td>
                  <td className="px-4 py-4 border-y border-transparent flex items-center gap-3">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0" />
                    <span className="font-extrabold group-hover:text-blue-600 transition-colors uppercase tracking-tight">{issue.LoaiVuViec}</span>
                  </td>
                  <td className="px-4 py-4 border-y border-transparent text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border block md:inline-block ${issue.PhuongAn === 'PA1' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                      {issue.PhuongAn}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-y border-transparent font-bold">{issue.NguoiPhuTrach}</td>
                  <td className="px-4 py-4 border-y border-transparent font-bold text-red-500 italic opacity-80">{new Date(issue.Deadline).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenEdit(issue)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-all"><Edit2 size={13} /></button>
                      <button onClick={() => handleDelete(issue.ID)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"><Trash2 size={13} /></button>
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
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Báo cáo sự vụ</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dự án</label>
                  <input type="text" value={editData.DuAn} onChange={e => setEditData({...editData, DuAn: e.target.value})} required className="form-input" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đối ứng xử lý</label>
                  <input type="text" value={editData.NguoiPhuTrach} onChange={e => setEditData({...editData, NguoiPhuTrach: e.target.value})} required className="form-input" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại sự việc / Vấn đề</label>
                  <input type="text" value={editData.LoaiVuViec} onChange={e => setEditData({...editData, LoaiVuViec: e.target.value})} required className="form-input" />
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phương án dự phòng</label>
                  <select value={editData.PhuongAn} onChange={e => setEditData({...editData, PhuongAn: e.target.value})} className="form-input">
                    <option value="PA1">Phương án 1 (Ưu tiên)</option>
                    <option value="PA2">Phương án 2 (Dự phòng)</option>
                  </select>
                </div>
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hạn chót xử lý</label>
                  <input type="date" value={editData.Deadline?.split('T')[0]} onChange={e => setEditData({...editData, Deadline: e.target.value})} required className="form-input" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Đóng</button>
                <button type="submit" disabled={saving} className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                   {saving ? '...' : <><Save size={16} /> Gửi báo cáo</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
