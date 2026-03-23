import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import { CartPage } from './pages/CartPage';
import { MyListPage } from './pages/MyListPage';
import { ConsultDermatologistPage } from './pages/ConsultDermatologistPage';
import { FamilyComboPage } from './pages/FamilyComboPage';
import Home from './pages/Home';
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
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';
import SellerProfilePage from './pages/seller/SellerProfilePage';

// Layout wrapper for the public-facing site (Navbar + Footer)
const PublicLayout: React.FC = () => (
  <div
    className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-primary/10 via-background-light to-accent-pink/5 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 font-display text-slate-900 dark:text-white transition-colors duration-300"
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
              <Route path="analytics" element={<SellerAnalyticsPage />} />
              <Route path="profile" element={<SellerProfilePage />} />
            </Route>

            {/* ══════════════════════════════════════════════════════════
                PUBLIC SITE — Shared layout with global Navbar + Footer
            ══════════════════════════════════════════════════════════ */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
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
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={['ADMIN']}><InventoryManagementPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
