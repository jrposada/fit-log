import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default GradeBadge;
