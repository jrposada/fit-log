import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Session } from '../core/hooks/session/session-context';

type RouterContext = {
  session: Session | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
