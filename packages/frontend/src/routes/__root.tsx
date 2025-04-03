import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Auth } from '../core/hooks/auth/auth-context';

type RouterContext = {
  auth: Auth | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
