import { Box } from '@mui/material';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import { Auth } from '../core/hooks/auth/auth-context';
import AppBar from '../features/layout/app-bar';

type RouterContext = {
  auth: Auth | null;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <AppBar />
      <Box sx={{ paddingY: 2 }}>
        <Outlet />
      </Box>
    </>
  ),
});
