import { createRoute } from '@tanstack/react-router';
import Dashboard from './features/dashboard/dashboard';
import Login from './features/login/login';
import { rootRoute } from './root-route';

export const routes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: Dashboard,
  }),
];
