import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Route {
  id: string;
  grade: string; // e.g. V4
  name: string;
  section: string; // wall area
  color: string; // UI color indicator
}

export interface RouteCardProps {
  route: Route;
  onLog: (id: string) => void;
}

const RouteCard: FunctionComponent<RouteCardProps> = ({ route, onLog }) => {
  const { t } = useTranslation();

  const handlePress = () => {
    onLog(route.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>
          <Text style={{ color: route.color }}>● {route.grade}</Text> |{' '}
          {route.name}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.section}>{route.section}</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handlePress}
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
  section: {
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

export default RouteCard;
