import { FunctionComponent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import FormField from './form-field';

interface FormTextAreaProps
  extends Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'onBlur' | 'multiline'
  > {
  name: string;
  label?: string;
  required?: boolean;
  showCharacterCount?: boolean;
  numberOfLines?: number;
}

const FormTextArea: FunctionComponent<FormTextAreaProps> = ({
  name,
  label,
  required = false,
  showCharacterCount = true,
  maxLength,
  numberOfLines = 4,
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
      ? t('common.characters_count', {
          count: value.length ?? 0,
          max: maxLength,
        })
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
            style={[styles.input, styles.textArea]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            textAlignVertical="top"
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
  textArea: {
    minHeight: 100,
  },
});

export default FormTextArea;
