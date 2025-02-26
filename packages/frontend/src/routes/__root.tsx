import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Session } from '../core/hooks/session/session-context';

type RouterContext = {
  session: Session;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
