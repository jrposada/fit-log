import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { Text, View } from 'react-native';

import { styles } from './grade-badge.styles';

type GradeBadgeProps = {
  grade: Climb['grade'];
};

const GradeBadge: FunctionComponent<GradeBadgeProps> = ({ grade }) => {
  return (
    <View
      style={[styles.badge, { backgroundColor: beautifyGradeColor(grade) }]}
    >
      <Text style={styles.text}>{grade}</Text>
    </View>
  );
};

export default GradeBadge;
