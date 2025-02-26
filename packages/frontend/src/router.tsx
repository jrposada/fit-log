import { createRouter } from '@tanstack/react-router';
import { defaultSession } from './core/hooks/session/session-context';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
  routeTree,
  context: {
    session: defaultSession,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
