import { Snackbar } from '@mui/material';
import { CustomContentProps } from 'notistack';
import { forwardRef } from 'react';
import SnackbarContent from './styled/snackbar-content';

type InfoSnackbarProps = Omit<CustomContentProps, 'children'>;

const InfoSnackbar = forwardRef<HTMLDivElement, InfoSnackbarProps>(
  ({ action, id, ...props }, ref) => {
    return (
      <SnackbarContent
        {...props}
        action={typeof action === 'function' ? action(id) : action}
        id={`${id}`}
        ref={ref}
        variant="info"
      >
        <Snackbar />;
      </SnackbarContent>
    );
  }
);

export default InfoSnackbar;
export type { InfoSnackbarProps };
