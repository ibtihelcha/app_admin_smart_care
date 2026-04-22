import { Navigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuth } from './auth-context';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="60vh" spacing={2}>
        <CircularProgress />
        <Typography variant="body2">Chargement de la session...</Typography>
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
