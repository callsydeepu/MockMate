import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/auth/AuthContext';
import { useUI } from '../../context/ui/UIContext';

export const TopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    setMobileSidebarOpen, 
    notifications, 
    markAllNotificationsRead, 
    markNotificationRead 
  } = useUI();
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-lg border-b border-white/5 px-4 md:px-8 py-3.5 flex items-center justify-between hover-glow transition-all duration-300">
      {/* Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg glass-btn hover:shadow-glow-sm transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block group">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors" />
          <input
            type="text"
            placeholder="Search interviews, reports, analysis..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg glass-input transition-all duration-300"
          />
        </div>
      </div>

      {/* Notifications & Profile Panel */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="p-2.5 rounded-lg glass-btn hover:shadow-glow-sm transition-all relative group"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-glow-sm animate-pulse-glow" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-96 rounded-2xl glass-panel-lg shadow-glass-lg p-5 z-50 border border-white/10 animate-fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                <span className="font-display font-bold text-sm text-white">
                  Notifications
                  {unreadCount > 0 && <span className="badge-violet ml-2">{unreadCount}</span>}
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2 scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="text-center text-xs text-slate-500 py-8">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-lg transition-all duration-200 cursor-pointer hover-lift ${
                        n.read ? 'bg-white/2 hover:bg-white/5' : 'bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/15'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`font-semibold text-xs ${n.read ? 'text-slate-300' : 'text-white'}`}>
                          {n.title}
                        </span>
                        {!n.read && <div className="w-2 h-2 mt-1 rounded-full bg-violet-400 flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-2 block">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg glass-btn hover:shadow-glow-sm transition-all focus:outline-none"
            title="Profile"
          >
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={user?.name || 'User'}
              className="w-7 h-7 rounded-lg object-cover bg-gradient-to-br from-violet-500 to-cyan-400"
            />
            <span className="text-xs font-semibold text-slate-300 hidden md:block max-w-[100px] truncate">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
          </button>

          {/* Profile Dropdown Options */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel-lg shadow-glass-lg p-2 z-50 border border-white/10 animate-fade-in">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <span className="font-bold text-xs text-white block truncate">{user?.name}</span>
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">{user?.email}</span>
              </div>

              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              
              <div className="border-t border-white/5 my-2" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
