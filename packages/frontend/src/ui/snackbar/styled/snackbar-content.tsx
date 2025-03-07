import {
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps as MuiSnackbarContentProps,
  styled,
} from '@mui/material';
import { PropsWithChildren } from 'react';

interface SnackbarContentProps
  extends Omit<MuiSnackbarContentProps, 'variant'> {
  autoHideDuration?: number | null;
  variant?: 'error' | 'info' | 'success' | 'warning';
}

const SnackbarContent = styled(
  (props: PropsWithChildren<SnackbarContentProps>) => (
    <MuiSnackbarContent {...props} variant={undefined} />
  ),
  {}
)(({ theme, variant }) => ({
  backgroundColor:
    variant === 'error'
      ? theme.palette.error.main
      : variant === 'info'
        ? theme.palette.info.main
        : variant === 'success'
          ? theme.palette.success.main
          : variant === 'warning'
            ? theme.palette.warning.main
            : undefined,
  // TODO: add auto hide duration border
  // transition: theme.transitions.create(['width', 'margin'], {
  //     easing: theme.transitions.easing.sharp,
  //     duration: theme.transitions.duration.leavingScreen,
  // }),
}));

export default SnackbarContent;
export type { SnackbarContentProps };
