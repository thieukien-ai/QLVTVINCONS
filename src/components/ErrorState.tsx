import { AlertTriangle, RefreshCcw, ExternalLink, ShieldCheck, Settings } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 lg:p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-4xl mx-auto my-8 lg:my-12">
      <div className="w-full flex flex-col md:flex-row gap-8 items-start">
        {/* Left Side: Error Info */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-2xl">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lỗi Kết Nối Dữ Liệu</h3>
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Network Request Failed</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Chi tiết lỗi kỹ thuật:</p>
            <p className="text-xs font-mono text-blue-400 break-words leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            {onRetry && (
              <button 
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-xs"
              >
                <RefreshCcw size={16} />
                Thử lại ngay
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Troubleshooting Guide */}
        <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-5">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-500" />
            Hướng dẫn khắc phục Backend
          </h4>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-xs font-black bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0">1</div>
              <p className="text-xs text-slate-600 leading-normal">
                Mở Google Apps Script, nhấn <strong>Deploy</strong> &gt; <strong>New Deployment</strong>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="text-xs font-black bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0">2</div>
              <p className="text-xs text-slate-600 leading-normal">
                Chọn loại <strong>Web App</strong>. Tại mục "Who has access", bắt buộc phải chọn <strong>"Anyone"</strong> (Tất cả mọi người).
              </p>
            </div>

            <div className="flex gap-3">
              <div className="text-xs font-black bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0">3</div>
              <p className="text-xs text-slate-600 leading-normal">
                Copy URL mới nhất (kết thúc bằng <code>/exec</code>) và cập nhật vào biến <code>VITE_API_URL</code> trong cấu hình.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-700 uppercase mb-2 flex items-center gap-1">
                <Settings size={12} /> Lưu ý quan trọng cho GAS
              </p>
              <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                Sử dụng <code>ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)</code> trong hàm doGet/doPost để tránh lỗi CORS.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
        Hệ thống giám sát VinCons SupplyChain <ExternalLink size={10} />
      </p>
    </div>
  );
}
