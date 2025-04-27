import { FunctionComponent } from 'react';
import Snackbar, { SnackbarProps } from './snackbar';

type InfoSnackbarProps = Omit<SnackbarProps, 'children'>;

const InfoSnackbar: FunctionComponent<InfoSnackbarProps> = (props) => {
  return <Snackbar {...props} variant="info" />;
};

export default InfoSnackbar;
export type { InfoSnackbarProps };
