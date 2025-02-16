import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useUsersAuthorize } from '../../core/hooks/users/use-users-authorize';
import { t } from 'i18next';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { mutateAsync: authorize } = useUsersAuthorize({
    onSuccess: () => {
      onLogin();
    },
  });

  const handleLogin = async () => {
    console.log({ username, password });
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

export default Login;
