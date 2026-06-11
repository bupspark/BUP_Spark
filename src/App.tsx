/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import BrandTwin from './pages/BrandTwin';
import CampaignSimulator from './pages/CampaignSimulator';
import ContentEngine from './pages/ContentEngine';
import Docs from './pages/Docs';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { BrandProvider } from './hooks/useBrand';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<RequireAuth><BrandProvider><Layout /></BrandProvider></RequireAuth>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/brand-twin" element={<BrandTwin />} />
        <Route path="/simulator" element={<CampaignSimulator />} />
        <Route path="/content" element={<ContentEngine />} />
        <Route path="/docs" element={<Docs />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
