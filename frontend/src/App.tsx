import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import SellerDashboard from './pages/SellerDashboard';
import Dashboard from './pages/Dashboard';
import { AssessmentPage } from './pages/AssessmentPage';
import Assessment from './pages/Assessment';
import RecommendationsPage from './pages/RecommendationsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { InventoryManagementPage } from './pages/InventoryManagementPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import AdminAdvertisementsPage from './pages/AdminAdvertisementsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import SellerReviewsPage from './pages/seller/SellerReviewsPage';
import ReviewsPage from './pages/ReviewsPage';
import ProductDetails from './pages/ProductDetails';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PrivacyRequest from './pages/PrivacyRequest';
import DermatologistDashboard from './pages/DermatologistDashboard';
import { CartPage } from './pages/CartPage';
import { MyListPage } from './pages/MyListPage';
import { ConsultDermatologistPage } from './pages/ConsultDermatologistPage';
import { FamilyComboPage } from './pages/FamilyComboPage';
import Home from './pages/Home';

// New Dashboard Pages
import RevenueDashboard from './pages/admin/RevenueDashboard';
import CRMDashboard from './pages/admin/CRMDashboard';
import MarketingDashboard from './pages/admin/MarketingDashboard';
import SCMDashboard from './pages/admin/SCMDashboard';
import ERPDashboard from './pages/admin/ERPDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import ConsultantsManagement from './pages/admin/ConsultantsManagement';
import OrdersManagement from './pages/admin/OrdersManagement';
import OrderDetailsPage from './pages/admin/OrderDetailsPage';
import SellerDashboardNew from './pages/seller/SellerDashboardNew';
import DermatologistsPage from './pages/DermatologistsPage';
import SkinAnalysisPage from './pages/SkinAnalysisPage';
import SecurityPage from './pages/SecurityPage';

import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// New Seller Dashboard System
import { SellerLayout } from './layouts/SellerLayout';
import SellerDashboardOverview from './pages/seller/SellerDashboardOverview';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerOrderDetailsPage from './pages/seller/SellerOrderDetailsPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

// Layout wrapper for the public-facing site (Navbar + Footer)
const PublicLayout: React.FC = () => (
  <div
    className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-secondary via-white to-secondary/50 dark:from-primary dark:via-slate-800 dark:to-slate-900 font-sans text-primary dark:text-secondary transition-colors duration-300"
    style={{ backgroundAttachment: 'fixed' }}
  >
    <Navbar />
    <main className="flex-1 flex flex-col w-full h-full pt-24">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            {/* ══════════════════════════════════════════════════════════
                SELLER PORTAL — Dedicated layout (sidebar + topbar)
                Accessible at /seller, /seller/dashboard, /seller/products etc.
            ══════════════════════════════════════════════════════════ */}
            <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                  <SellerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SellerDashboardOverview />} />
              <Route path="dashboard" element={<SellerDashboardOverview />} />
              <Route path="products" element={<SellerProductsPage />} />
              <Route path="products/add" element={<SellerProductForm isEdit={false} />} />
              <Route path="products/edit/:id" element={<SellerProductForm isEdit={true} />} />
              <Route path="orders" element={<SellerOrdersPage />} />
              <Route path="orders/:orderId" element={<SellerOrderDetailsPage />} />
              <Route path="reviews" element={<SellerReviewsPage />} />
              <Route path="analytics" element={<SellerAnalyticsPage />} />
              <Route path="profile" element={<SellerProfilePage />} />
            </Route>

            {/* ══════════════════════════════════════════════════════════
                DERMATOLOGIST PORTAL — Dedicated routes for dermatologists
            ══════════════════════════════════════════════════════════ */}
            <Route path="/dermatologist/dashboard" element={
              <ProtectedRoute allowedRoles={['DERMATOLOGIST', 'ADMIN']}>
                <DermatologistDashboard />
              </ProtectedRoute>
            } />

            {/* ══════════════════════════════════════════════════════════
                PUBLIC SITE — Shared layout with global Navbar + Footer
            ══════════════════════════════════════════════════════════ */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/bundles" element={<FamilyComboPage />} />
              <Route path="/plans" element={<FamilyComboPage />} />
              <Route path="/consult" element={<ConsultDermatologistPage />} />

              {/* Protected buyer routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path="/mylist" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute><ReviewsPage /></ProtectedRoute>} />
              
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-request" element={<PrivacyRequest />} />

              {/* Legacy seller route (old SellerDashboard page — still accessible) */}
              <Route
                path="/seller/dashboard-legacy"
                element={
                  <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><ERPDashboard /></ProtectedRoute>} />
              <Route path="/admin/erp" element={<ProtectedRoute allowedRoles={['ADMIN']}><ERPDashboard /></ProtectedRoute>} />
              <Route path="/admin/revenue" element={<ProtectedRoute allowedRoles={['ADMIN']}><RevenueDashboard /></ProtectedRoute>} />
              <Route path="/admin/crm" element={<ProtectedRoute allowedRoles={['ADMIN']}><CRMDashboard /></ProtectedRoute>} />
              <Route path="/admin/marketing" element={<ProtectedRoute allowedRoles={['ADMIN']}><MarketingDashboard /></ProtectedRoute>} />
              <Route path="/admin/scm" element={<ProtectedRoute allowedRoles={['ADMIN']}><SCMDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersManagement /></ProtectedRoute>} />
              <Route path="/admin/consultants" element={<ProtectedRoute allowedRoles={['ADMIN']}><ConsultantsManagement /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><OrdersManagement /></ProtectedRoute>} />
              <Route path="/admin/orders/:orderId" element={<ProtectedRoute allowedRoles={['ADMIN']}><OrderDetailsPage /></ProtectedRoute>} />
              <Route path="/admin/dashboard-legacy" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={['ADMIN']}><InventoryManagementPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/advertisements" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminAdvertisementsPage /></ProtectedRoute>} />
              <Route path="/admin/reviews" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminReviewsPage /></ProtectedRoute>} />

              {/* New Feature Pages */}
              <Route path="/dermatologists" element={<DermatologistsPage />} />
              <Route path="/skin-analysis" element={<SkinAnalysisPage />} />
              <Route path="/security" element={<SecurityPage />} />

              {/* New Seller Dashboard */}
              <Route path="/seller/dashboard-new" element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}><SellerDashboardNew /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
