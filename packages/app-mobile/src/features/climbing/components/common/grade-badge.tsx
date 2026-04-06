import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { View } from 'react-native';

import { Typography } from '../../../../library/typography';
import { styles } from './grade-badge.styles';

type GradeBadgeProps = {
  grade: Climb['grade'];
};

const GradeBadge: FunctionComponent<GradeBadgeProps> = ({ grade }) => {
  return (
    <View
      style={[styles.badge, { backgroundColor: beautifyGradeColor(grade) }]}
    >
      <Typography size="callout" color="inverse" weight="bold">
        {grade}
      </Typography>
    </View>
  );
};

export default GradeBadge;
