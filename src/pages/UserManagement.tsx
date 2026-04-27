import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { UserPlus, Shield, Mail, Trash2, Edit, Loader2, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import ErrorState from '../components/ErrorState';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    Email: '',
    HoTen: '',
    Role: 'NHAN_VIEN',
    Password: '',
    IsActive: true
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUsers();
      setUsers(res);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveUser(formData);
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa người dùng này?')) return;
    try {
      await api.deleteUser(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Quản lý người dùng</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Phân quyền hệ thống Super Admin</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ Email: '', HoTen: '', Role: 'NHAN_VIEN', Password: '', IsActive: true });
            setEditingUser(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 text-xs"
        >
          <UserPlus size={16} /> Thêm người dùng
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-3" /> Đang tải danh sách...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <div key={`${user.ID || user.Email}-${index}`} className="bento-card border border-slate-100 p-6 group hover:border-blue-500/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg uppercase group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  {user.HoTen.split(' ').pop()?.charAt(0) || 'U'}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingUser(user);
                      setFormData(user);
                      setModalOpen(true);
                    }}
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user.ID || user.Email)}
                    className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 truncate">{user.HoTen}</h3>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 tracking-tight mt-1">
                    <Mail size={12} /> {user.Email}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className={cn(
                    "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest",
                    user.Role === 'SA' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {user.Role}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 text-[10px] font-black uppercase tracking-tight",
                    user.IsActive ? "text-emerald-500" : "text-slate-300"
                  )}>
                    {user.IsActive ? <><Check size={14} /> Hoạt động</> : <><X size={14} /> Tắt</>}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 lg:p-10 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">
              {editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ và tên</label>
                <input 
                  type="text" 
                  value={formData.HoTen}
                  onChange={(e) => setFormData({...formData, HoTen: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input 
                  type="email" 
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vai trò (Role)</label>
                <select 
                  value={formData.Role}
                  onChange={(e) => setFormData({...formData, Role: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                >
                  <option value="NHAN_VIEN">NHÂN VIÊN</option>
                  <option value="QLVT">QUẢN LÝ VẬT TƯ</option>
                  <option value="SA">SUPER ADMIN</option>
                </select>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mật khẩu</label>
                  <input 
                    type="password" 
                    value={formData.Password}
                    onChange={(e) => setFormData({...formData, Password: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              )}
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.IsActive}
                  onChange={(e) => setFormData({...formData, IsActive: e.target.checked})}
                  className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-700">Tài khoản này đang hoạt động</label>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-[10px]"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 text-[10px]"
                >
                  Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
