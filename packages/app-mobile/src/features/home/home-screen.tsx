import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import IconCard from '../../library/icon-card';
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
            <IconCard
              key={card.id}
              icon={card.icon}
              color={card.color}
              title={card.title}
              subtitle={card.value}
              variant="stat"
              onPress={() => {}}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default HomeScreen;
