import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type SuccessSnackbarProps = Omit<CustomContentProps, 'children'>;

const SuccessSnackbar = forwardRef<HTMLDivElement, SuccessSnackbarProps>(
  ({ action, id, ...props }, ref) => {
    return (
      <SnackbarContent
        {...props}
        action={typeof action === 'function' ? action(id) : action}
        id={`${id}`}
        ref={ref}
        variant="success"
      >
        <Snackbar />;
      </SnackbarContent>
    );
  }
);

export default SuccessSnackbar;
export type { SuccessSnackbarProps };
