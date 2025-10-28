import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './utils/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { LoadingSpinner } from './components/layout/LoadingSpinner';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const Dashboard = React.lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const Profile = React.lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const Jobs = React.lazy(() => import('./pages/JobsPage').then(module => ({ default: module.JobsPage })));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Navbar />
                <React.Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                  <Dashboard />
                </React.Suspense>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Navbar />
                <React.Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                  <Profile />
                </React.Suspense>
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Navbar />
                <React.Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                  <Jobs />
                </React.Suspense>
              </ProtectedRoute>
            } />

            {/* 404 page */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900">404</h1>
                  <p className="text-gray-600 mt-2">Page not found</p>
                  <a href="/" className="text-blue-600 hover:text-blue-500 mt-4 inline-block">
                    Go back home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
