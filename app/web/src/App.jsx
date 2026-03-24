import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { AppShell } from './layouts/AppShell.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { InsightsPage } from './pages/InsightsPage.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/auth'} replace />} />
      <Route path="/auth" element={token ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="insights" element={<InsightsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
