import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTest } from '../core/hooks/test/use-test';
import { Container, Typography } from '@mui/material';
import { FunctionComponent } from 'react';

const Index: FunctionComponent = () => {
  const { data } = useTest();

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {data?.data}
    </Container>
  );
};

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    if (!context.session.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Index,
});
