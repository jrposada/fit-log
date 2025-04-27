import { FunctionComponent } from 'react';
import Snackbar, { SnackbarProps } from './snackbar';

type SuccessSnackbarProps = Omit<SnackbarProps, 'children'>;

const SuccessSnackbar: FunctionComponent<SuccessSnackbarProps> = (props) => {
  return <Snackbar {...props} variant="success" />;
};

export default SuccessSnackbar;
export type { SuccessSnackbarProps };
