import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import Card from '../../library/card';
import ScreenContainer from '../../library/screen-container';
import { styles } from './home-screen.styles';

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
    <ScreenContainer>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <Card
              key={card.id}
              variant="elevatedStrong"
              borderLeftColor={card.color}
              onPress={() => {}}
              style={styles.card}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={[styles.cardValue, { color: card.color }]}>
                  {card.value}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default HomeScreen;
