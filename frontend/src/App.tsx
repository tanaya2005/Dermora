import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProductListingPage } from './pages/ProductListingPage';
import { LoginPage } from './pages/LoginPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { InventoryManagementPage } from './pages/InventoryManagementPage';
import { CartPage } from './pages/CartPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ConsultDermatologistPage } from './pages/ConsultDermatologistPage';
import { FamilyComboPage } from './pages/FamilyComboPage';
import Home from './pages/Home';
import { ThemeProvider } from './ThemeContext';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-300">
          <Navbar />
          <main className="flex-1 flex flex-col w-full h-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/bundles" element={<FamilyComboPage />} />
              <Route path="/consult" element={<ConsultDermatologistPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/inventory" element={<InventoryManagementPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
