import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChannelDetailPage from './pages/ChannelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerPanelPage from './pages/SellerPanelPage';
import BuyerProfilePage from './pages/BuyerProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/channel/:id" element={<ChannelDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/seller-panel" element={<SellerPanelPage />} />
            <Route path="/buyer-profile/:id" element={<BuyerProfilePage />} />
            <Route path="/admin-panel" element={<AdminPanelPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;