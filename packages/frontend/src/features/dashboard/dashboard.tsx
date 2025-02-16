import { Container, Typography } from '@mui/material';
import React from 'react';
import { useTest } from '../../core/hooks/test/use-test';

const Dashboard: React.FC = () => {
  const { data } = useTest();

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {JSON.stringify(data ?? '{}')}
    </Container>
  );
};

export default Dashboard;
