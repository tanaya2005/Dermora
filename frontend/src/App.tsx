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
import { MyListPage } from './pages/MyListPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ConsultDermatologistPage } from './pages/ConsultDermatologistPage';
import { FamilyComboPage } from './pages/FamilyComboPage';
import Home from './pages/Home';
import { ThemeProvider } from './ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-primary/10 via-background-light to-accent-pink/5 dark:from-primary/20 dark:via-slate-800 dark:to-slate-900 font-display text-slate-900 dark:text-white transition-colors duration-300" style={{ backgroundAttachment: 'fixed' }}>
          <Navbar />
          <main className="flex-1 flex flex-col w-full h-full pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/mylist" element={<MyListPage />} />
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
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
