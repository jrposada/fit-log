import { FunctionComponent, ReactNode } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

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
    <Animated.View layout={LinearTransition} style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}{' '}
          {required && !isReadonly && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {children}
      {!isReadonly && helperText && !error && (
        <Animated.Text
          entering={FadeIn.duration(200)}
          style={styles.helperText}
        >
          {helperText}
        </Animated.Text>
      )}
      {!isReadonly && error && (
        <Animated.Text entering={FadeIn.duration(200)} style={styles.errorText}>
          {error}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export default FormField;
