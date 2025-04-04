import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { NavBar } from './components/NavBar/NavBar';
import { AdminNavBar } from './components/NavBar/AdminNavBar';
import { LoginForm } from './components/LoginForm/LoginForm';
import { SignUpForm } from "./components/SignUpForm/SignUpForm";
import { Shop } from './pages/Shop';
import { Account } from './pages/Account';
import { AdminAccount } from './pages/Admin/AdminAccount';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Product } from './pages/Product';
import { Checkout } from './pages/Checkout';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/routes/ProtectedRoute';

function AppLayout() {
  const { user } = useAuth();
  
  return (
    <>
      {/* Conditional NavBar rendering */}
      {user?.isAdmin ? <AdminNavBar /> : <NavBar />}
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/shop" element={<Shop category="shop" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Protected user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        
        {/* Protected admin routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/account" element={<AdminAccount />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;