import { FunctionComponent } from 'react';
import Snackbar, { SnackbarProps } from './snackbar';

type ErrorSnackbarProps = Omit<SnackbarProps, 'children'>;

const ErrorSnackbar: FunctionComponent<ErrorSnackbarProps> = (props) => {
  return <Snackbar {...props} variant="error" />;
};

export default ErrorSnackbar;
export type { ErrorSnackbarProps };
