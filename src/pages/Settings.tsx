import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, Permission } from '../types';
import { UserPlus, ShieldCheck, Key } from 'lucide-react';

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getUsers(), api.getPermissions()])
      .then(([u, p]) => {
        setUsers(u);
        setPermissions(p);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hệ thống & Phân quyền</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thiết lập ma trận truy cập VinCons</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bento-card p-0 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 rounded-t-3xl">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <UserPlus size={20} className="text-blue-600" /> Nhân sự vận hành
            </h3>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors">Mời mới</button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-xs border-separate border-spacing-y-2">
              <thead className="text-slate-400 font-black uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="px-4 py-3">Danh tính</th>
                  <th className="px-4 py-3 text-center">Vai trò đặc quyền</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {users.map((user) => (
                  <tr key={user.Email} className="group hover:bg-slate-50 transition-all rounded-2xl">
                    <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l">
                      <p className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{user.HoTen}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user.Email}</p>
                     </td>
                    <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                      <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 inline-block">{user.Role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bento-card p-0 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 rounded-t-3xl">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" /> Bản đồ quyền hạn
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">Tải xuống</button>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left text-xs border-separate border-spacing-y-2">
              <thead className="text-slate-400 font-black uppercase tracking-widest text-[9px]">
                <tr>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Phạm vi</th>
                  <th className="px-4 py-3 text-center">Capability</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50 transition-all rounded-2xl">
                    <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l font-black text-slate-800 uppercase tracking-tighter">{perm.Role}</td>
                    <td className="px-4 py-4 border-y border-transparent font-bold text-slate-400">
                      <span className="bg-slate-100 px-2 py-1 rounded-lg italic">/ {perm.Trang === '*' ? 'GLOBAL' : perm.Trang}</span>
                    </td>
                    <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {perm.Quyen.split('/').map(q => (
                          <span key={q} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100/50 shadow-sm">{q}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
