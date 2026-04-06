import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { View } from 'react-native';

import { Typography } from '../../../../library/typography';
import { styles } from './grade-badge.styles';

type GradeBadgeProps = {
  grade: Climb['grade'];
  variant?: 'filled' | 'ghost';
};

const GradeBadge: FunctionComponent<GradeBadgeProps> = ({
  grade,
  variant = 'filled',
}) => {
  const gradeColor = beautifyGradeColor(grade);
  const isFilled = variant === 'filled';

  return (
    <View
      style={[
        isFilled && styles.badge,
        isFilled && { backgroundColor: gradeColor },
      ]}
    >
      <Typography
        size="callout"
        weight="bold"
        style={isFilled ? undefined : { color: gradeColor }}
        color={isFilled ? 'inverse' : undefined}
      >
        {grade}
      </Typography>
    </View>
  );
};

export default GradeBadge;
