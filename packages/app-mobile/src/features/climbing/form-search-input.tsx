import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface FormSearchInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
}

const FormSearchInput: FunctionComponent<FormSearchInputProps> = ({
  name,
  placeholder,
  ...textInputProps
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = '', onChange, onBlur } }) => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor="#999"
            {...textInputProps}
          />
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChange('')}
            >
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
});

export default FormSearchInput;
