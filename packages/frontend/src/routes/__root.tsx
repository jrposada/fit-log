import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Auth } from '../core/hooks/auth/auth-context';
import AppBar from '../features/layout/app-bar';
import { Box } from '@mui/material';

type RouterContext = {
  auth: Auth | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <AppBar />
      <Box sx={{ paddingY: 1 }}>
        <Outlet />
      </Box>
    </>
  ),
});
