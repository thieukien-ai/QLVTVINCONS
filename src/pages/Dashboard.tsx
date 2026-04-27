import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { api } from '../services/api';
import { DashboardData } from '../types';

const mockChartData = [
  { name: 'T2', value: 400 },
  { name: 'T3', value: 300 },
  { name: 'T4', value: 200 },
  { name: 'T5', value: 278 },
  { name: 'T6', value: 189 },
  { name: 'T7', value: 239 },
  { name: 'CN', value: 349 },
];

import ErrorState from '../components/ErrorState';

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định khi tải Dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
      Đang tải dữ liệu bento...
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const kpis = [
    { title: 'Tổng đơn hàng', value: data?.kpis.totalOrders || 0, icon: '📦', color: 'blue', change: '↑ 12%' },
    { title: 'Rủi ro trễ hạn', value: data?.kpis.delayedOrders || 0, icon: '⚠️', color: 'red', change: `${data?.kpis.urgentOrders} đơn hàng khẩn` },
    { title: 'Tỉ lệ cung ứng', value: '94.2%', icon: '📊', color: 'emerald', change: 'Đạt mục tiêu Q2' },
    { title: 'Sự vụ tối ưu', value: data?.kpis.ongoingIssues || 0, icon: '💡', color: 'indigo', change: '6 PA1 đang xử lý' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(120px,auto)] gap-4 lg:gap-6 pb-8">
      {/* KPI Section - 2 columns on small screens, 4 on medium+ */}
      <div className="col-span-1 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className={cn(
            "bento-card flex flex-col justify-between p-4 min-h-[140px]",
            kpi.color === 'red' && "border-l-4 border-l-red-500"
          )}>
            <div className="flex justify-between items-start">
              <span className="text-[9px] lg:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-tight">{kpi.title}</span>
              <span className={cn("text-base lg:text-lg p-1.5 rounded-lg", `bg-${kpi.color}-50`)}>{kpi.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">{kpi.value}</h2>
              {kpi.title === 'Tỉ lệ cung ứng' ? (
                <div className="w-full bg-slate-100 h-1 rounded-full mt-2 lg:mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: '94.2%' }}></div>
                </div>
              ) : (
                <p className={cn(
                  "text-[9px] lg:text-[10px] font-bold mt-1 uppercase tracking-tight",
                  kpi.color === 'red' ? "text-red-500" : kpi.color === 'emerald' ? "text-emerald-600" : "text-blue-500"
                )}>
                  {kpi.change}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Table - Spans 12 cols on mobile, 8 on md+ */}
      <div className="bento-card col-span-1 md:col-span-8 row-span-4 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h3 className="font-extrabold text-slate-800 tracking-tight text-lg">Phân tích rủi ro (T+14)</h3>
          <div className="flex gap-2 w-full sm:w-auto">
             <input type="text" placeholder="Dự án..." className="text-xs border border-slate-200 rounded-xl px-3 py-2 flex-1 sm:w-40 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
             <button className="text-[10px] font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-wider">Lọc</button>
          </div>
        </div>
        <div className="flex-1 overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left text-xs border-separate border-spacing-y-2 min-w-[500px] px-2 sm:px-0">
            <thead className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Dự án</th>
                <th className="px-4 py-2">Vật tư</th>
                <th className="px-4 py-2">Ngày cần</th>
                <th className="px-4 py-2">Tiến độ</th>
                <th className="px-4 py-2 text-center">Rủi ro</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {data?.topRisks.map((order, index) => (
                <tr key={`${order.ID}-${index}`} className="group hover:bg-slate-50 transition-all rounded-xl">
                  <td className="px-4 py-3 first:rounded-l-xl border-y border-transparent border-l font-bold text-slate-900">{order.ID}</td>
                  <td className="px-4 py-3 border-y border-transparent font-medium">{order.DuAn}</td>
                  <td className="px-4 py-3 border-y border-transparent">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">{order.TenVatTu}</span>
                      {order.IsKhanCap && <span className="badge badge-urgent">KHẨN</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-y border-transparent opacity-60 font-medium">{new Date(order.NgayCanHang).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 border-y border-transparent">
                    <div className="flex items-center gap-1">
                      <div className="stepper-dot active"></div>
                      <div className="stepper-line"></div>
                      <div className="stepper-dot active"></div>
                      <div className="stepper-line active bg-blue-500"></div>
                      <div className="stepper-dot"></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 last:rounded-r-xl border-y border-transparent border-r text-center">
                    <span className={cn(
                      "font-black text-[10px] uppercase",
                      order.RuiRo === 'Do' ? "text-red-500" : order.RuiRo === 'Vang' ? "text-amber-500" : "text-emerald-500"
                    )}>
                      {order.RuiRo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latest Issues - Spans 4 cols */}
      <div className="bento-card col-span-1 md:col-span-4 row-span-4 flex flex-col">
        <h3 className="font-extrabold text-slate-800 mb-6 tracking-tight text-lg">Sự vụ tối ưu mới</h3>
        <div className="space-y-4 flex-grow overflow-y-auto pr-1">
          {data?.latestIssues.map((issue, index) => (
            <div key={`${issue.ID}-${index}`} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-widest">{issue.ID} - {issue.DuAn}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Hạn: {new Date(issue.Deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed mb-4 group-hover:text-blue-600 transition-colors">{issue.LoaiVuViec} - {issue.GhiChu}</p>
              <div className="flex gap-2">
                <button className="flex-1 text-[9px] font-black py-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 uppercase tracking-widest hover:scale-105 transition-transform">PA1: Thuê ngoài</button>
                <button className="flex-1 text-[9px] font-black py-2 rounded-xl bg-white border border-slate-200 text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-colors">PA2: Đổi NCC</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-white sticky bottom-0">
          <span className="text-[10px] text-slate-400 font-bold italic tracking-tight">Cập nhật 2 phút trước</span>
          <button className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:translate-x-1 transition-transform">Tất cả →</button>
        </div>
      </div>

      {/* Row 3 - Charts or Extra Stats */}
      <div className="bento-card col-span-1 md:col-span-8 row-span-2 flex flex-col sm:flex-row items-center gap-6 lg:gap-8 overflow-hidden">
        <div className="w-full sm:w-1/3">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Biểu đồ PYC 5/20</p>
           <div className="flex items-end gap-1.5 h-16">
              {[8, 12, 6, 10, 4, 11, 7, 9].map((h, i) => (
                <div key={i} className={cn("w-full rounded-t-lg transition-all hover:scale-110", i % 3 === 0 ? "bg-blue-500 h-[h*4%]" : "bg-blue-100 h-[h*2%]")} style={{ height: `${h * 6}%` }}></div>
              ))}
           </div>
        </div>
        <div className="w-full sm:flex-1 sm:border-l border-slate-100 sm:pl-8 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-amber-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trọng yếu</p>
                    <p className="text-sm font-extrabold text-slate-800">Cáp LS, Thép Hòa Phát</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-blue-400 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kho bãi trống</p>
                    <p className="text-sm font-extrabold text-slate-800">Lô A2 - 450m²</p>
                  </div>
                </div>
            </div>
        </div>
      </div>

      {/* Projects card at bottom */}
      <div className="bento-card col-span-1 md:col-span-4 row-span-2 flex flex-col justify-center">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Dự án trọng điểm</h3>
          <div className="flex gap-2">
             <div className="bg-slate-900 text-white p-3 lg:p-4 rounded-2xl flex-1 text-center hover:scale-105 transition-transform cursor-pointer">
                <p className="text-[9px] font-bold opacity-60 uppercase mb-1">VinFast HP</p>
                <p className="text-base lg:text-lg font-black tracking-tighter">VFHP</p>
             </div>
             <div className="bg-blue-600 text-white p-3 lg:p-4 rounded-2xl flex-1 text-center hover:scale-105 transition-transform cursor-pointer">
                <p className="text-[9px] font-bold opacity-70 uppercase mb-1">Vinhomes CP</p>
                <p className="text-base lg:text-lg font-black tracking-tighter">VCP1</p>
             </div>
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex-1 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer group">
                <Plus className="text-slate-300 group-hover:text-slate-500 transition-colors" size={20} />
             </div>
          </div>
      </div>
    </div>
  );
}
