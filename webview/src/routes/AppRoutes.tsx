import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import { useAuth } from '@contexts/authContext';

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  // Temporarily set isAuthenticated to true for development
  const tempAuth = false;

  return (
    <Routes>
      {routes.map(({ path, element, isPublicRoute }) => (
        <Route
          key={path}
          path={path}
          element={
            tempAuth ? (
              isPublicRoute ? (
                <Navigate to="/room-meeting" replace />
              ) : (
                element
              )
            ) : isPublicRoute ? (
              element
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
