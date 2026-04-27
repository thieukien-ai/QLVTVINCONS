import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  AlertTriangle, 
  Settings, 
  Menu, 
  X,
  ClipboardList,
  Bell,
  Users,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Projects from './pages/Projects';
import Categories from './pages/Categories';
import Issues from './pages/Issues';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/LoginPage';
import UserManagement from './pages/UserManagement';

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Đơn hàng', path: '/orders', icon: Package },
    { name: 'Dự án', path: '/projects', icon: Briefcase },
    { name: 'Vật tư', path: '/categories', icon: ClipboardList },
    { name: 'Tối ưu', path: '/issues', icon: AlertTriangle },
    { name: 'Người dùng', path: '/users', icon: Users, hide: user?.Role !== 'SA' },
    { name: 'Cài đặt', path: '/settings', icon: Settings },
  ].filter(item => !item.hide);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shrink-0 shadow-xl shadow-slate-900/10 z-30">
        <div className="px-4 lg:px-8 h-16 flex items-center justify-between max-w-screen-2xl mx-auto w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/20">V</div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight leading-none uppercase">VinCons</span>
              <span className="text-blue-400 font-bold text-[9px] tracking-widest uppercase mt-0.5">SupplyChain</span>
            </div>
          </div>

          {/* Right Section: Notification & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            <button className="p-2 hover:bg-white/10 rounded-xl text-slate-400 relative transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>

            <div className="h-8 w-px bg-slate-800 mx-1"></div>

            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1 p-1 hover:bg-white/5 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400 uppercase text-[10px]">
                  {user?.HoTen.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left mr-1">
                  <p className="text-[11px] font-black leading-none">{user?.HoTen.split(' ').pop()}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">{user?.Role}</p>
                </div>
                <ChevronDown size={14} className={cn("text-slate-500 transition-transform", isUserMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-1 z-50 text-slate-700"
                  >
                    <div className="px-4 py-3 border-b border-slate-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tài khoản</p>
                      <p className="text-xs font-bold truncate">{user?.Email}</p>
                    </div>
                    <button 
                      onClick={() => { setIsUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 text-sm font-bold text-red-500 transition-colors"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-800/50 border-t border-slate-700/50">
          <div className="px-2 lg:px-8 max-w-screen-2xl mx-auto">
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 -mb-px">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 relative shrink-0",
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 font-bold'
                    )}
                  >
                    <Icon size={16} className={cn("shrink-0", isActive ? "text-white" : "text-slate-400")} />
                    <span className="text-[11px] uppercase tracking-wider">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 scroll-smooth bg-slate-50">
        <div className="max-w-screen-2xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Padding for Mobile safe area if needed */}
      <div className="h-2 bg-slate-50 lg:hidden"></div>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/users" element={user.Role === 'SA' ? <UserManagement /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
