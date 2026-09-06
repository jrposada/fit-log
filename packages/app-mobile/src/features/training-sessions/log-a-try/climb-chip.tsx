import { useClimbsById } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-by-id';
import { FunctionComponent } from 'react';

import Button from '../../../library/button';

export interface ClimbChipProps {
  climbId: string;
  selected: boolean;
  onPress: () => void;
}

const ClimbChip: FunctionComponent<ClimbChipProps> = ({
  climbId,
  selected,
  onPress,
}) => {
  const { data: climb } = useClimbsById({ id: climbId });

  if (!climb) {
    return null;
  }

  return (
    <Button
      title={`${climb.grade} ${climb.name}`}
      variant={selected ? 'primary' : 'outline'}
      size="sm"
      onPress={onPress}
    />
  );
};

export default ClimbChip;
