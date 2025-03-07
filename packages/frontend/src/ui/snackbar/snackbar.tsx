import { Snackbar as MuiSnackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type SnackbarProps = Omit<CustomContentProps, 'children'>;

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  ({ action, id, ...props }, ref) => {
    return (
      <SnackbarContent
        {...props}
        action={typeof action === 'function' ? action(id) : action}
        id={`${id}`}
        ref={ref}
        variant={undefined}
      >
        <MuiSnackbar />;
      </SnackbarContent>
    );
  }
);

export default Snackbar;
export type { SnackbarProps };
