import { FunctionComponent, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { styles } from './form-field.styles';
import { useFormReadonly } from './use-form-readonly';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  readonly?: boolean;
  children: ReactNode;
}

const FormField: FunctionComponent<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  readonly,
  children,
}) => {
  const isReadonly = useFormReadonly(readonly);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}{' '}
          {required && !isReadonly && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {children}
      {!isReadonly && helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
      {!isReadonly && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormField;
