import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type ErrorSnackbarProps = Omit<CustomContentProps, 'children'>;

const ErrorSnackbar = forwardRef<HTMLDivElement, ErrorSnackbarProps>(
  ({ action, id, ...props }, ref) => {
    return (
      <SnackbarContent
        {...props}
        action={typeof action === 'function' ? action(id) : action}
        id={`${id}`}
        ref={ref}
        variant="error"
      >
        <Snackbar />;
      </SnackbarContent>
    );
  }
);

export default ErrorSnackbar;
export type { ErrorSnackbarProps };
