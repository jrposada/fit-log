import { RouterProvider } from '@tanstack/react-router';
import { FunctionComponent, Suspense, lazy } from 'react';
import { router } from './router';
import { useSession } from './core/hooks/session/use-session';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const App: FunctionComponent = () => {
  const session = useSession();

  return (
    <>
      <RouterProvider
        router={router}
        context={{ session }}
        basepath={import.meta.env.BASE_URL}
      />
      <Suspense>
        <TanStackRouterDevtools router={router} />
      </Suspense>
    </>
  );
};

export default App;
