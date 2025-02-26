import { Button, Container, TextField, Typography } from '@mui/material';
import {
  createFileRoute,
  redirect,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent, useState } from 'react';
import { z } from 'zod';
import { useSession } from '../core/hooks/session/use-session';
import { useUsersAuthorize } from '../core/hooks/users/use-users-authorize';
import { Route as dashboardRoute } from './index';

const Login: FunctionComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setIsAuthenticated } = useSession();
  const { redirect } = useSearch({
    from: Route.fullPath,
  });

  const { mutateAsync: authorize } = useUsersAuthorize({
    onSuccess: () => {
      setIsAuthenticated(true);
      navigate({
        to: redirect ?? dashboardRoute.to,
      });
    },
  });

  const handleLogin = async () => {
    authorize({ email: username, password });
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        {t('login.title')}
      </Typography>
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        {t('login.action')}
      </Button>
    </Container>
  );
};

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''),
});

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.session.isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: Login,
  validateSearch: loginSearchSchema,
});
