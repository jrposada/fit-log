import { RouterProvider } from '@tanstack/react-router';
import { FunctionComponent, Suspense, lazy } from 'react';
import { router } from './router';
import { useAuth } from './core/hooks/auth/use-auth';

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
  const auth = useAuth();

  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth }}
        basepath={import.meta.env.BASE_URL}
      />
      <Suspense>
        <TanStackRouterDevtools router={router} />
      </Suspense>
    </>
  );
};

export default App;
