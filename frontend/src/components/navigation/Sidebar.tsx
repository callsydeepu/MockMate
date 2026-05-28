import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Video, 
  FilePieChart, 
  TrendingUp, 
  History, 
  User, 
  Settings, 
  LogOut, 
  BrainCircuit, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { useUI } from '../../context/ui/UIContext';

interface SidebarProps {
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false }) => {
  const { logout } = useAuth();
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    setMobileSidebarOpen 
  } = useUI();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Interview Room', path: '/interview', icon: Video },
    { name: 'Reports', path: '/reports', icon: FilePieChart },
    { name: 'Analytics', path: '/analytics', icon: TrendingUp },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    if (isMobile) setMobileSidebarOpen(false);
    navigate('/');
  };

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-64';

  const renderNavLinks = () => (
    <nav className="flex-1 px-4 py-6 space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={() => isMobile && setMobileSidebarOpen(false)}
          className={({ isActive }) => `
            flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group
            ${isActive 
              ? 'bg-gradient-to-r from-violet-600/30 to-cyan-500/10 text-white border border-violet-500/20 shadow-[0_0_12px_rgba(139,92,246,0.1)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }
          `}
        >
          <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
          <AnimatePresence mode="wait">
            {(!sidebarCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-slate-950/95 backdrop-blur-xl border-r border-white/5 w-64">
        {/* Mobile Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-violet-500" />
            <span className="font-display font-extrabold text-sm tracking-wider text-white">MOCKMATE X AI</span>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderNavLinks()}

        {/* Logout Section */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-xl text-sm font-semibold text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 border border-transparent hover:border-pink-500/20 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`hidden md:flex flex-col h-full bg-slate-950/80 backdrop-blur-md border-r border-white/5 transition-all duration-300 ease-in-out relative ${sidebarWidth}`}
    >
      {/* Brand Logotype */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between overflow-hidden">
        <NavLink to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-extrabold text-xs tracking-widest text-white whitespace-nowrap"
              >
                MOCKMATE <span className="text-[9px] text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 px-1 rounded ml-0.5">X</span>
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {renderNavLinks()}

      {/* Collapse Toggle Control */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-3">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all duration-300 group ${sidebarCollapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 hover:shadow-glow-sm"
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
