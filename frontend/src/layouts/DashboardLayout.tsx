import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { useUI } from '../context/ui/UIContext';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUI();

  // Route guarding: if loading, display loader. If not authenticated, redirect to login.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Futuristic glowing spin loader */}
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-bg-glow-purple pointer-events-none rounded-full" />
        <div className="absolute bottom-[30%] right-[30%] w-[40%] h-[40%] bg-bg-glow-cyan pointer-events-none rounded-full" />
        <div className="flex flex-col items-center gap-4 z-10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-cyan-400 animate-spin" />
          </div>
          <span className="font-display font-bold text-xs tracking-widest text-slate-400 uppercase">
            Synchronizing AI Biometrics...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg mesh-grid relative flex overflow-hidden">
      {/* Background glow points */}
      <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-bg-glow-purple pointer-events-none rounded-full opacity-40" />
      <div className="absolute bottom-[20%] right-[20%] w-[60%] h-[60%] bg-bg-glow-cyan pointer-events-none rounded-full opacity-30" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm"
            />
            {/* Sidebar content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 md:hidden h-full"
            >
              <Sidebar isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen z-10">
        <TopNavbar />
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto">
          {/* Page content outputs here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
