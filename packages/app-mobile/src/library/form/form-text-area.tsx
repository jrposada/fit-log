import { FunctionComponent } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextInput, TextInputProps } from 'react-native';

import FormField from './form-field';
import { styles } from './form-text-area.styles';
import { useFormReadonly } from './use-form-readonly';

interface FormTextAreaProps
  extends Omit<
    TextInputProps,
    'value' | 'onChangeText' | 'onBlur' | 'multiline'
  > {
  name: string;
  label?: string;
  required?: boolean;
  readonly?: boolean;
  showCharacterCount?: boolean;
  numberOfLines?: number;
}

const FormTextArea: FunctionComponent<FormTextAreaProps> = ({
  name,
  label,
  required = false,
  readonly,
  showCharacterCount = true,
  maxLength,
  numberOfLines = 4,
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
      ? t('common.characters_count', {
          count: value.length ?? 0,
          max: maxLength,
        })
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
              styles.textArea,
              isReadonly && styles.inputReadonly,
            ]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={isReadonly ? undefined : numberOfLines}
            maxLength={maxLength}
            textAlignVertical="top"
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

export default FormTextArea;
