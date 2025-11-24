import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type DashboardCard = {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
};

const HomeScreen: FunctionComponent = () => {
  const { t } = useTranslation();

  const dashboardCards: DashboardCard[] = [
    {
      id: '1',
      title: t('home.total_workouts'),
      value: '42',
      icon: '💪',
      color: '#4CAF50',
    },
    {
      id: '2',
      title: t('home.this_week'),
      value: '5',
      icon: '📅',
      color: '#2196F3',
    },
    {
      id: '3',
      title: t('home.current_streak'),
      value: '7 days',
      icon: '🔥',
      color: '#FF9800',
    },
    {
      id: '4',
      title: t('home.total_time'),
      value: '24h 30m',
      icon: '⏱️',
      color: '#9C27B0',
    },
    {
      id: '5',
      title: t('home.climbs_completed'),
      value: '128',
      icon: '🧗',
      color: '#F44336',
    },
    {
      id: '6',
      title: t('home.personal_best'),
      value: 'V7',
      icon: '🏆',
      color: '#FFD700',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('home.title')}</Text>
      <View style={styles.cardsContainer}>
        {dashboardCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { borderLeftColor: card.color }]}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={[styles.cardValue, { color: card.color }]}>
                {card.value}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  cardsContainer: {
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
