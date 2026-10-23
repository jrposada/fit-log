import {
  ItemLogSetField,
  parseSetValue,
} from '@jrposada/fit-log-shared/common/training-plans/item-logging';
import {
  TrainingSessionItemLogSet,
  TrainingSessionItemLogStatus,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardTypeOptions, TextInput } from 'react-native';

import Button from '../../library/button';
import IconButton from '../../library/icon-button';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';
import { styles } from './planned-item-log.styles';

const KEYBOARD_TYPES: Record<ItemLogSetField, KeyboardTypeOptions> = {
  reps: 'number-pad',
  // Negative load is pulley assist; the decimal pad has no minus key on iOS.
  weightKg: 'numbers-and-punctuation',
  holdS: 'decimal-pad',
  durationMin: 'decimal-pad',
  rpe: 'decimal-pad',
};

type PlannedItemLogProps = {
  title: string;
  /** Formatted effective prescription. */
  summary: string;
  fields: ItemLogSetField[];
  status?: TrainingSessionItemLogStatus;
  sets: TrainingSessionItemLogSet[];
  onToggleStatus: (status: TrainingSessionItemLogStatus) => void;
  onChangeSets: (sets: TrainingSessionItemLogSet[]) => void;
};

const PlannedItemLog: FunctionComponent<PlannedItemLogProps> = ({
  title,
  summary,
  fields,
  status,
  sets,
  onToggleStatus,
  onChangeSets,
}) => {
  const { t } = useTranslation();

  const handleEndEditing = (
    index: number,
    field: ItemLogSetField,
    text: string
  ) => {
    const value = parseSetValue(field, text);
    if (value === sets[index]?.[field]) {
      return;
    }
    onChangeSets(
      sets.map((set, setIndex) =>
        setIndex === index ? { ...set, [field]: value } : set
      )
    );
  };

  return (
    <Stack gap="xs">
      <Stack direction="horizontal" align="center" gap="sm">
        <Stack gap="0" flex>
          <Typography size="body" weight="semibold">
            {title}
          </Typography>
          {summary !== '' && (
            <Typography size="caption" color="secondary">
              {summary}
            </Typography>
          )}
        </Stack>
        <IconButton
          icon="check"
          size="sm"
          variant={status === 'done' ? 'primary' : 'default'}
          onPress={() => onToggleStatus('done')}
        />
        <IconButton
          icon="skip-next"
          size="sm"
          variant={status === 'skipped' ? 'accent' : 'default'}
          onPress={() => onToggleStatus('skipped')}
        />
      </Stack>

      {status !== 'skipped' && fields.length > 0 && (
        <Stack gap="xs">
          {sets.map((set, index) => (
            <Stack key={index} direction="horizontal" align="center" gap="xs">
              <Typography
                size="caption"
                color="tertiary"
                style={styles.setIndex}
              >
                {index + 1}
              </Typography>
              {fields.map((field) => (
                <Stack
                  key={field}
                  direction="horizontal"
                  align="center"
                  gap="2xs"
                  flex
                >
                  <TextInput
                    // Remount when the saved value changes so the
                    // uncontrolled input shows it.
                    key={`${field}-${set[field]}`}
                    style={styles.input}
                    defaultValue={set[field]?.toString() ?? ''}
                    keyboardType={KEYBOARD_TYPES[field]}
                    selectTextOnFocus
                    onEndEditing={(event) =>
                      handleEndEditing(index, field, event.nativeEvent.text)
                    }
                  />
                  <Typography size="caption" color="tertiary">
                    {t(`training_plans.set_field_${field}`)}
                  </Typography>
                </Stack>
              ))}
              <IconButton
                icon="close"
                size="sm"
                variant="ghost"
                onPress={() =>
                  onChangeSets(sets.filter((_, setIndex) => setIndex !== index))
                }
              />
            </Stack>
          ))}
          <Button
            title={t('training_plans.add_set')}
            icon="add"
            size="sm"
            variant="ghost"
            onPress={() =>
              onChangeSets([...sets, { ...sets[sets.length - 1] }])
            }
          />
        </Stack>
      )}
    </Stack>
  );
};

export default PlannedItemLog;
