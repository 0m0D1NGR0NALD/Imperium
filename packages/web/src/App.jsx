import { Toaster } from 'react-hot-toast';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Constitution from './pages/Constitution';
import Budget from './pages/Budget';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import SideHustles from './pages/SideHustles';
import InvestmentHierarchy from './pages/InvestmentHierarchy';
import QuarterlyReport from './pages/QuarterlyReport';
import RecurringTransactions from './pages/RecurringTransactions';
import DebtTracker from './pages/DebtTracker';
import FamilySettings from './pages/FamilySettings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/constitution" element={<ProtectedRoute><Constitution /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/side-hustles" element={<ProtectedRoute><SideHustles /></ProtectedRoute>} />
          <Route path="/investment" element={<ProtectedRoute><InvestmentHierarchy /></ProtectedRoute>} />
          <Route path="/quarterly-report" element={<ProtectedRoute><QuarterlyReport /></ProtectedRoute>} />
          <Route path="/recurring" element={<ProtectedRoute><RecurringTransactions /></ProtectedRoute>} />
          <Route path="/debt-tracker" element={<ProtectedRoute><DebtTracker /></ProtectedRoute>} />
          <Route path="/family-settings" element={<ProtectedRoute><FamilySettings /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;