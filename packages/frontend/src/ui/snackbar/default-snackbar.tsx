import { FunctionComponent } from 'react';
import Snackbar, { SnackbarProps } from './snackbar';

type DefaultSnackbarProps = Omit<SnackbarProps, 'children'>;

const DefaultSnackbar: FunctionComponent<DefaultSnackbarProps> = (props) => {
  return <Snackbar {...props} />;
};

export default DefaultSnackbar;
export type { DefaultSnackbarProps };
