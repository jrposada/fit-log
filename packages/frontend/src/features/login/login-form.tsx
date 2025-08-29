import { Button, TextField, Typography } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { FunctionComponent, useState } from 'react';
import { useAuth } from '../../core/hooks/auth/use-auth';
import { useUsersAuthorize } from '../../core/api/users/use-users-authorize';

type LoginFormProps = {
  redirect: string;
};

const LoginForm: FunctionComponent<LoginFormProps> = ({ redirect }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const { mutateAsync: authorize } = useUsersAuthorize({
    onSuccess: () => {
      setIsAuthenticated(true);
      navigate({
        to: redirect,
      });
    },
  });

  const handleLogin = async () => {
    authorize({ email: username, password });
  };

  return (
    <>
      <Typography variant="h4">{t('login.title')}</Typography>
      <TextField
        fullWidth
        label={t('login.username')}
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        type="password"
        label={t('login.password')}
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        {t('login.action')}
      </Button>
    </>
  );
};

export default LoginForm;
export type { LoginFormProps };
