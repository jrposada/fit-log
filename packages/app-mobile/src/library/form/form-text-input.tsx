import { FunctionComponent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput, TextInputProps } from 'react-native';

import FormField from './form-field';
import { styles } from './form-text-input.styles';

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

export default FormTextInput;
