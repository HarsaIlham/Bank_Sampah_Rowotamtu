import React, { useState, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { WasteCalculatorModal } from './components/common/WasteCalculatorModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { ProtectedRoute, GuestOnlyRoute } from './components/common/ProtectedRoute';
import { SplashScreen } from './components/common/SplashScreen';
import { PageLoader } from './components/common/PageLoader';

// Eager loaded public primary pages (instant render for guests)
import { LandingPage } from './pages/guest/LandingPage';
import { CatalogPage } from './pages/guest/CatalogPage';
import { EducationPage } from './pages/guest/EducationPage';
import { AboutUsPage } from './pages/guest/AboutUsPage';

// Lazy loaded secondary/private pages (Code Splitting)
const ArticleDetailPage = lazy(() => import('./pages/guest/ArticleDetailPage').then(m => ({ default: m.ArticleDetailPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));

const NasabahDashboardPage = lazy(() => import('./pages/nasabah/NasabahDashboardPage').then(m => ({ default: m.NasabahDashboardPage })));
const NasabahTransactionsPage = lazy(() => import('./pages/nasabah/NasabahTransactionsPage').then(m => ({ default: m.NasabahTransactionsPage })));
const NasabahSetorPage = lazy(() => import('./pages/nasabah/NasabahSetorPage').then(m => ({ default: m.NasabahSetorPage })));
const NasabahTarikPage = lazy(() => import('./pages/nasabah/NasabahTarikPage').then(m => ({ default: m.NasabahTarikPage })));
const NasabahProfilePage = lazy(() => import('./pages/nasabah/NasabahProfilePage').then(m => ({ default: m.NasabahProfilePage })));

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminNasabahPage = lazy(() => import('./pages/admin/AdminNasabahPage').then(m => ({ default: m.AdminNasabahPage })));
const AdminPricesPage = lazy(() => import('./pages/admin/AdminPricesPage').then(m => ({ default: m.AdminPricesPage })));
const AdminInputDepositPage = lazy(() => import('./pages/admin/AdminInputDepositPage').then(m => ({ default: m.AdminInputDepositPage })));
const AdminInputWithdrawalPage = lazy(() => import('./pages/admin/AdminInputWithdrawalPage').then(m => ({ default: m.AdminInputWithdrawalPage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));

// Optimized QueryClient default options (Phase 4)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 minutes default stale time
      gcTime: 10 * 60 * 1000,          // Keep unused cache for 10 minutes
      retry: 1,                         // Retry once on failure
      refetchOnWindowFocus: true,       // Auto refresh on tab focus
      refetchOnReconnect: true          // Auto refresh on internet reconnection
    }
  }
});

export const AppContent: React.FC = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FB] selection:bg-pink-500 selection:text-white">
      <ScrollToTop />
      {/* Main Navbar */}
      <Navbar
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      {/* Main Body View */}
      <main className={`flex-1 w-full ${isLoginPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10'}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* ================= GUEST PUBLIC ROUTES ================= */}
          <Route path="/" element={<LandingPage onOpenCalculator={() => setIsCalculatorOpen(true)} />} />
          <Route path="/katalog" element={<CatalogPage onOpenCalculator={() => setIsCalculatorOpen(true)} />} />
          <Route path="/edukasi" element={<EducationPage />} />
          <Route path="/edukasi/:id" element={<ArticleDetailPage />} />
          <Route path="/tentang-kami" element={<AboutUsPage />} />

          {/* ================= GUEST ONLY AUTH ROUTE ================= */}
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />

          {/* ================= NASABAH PROTECTED ROUTES ================= */}
          <Route
            path="/nasabah"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nasabah/transaksi"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahTransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nasabah/riwayat"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahTransactionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nasabah/setor"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahSetorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nasabah/tarik"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahTarikPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nasabah/profil"
            element={
              <ProtectedRoute allowedRoles={['nasabah', 'admin']}>
                <NasabahProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/nasabah"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNasabahPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/harga"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPricesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/setor"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminInputDepositPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/penarikan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminInputWithdrawalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/laporan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pengaturan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ================= CATCH-ALL REDIRECT ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Modals */}
      <WasteCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(
    () => !sessionStorage.getItem('resik_splash_shown')
  );

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('resik_splash_shown', 'true');
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
