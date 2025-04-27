import { FunctionComponent } from 'react';
import Snackbar, { SnackbarProps } from './snackbar';

type WarningSnackbarProps = Omit<SnackbarProps, 'children'>;

const WarningSnackbar: FunctionComponent<WarningSnackbarProps> = (props) => {
  return <Snackbar {...props} variant="warning" />;
};

export default WarningSnackbar;
export type { WarningSnackbarProps };
