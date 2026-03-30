import { FunctionComponent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput, TextInputProps } from 'react-native';

import FormField from './form-field';
import { styles } from './form-text-input.styles';
import { useFormReadonly } from './use-form-readonly';

interface FormTextInputProps
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  name: string;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  showCharacterCount?: boolean;
}

const FormTextInput: FunctionComponent<FormTextInputProps> = ({
  name,
  label,
  required = false,
  readonly,
  showCharacterCount = false,
  maxLength,
  ...textInputProps
}) => {
  const { t } = useTranslation();
  const isReadonly = useFormReadonly(readonly);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const value = useWatch({ control, name }) || '';
  const error = errors[name];

  const helperText =
    !isReadonly && showCharacterCount && maxLength
      ? t('common.characters_count', { count: value.length, max: maxLength })
      : undefined;

  return (
    <FormField
      label={label}
      required={required}
      readonly={isReadonly}
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
              isReadonly && styles.inputReadonly,
              !isReadonly && error && value.length > 0 && styles.inputError,
            ]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            editable={!isReadonly}
            pointerEvents={isReadonly ? 'none' : 'auto'}
            caretHidden={isReadonly}
            {...textInputProps}
          />
        )}
      />
    </FormField>
  );
};

export default FormTextInput;
