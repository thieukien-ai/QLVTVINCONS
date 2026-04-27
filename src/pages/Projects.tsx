import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project } from '../types';
import { Plus, Search, MapPin, User as UserIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects()
      .then(res => setProjects(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý dự án</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Danh sách công trường VinCons</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all">
          <Plus size={16} />
          Mở dự án mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse"></div>)
        ) : projects.map((p) => (
          <div key={p.MaDuAn} className="bento-card group hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-6">
                <MapPin size={24} />
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${p.TrangThai === 'Dang thi cong' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600'}`}>
                {p.TrangThai}
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">{p.TenDuAn}</h3>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{p.MaDuAn}</p>
            
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-50 italic">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <UserIcon size={14} className="text-slate-500" />
              </div>
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">BQL XD</p>
                <p className="text-xs font-bold text-slate-700">{p.BQLXD}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
