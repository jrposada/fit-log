import { FunctionComponent, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}

const FormField: FunctionComponent<FormFieldProps> = ({
  label,
  required = false,
  error,
  helperText,
  children,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {children}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  required: {
    color: '#ff3b30',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 4,
  },
});

export default FormField;
