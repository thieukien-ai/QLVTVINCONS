import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Key, Save, Shield, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải từ 6 ký tự trở lên' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');
      await api.changePassword(user.Username, oldPassword, newPassword);
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Lỗi khi đổi mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cài đặt tài khoản</h1>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quản lý bảo mật & Thông tin cá nhân</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bento-card p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl shadow-slate-900/20">
              {user?.HoTen.charAt(0)}
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">{user?.HoTen}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">{user?.Role}</p>
            
            <div className="w-full space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <UserIcon size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Username</p>
                  <p className="text-xs font-bold text-slate-700">{user?.Username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vai trò</p>
                  <p className="text-xs font-bold text-slate-700">{user?.Role === 'SA' ? 'Super Admin' : user?.Role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <div className="bento-card p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Key size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Đổi mật khẩu</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Nên đổi mật khẩu định kỳ 3 tháng/lần</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {message && (
                <div className={cn(
                  "p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wide flex items-center gap-2",
                  message.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                )}>
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Đang cập nhật...' : <><Save size={18} /> Cập nhật mật khẩu</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
