import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  ChevronRight,
  Calendar,
  X,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
  Package,
  Save,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Order } from '../types';
import { cn } from '../lib/utils';
import ErrorState from '../components/ErrorState';
import { useTableData } from '../hooks/useTableData';

export default function Orders() {
  const { 
    data: orders, 
    loading, 
    isDirty, 
    updateOffline, 
    undo, 
    commit, 
    refresh 
  } = useTableData<Order>('getOrders', api.getOrders, api.saveOrder);

  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<Order>>({});
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = (order: Order | null) => {
    if (order) {
      setEditData(order);
    } else {
      setEditData({
        ID: '',
        DuAn: '',
        TenVatTu: '',
        MaVatTu: '',
        SoLuong: 0,
        DonVi: '',
        NCC: '',
        NgayCanHang: new Date().toISOString().split('T')[0],
        IsKhanCap: false,
        TrangThai: 'Chuan bi',
        RuiRo: 'Xanh'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await commit(editData as Order);
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Xác nhận xóa đơn hàng này?')) return;
    try {
      await api.deleteOrder(id);
      if (selectedOrder?.ID === id) setSelectedOrder(null);
      refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Do': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'Vang': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
      case 'Xanh': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      default: return 'bg-slate-300';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Hoan thanh': return 'bg-emerald-100/50 text-emerald-700 border-emerald-200';
      case 'Cham': return 'bg-red-100/50 text-red-700 border-red-200';
      case 'Dang giao': return 'bg-blue-100/50 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.TenVatTu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.DuAn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý đơn hàng</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật & Chỉnh sửa trực tiếp</p>
          </div>
          {isDirty && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black text-amber-700 uppercase tracking-tighter"
            >
              <AlertCircle size={10} />
              Có thay đổi chưa lưu
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button 
              onClick={undo}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-200 text-amber-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-lg shadow-amber-500/5"
            >
              <RotateCcw size={16} />
              Hoàn tác
            </button>
          )}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} />
            Xuất Excel
          </button>
          <button 
            onClick={() => handleOpenEdit(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all"
          >
            <Plus size={16} />
            Tạo đơn
          </button>
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden flex flex-col md:flex-row h-[750px] gap-0">
        <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-500",
          selectedOrder ? "md:w-1/2 lg:w-3/5" : "w-full"
        )}>
          <div className="p-5 border-b border-slate-100 flex items-center gap-4 bg-white sticky top-0 z-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm dự án, vật tư..." 
                className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs border-separate border-spacing-y-2 px-4 shadow-none">
              <thead className="bg-white text-slate-400 font-black uppercase tracking-widest text-[9px] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Thông tin</th>
                  <th className="px-4 py-3">Hạn chót</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={4} className="px-4 py-4"><div className="h-12 bg-slate-50 rounded-2xl"></div></td>
                    </tr>
                  ))
                ) : filteredOrders.map((order, index) => (
                  <tr 
                    key={`${order.ID}-${index}`} 
                    onClick={() => setSelectedOrder(order)}
                    className={cn(
                      "group cursor-pointer transition-all relative rounded-2xl",
                      selectedOrder?.ID === order.ID ? "bg-blue-50/80 ring-2 ring-blue-500/20" : "hover:bg-slate-50/50"
                    )}
                  >
                    <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", getRiskColor(order.RuiRo))}></div>
                        <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{order.ID}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-y border-transparent">
                      <div>
                        <p className="font-extrabold text-slate-800 leading-none mb-1 line-clamp-1">{order.TenVatTu}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate">{order.DuAn}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-y border-transparent font-bold text-slate-500">
                      {new Date(order.NgayCanHang).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                       <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleOpenEdit(order); }}
                           className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                         >
                           <Edit2 size={13} />
                         </button>
                         <button 
                           onClick={(e) => handleDelete(order.ID, e)}
                           className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                         >
                           <Trash2 size={13} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 bg-white flex flex-col md:relative md:inset-auto md:z-auto md:w-1/2 lg:w-2/5 md:border-l border-slate-100 overflow-hidden h-full shadow-2xl md:shadow-none"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedOrder(null)} className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-400 mr-1">
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">{selectedOrder.ID}</h2>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{selectedOrder.TenVatTu}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="flex p-2.5 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 scrollbar-thin">
                <div className="bg-slate-50/50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 flex flex-col gap-4 sm:gap-5">
                   <div className="flex items-center justify-between">
                     <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin chi tiết</span>
                     {selectedOrder.IsKhanCap && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">ƯU TIÊN 1</span>}
                   </div>
                   <div className="grid grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-4">
                      <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dự án</p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">{selectedOrder.DuAn}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số lượng</p>
                        <p className="text-xs sm:text-sm font-extrabold text-blue-600 truncate">{selectedOrder.SoLuong} {selectedOrder.DonVi}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhà cung cấp</p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-800 p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm truncate">{selectedOrder.NCC}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-5 sm:space-y-6 px-1 sm:px-2">
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" /> Tiến độ mốc thời gian T+14
                  </h3>
                  <div className="space-y-6 sm:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {[
                      { label: 'Gửi PYC (T)', date: selectedOrder.Moc_T, status: 'complete' },
                      { label: 'Ký HĐ (T2)', date: selectedOrder.Moc_T2, status: 'complete' },
                      { label: 'Lệnh sản xuất (T7)', date: selectedOrder.Moc_T7, status: 'current' },
                      { label: 'Đóng gói (T10)', date: selectedOrder.Moc_T10, status: 'pending' },
                      { label: 'Bàn giao (T14)', date: selectedOrder.Moc_T14, status: 'pending' },
                    ].map((step) => (
                      <div key={step.label} className="flex items-start gap-4 sm:gap-5 relative pl-8 group">
                        <div className={cn(
                          "absolute left-0 w-[24px] h-[24px] rounded-full border-2 bg-white flex items-center justify-center transition-all z-10",
                          step.status === 'complete' ? "border-emerald-500 bg-emerald-500 text-white" : 
                          step.status === 'current' ? "border-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.1)] scale-110" : "border-slate-200"
                        )}>
                          {step.status === 'complete' && <CheckCircle2 size={12} />}
                          {step.status === 'current' && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-[10px] sm:text-xs font-black uppercase tracking-tight transition-colors",
                            step.status === 'pending' ? "text-slate-400 font-bold" : "text-slate-900",
                            step.status === 'current' && "text-blue-600"
                          )}>
                            {step.label}
                          </p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-medium italic opacity-70">Dự kiến: {step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)} 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSave} className="flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editData.ID ? 'Cập nhật đơn hàng' : 'Tạo đơn mới'}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Thông tin sẽ được đồng bộ vào Google Sheets</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-4 scrollbar-thin">
                <div className="space-y-4">
                  {/* Field Row: Title | Value */}
                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn hàng</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={editData.ID} 
                        onChange={e => setEditData({...editData, ID: e.target.value})} 
                        required 
                        className="form-input w-full" 
                        placeholder="VD: DH-2024-001"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dự án</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={editData.DuAn} 
                        onChange={e => setEditData({...editData, DuAn: e.target.value})} 
                        required 
                        className="form-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên vật tư</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={editData.TenVatTu} 
                        onChange={e => setEditData({...editData, TenVatTu: e.target.value})} 
                        required 
                        className="form-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số lượng</label>
                    <div className="col-span-2 flex gap-2">
                      <input 
                        type="number" 
                        value={editData.SoLuong} 
                        onChange={e => setEditData({...editData, SoLuong: Number(e.target.value)})} 
                        required 
                        className="form-input flex-1"
                      />
                      <input 
                        type="text" 
                        value={editData.DonVi} 
                        onChange={e => setEditData({...editData, DonVi: e.target.value})} 
                        placeholder="ĐVT" 
                        className="form-input w-24"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhà cung cấp</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={editData.NCC} 
                        onChange={e => setEditData({...editData, NCC: e.target.value})} 
                        className="form-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày cần hàng</label>
                    <div className="col-span-2">
                      <input 
                        type="date" 
                        value={editData.NgayCanHang?.split('T')[0]} 
                        onChange={e => setEditData({...editData, NgayCanHang: e.target.value})} 
                        required 
                        className="form-input w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 py-2 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rủi ro ban đầu</label>
                    <div className="col-span-2">
                      <select 
                        value={editData.RuiRo} 
                        onChange={e => setEditData({...editData, RuiRo: e.target.value as any})} 
                        className="form-input w-full"
                      >
                        <option value="Xanh">Bình thường (Xanh)</option>
                        <option value="Vang">Cảnh báo (Vàng)</option>
                        <option value="Do">Nguy cấp (Đỏ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-5 bg-red-50 rounded-2xl border border-red-100 mt-4">
                    <input 
                      type="checkbox" 
                      id="isUrgent"
                      checked={editData.IsKhanCap} 
                      onChange={e => setEditData({...editData, IsKhanCap: e.target.checked})} 
                      className="w-6 h-6 rounded-lg border-red-200 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="isUrgent" className="text-xs font-black text-red-700 uppercase tracking-tight cursor-pointer">Đánh dấu đây là đơn hàng ƯU TIÊN KHẨN CẤP</label>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-white text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all border border-slate-100"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-3 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-3"
                >
                  {saving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={18} /> Lưu dữ liệu</>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
