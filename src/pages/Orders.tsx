import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  ChevronRight,
  MoreVertical,
  Calendar,
  AlertCircle,
  X,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { Order } from '../types';
import { cn } from '../lib/utils';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      setOrders(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Theo dõi đơn hàng</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tiến độ cung ứng mốc T+14</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} />
            Xuất Excel
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all">
            <Plus size={16} />
            Tạo đơn
          </button>
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden flex flex-col md:flex-row h-[750px] gap-0">
        {/* Table Sidebar */}
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
            <table className="w-full text-left text-xs border-separate border-spacing-y-2 px-4">
              <thead className="bg-white text-slate-400 font-black uppercase tracking-widest text-[9px] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Mã ĐH</th>
                  <th className="px-4 py-3">Thông tin</th>
                  <th className="px-4 py-3">Hạn</th>
                  <th className="px-4 py-3">Tiến độ</th>
                  <th className="px-4 py-3 text-center">Rủi ro</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td colSpan={5} className="px-4 py-4"><div className="h-12 bg-slate-50 rounded-2xl"></div></td>
                    </tr>
                  ))
                ) : filteredOrders.map((order) => (
                  <tr 
                    key={order.ID} 
                    onClick={() => setSelectedOrder(order)}
                    className={cn(
                      "group cursor-pointer transition-all relative rounded-2xl",
                      selectedOrder?.ID === order.ID ? "bg-blue-50/80 ring-2 ring-blue-500/20" : "hover:bg-slate-50/50"
                    )}
                  >
                    <td className="px-4 py-4 first:rounded-l-2xl border-y border-transparent border-l">
                      <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{order.ID}</span>
                    </td>
                    <td className="px-4 py-4 border-y border-transparent">
                      <div>
                        <p className="font-extrabold text-slate-800 leading-none mb-1">{order.TenVatTu}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{order.DuAn}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-y border-transparent font-bold text-slate-500">{new Date(order.NgayCanHang).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</td>
                    <td className="px-4 py-4 border-y border-transparent">
                       <span className={cn("px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", getStatusStyle(order.TrangThai))}>
                        {order.TrangThai}
                      </span>
                    </td>
                    <td className="px-4 py-4 last:rounded-r-2xl border-y border-transparent border-r text-center">
                       <div className={cn("w-2.5 h-2.5 rounded-full mx-auto", getRiskColor(order.RuiRo))}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ x: '100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                "fixed inset-0 z-50 bg-white flex flex-col md:relative md:inset-auto md:z-auto md:w-1/2 lg:w-2/5 md:border-l border-slate-100 overflow-hidden",
                "h-full"
              )}
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-400 mr-1"
                  >
                    <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">{selectedOrder.ID}</h2>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">{selectedOrder.TenVatTu}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="hidden md:flex p-2.5 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all hover:rotate-90"
                >
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

                {/* Timeline Stepper */}
                <div className="space-y-5 sm:space-y-6 px-1 sm:px-2">
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" /> Tiến độ mốc thời gian T+14
                  </h3>
                  <div className="space-y-6 sm:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {[
                      { label: 'Gửi PYC (T)', date: selectedOrder.Moc_T, status: 'complete' },
                      { label: 'Ký HĐ (T2)', date: selectedOrder.Moc_T2, status: 'complete' },
                      { label: 'Lệnh sản xuất (T7)', date: selectedOrder.Moc_T7, status: 'current' },
                      { label: 'Kiểm kho (T9)', date: selectedOrder.Moc_T9, status: 'pending' },
                      { label: 'Đóng gói (T10)', date: selectedOrder.Moc_T10, status: 'pending' },
                      { label: 'Bàn giao (T14)', date: selectedOrder.Moc_T14, status: 'pending' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4 sm:gap-5 relative pl-8 group">
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

                {/* Deadlines Card */}
                <div className="p-5 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl text-white shadow-2xl shadow-slate-900/30 mb-20 md:mb-0">
                   <div className="flex justify-between items-start mb-5 sm:mb-6">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Calendar size={18} className="text-blue-400" />
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-500">Hạn chót công trường</p>
                        <p className="text-base sm:text-xl font-black text-blue-400 tracking-tight">{new Date(selectedOrder.NgayCanHang).toLocaleDateString('vi-VN')}</p>
                      </div>
                   </div>
                   <div className="space-y-3 sm:space-y-4">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-500">Ghi chú vận hành</p>
                      <div className="p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl italic text-[11px] sm:text-xs leading-relaxed opacity-90">
                        "{selectedOrder.GhiChu || 'Hệ thống chưa nhận được ghi chú bổ sung cho đơn hàng này.'}"
                      </div>
                   </div>
                </div>

                <div className="md:pt-4 flex items-center gap-2 sm:gap-3 sticky bottom-[-24px] bg-white/100 backdrop-blur-md pb-6 pt-4 border-t border-slate-100 z-10 px-2 sm:px-0">
                   <button className="flex-1 py-3 sm:py-4 px-2 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Lịch sử</button>
                   <button className="flex-1 py-3 sm:py-4 px-2 bg-blue-600 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">Cập nhật ngay</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
