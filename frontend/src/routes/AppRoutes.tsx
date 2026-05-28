import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../context/auth/AuthContext';

const ProtectedRoute = ({
  children,
}: any) => {

  const { user,isLoading } = useAuth();

  if (isLoading) {
    return <SuspenseLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Lazy load pages for optimized loading states
const LandingPage = lazy(() => import('../pages/LandingPage'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const OAuthSuccess = lazy(() => import('../pages/auth/OAuthSuccess'));

const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Analytics = lazy(() => import('../pages/dashboard/Analytics'));
const InterviewHistory = lazy(() => import('../pages/dashboard/InterviewHistory'));
const InterviewSetup = lazy(() => import('../pages/interview/InterviewSetup').then(m => ({ default: m.InterviewSetup })));const InterviewRoom = lazy(() => import('../pages/interview/InterviewRoom').then(m => ({ default: m.default }))); const InterviewSession = lazy(() => import('../pages/interview/InterviewSession').then(m => ({ default: m.InterviewSession })));
const Reports = lazy(() => import('../pages/reports/Reports'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Fallback loader while bundle chunks load
const SuspenseLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border-4 border-violet-500/10" />
      <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
    </div>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        {/* PUBLIC ROUTING LAYER */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* AUTHENTICATION ROUTING LAYER */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* PROTECTED CORE INTERFACE LAYER */}
                    <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<InterviewRoom />} />
          <Route path="/interview/setup" element={<InterviewSetup />} />
          <Route path="/interview/session" element={<InterviewSession />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/history" element={<InterviewHistory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* CATCH ALL 404 ROUTING LAYER */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};
