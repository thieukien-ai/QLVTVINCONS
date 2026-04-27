import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OptimizationIssue } from '../types';
import { Plus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Issues() {
  const [issues, setIssues] = useState<OptimizationIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getIssues()
      .then(res => setIssues(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vấn đề & Tối ưu</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Xử lý tình huống PA1/PA2</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all">
          <Plus size={16} />
          Báo cáo sự vụ
        </button>
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
                <th className="px-4 py-4">Xử lý</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {loading ? (
                 <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest opacity-50">Truy xuất dữ liệu...</td></tr>
              ) : issues.map((issue) => (
                <tr key={issue.ID} className="group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all rounded-2xl relative">
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
                  <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{issue.TrangThai}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
