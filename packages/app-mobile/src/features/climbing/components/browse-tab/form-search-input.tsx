import { FunctionComponent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { Typography } from '../../../../library/typography';
import { styles } from './form-search-input.styles';

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
              <Typography size="heading" color="tertiary" weight="regular">
                ×
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
};

export default FormSearchInput;
