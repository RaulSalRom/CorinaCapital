import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertiesPage from './pages/PropertiesPage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Helmet defaultTitle="Corina Capital" titleTemplate="%s - Corina Capital" />

        <ScrollToTop />

        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<UserProfilePage />} />

          {/* 404 */}
          <Route path="*" element={
            <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 text-center">
              <h1 className="text-6xl font-extrabold mb-4 text-primary">404</h1>
              <p className="text-xl text-muted-foreground mb-8">Lo sentimos, la página que buscas no existe.</p>
              <a
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Volver al inicio
              </a>
            </main>
          } />
        </Routes>

        <Toaster position="top-center" richColors />
      </Router>
    </AuthProvider>
  );
}

export default App;
