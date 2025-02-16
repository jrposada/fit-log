import React from 'react';
import { Outlet } from '@tanstack/react-router';

// TODO: https://docs.amplify.aws/react/how-amplify-works/concepts/#auth

const App: React.FC = () => {
  // In a real app, check Auth.currentAuthenticatedUser() to set auth state

  return <Outlet />;
};

export default App;
