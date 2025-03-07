import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type WarningSnackbarProps = Omit<CustomContentProps, 'children'>;

const WarningSnackbar = forwardRef<HTMLDivElement, WarningSnackbarProps>(
  ({ action, id, ...props }, ref) => {
    return (
      <SnackbarContent
        {...props}
        action={typeof action === 'function' ? action(id) : action}
        id={`${id}`}
        ref={ref}
        variant="warning"
      >
        <Snackbar />;
      </SnackbarContent>
    );
  }
);

export default WarningSnackbar;
export type { WarningSnackbarProps };
