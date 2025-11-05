import { createFileRoute, redirect, useSearch } from '@tanstack/react-router';
import { FunctionComponent } from 'react';
import { z } from 'zod';

import LoginForm from '../features/login/login-form';
import { Route as dashboardRoute } from './index';

const Login: FunctionComponent = () => {
  const { redirect } = useSearch({
    from: Route.fullPath,
  });

  return <LoginForm redirect={redirect ?? dashboardRoute.to} />;
};

const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''),
});

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: Login,
  validateSearch: loginSearchSchema,
});
