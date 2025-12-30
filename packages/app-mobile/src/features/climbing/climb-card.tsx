import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Climb } from '@shared/models/climb/climb';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ClimbingParamList } from '../../types/routes';

type Data = Omit<Climb, 'image' | 'location'> & {
  image: string;
  location: string;
};

export interface ClimbCardProps {
  climb: Data;
  onLog: (climb: Data) => void;
  logDisabled: boolean;
}

type ClimbCardNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

const ClimbCard: FunctionComponent<ClimbCardProps> = ({
  climb,
  onLog,
  logDisabled,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbCardNavigationProp>();

  const handleClimbPress = () => {
    navigation.navigate('ClimbDetail', { climbId: climb.id });
  };

  const handleLogPress = () => {
    onLog(climb);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Pressable onPress={handleClimbPress}>
          <Text style={styles.title}>
            <Text style={{ color: beautifyGradeColor(climb.grade) }}>
              ● {climb.grade}
            </Text>{' '}
            | {climb.name}
          </Text>
        </Pressable>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.sector}>{climb.sector.name}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLogPress}
          disabled={logDisabled}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{t('climbing.log_action')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sector: {
    fontSize: 13,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#1b5e20',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ClimbCard;
