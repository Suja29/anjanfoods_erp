import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import PlaceholderPage from '@/pages/PlaceholderPage';
import { NAV_ITEMS } from '@/lib/permissions';

function App() {
  const placeholderRoutes = NAV_ITEMS.filter((i) => i.path !== '/dashboard').map((item) => (
    <Route
      key={item.path}
      path={item.path}
      element={<PlaceholderPage title={item.label} description="This module will be built in an upcoming phase." />}
    />
  ));

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            {placeholderRoutes}
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
