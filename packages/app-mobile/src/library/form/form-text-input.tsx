import { FunctionComponent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import FormField from './form-field';

interface FormTextInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
  label?: string;
  required?: boolean;
  showCharacterCount?: boolean;
}

const FormTextInput: FunctionComponent<FormTextInputProps> = ({
  name,
  label,
  required = false,
  showCharacterCount = false,
  maxLength,
  ...textInputProps
}) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const value = useWatch({ control, name }) || '';
  const error = errors[name];

  const helperText =
    showCharacterCount && maxLength
      ? t('common.characters_count', { count: value.length, max: maxLength })
      : undefined;

  return (
    <FormField
      label={label}
      required={required}
      error={error?.message as string | undefined}
      helperText={helperText}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              error && value.length > 0 && styles.inputError,
            ]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            {...textInputProps}
          />
        )}
      />
    </FormField>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
});

export default FormTextInput;
