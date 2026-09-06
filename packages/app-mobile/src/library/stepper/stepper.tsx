import { FunctionComponent } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import IconButton from '../icon-button';
import Stack from '../stack';
import { Typography } from '../typography';
import { styles } from './stepper.styles';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Stepper: FunctionComponent<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  style,
}) => {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max == null || value < max);

  return (
    <Stack direction="horizontal" align="center" gap="md" style={style}>
      <IconButton
        icon="remove"
        variant="default"
        rounded
        disabled={!canDecrement}
        onPress={() => onChange(Math.max(min, value - 1))}
      />
      <Typography size="heading" weight="bold" style={styles.value}>
        {value}
      </Typography>
      <IconButton
        icon="add"
        variant="default"
        rounded
        disabled={!canIncrement}
        onPress={() =>
          onChange(max != null ? Math.min(max, value + 1) : value + 1)
        }
      />
    </Stack>
  );
};

export default Stepper;
