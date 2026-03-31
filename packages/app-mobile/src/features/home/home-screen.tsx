import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import IconCard from '../../library/icon-card';
import Screen from '../../library/screen';
import { palette } from '../../library/theme';
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
      color: palette.green,
    },
    {
      id: '2',
      title: t('home.this_week'),
      value: '5',
      icon: '📅',
      color: palette.blue,
    },
    {
      id: '3',
      title: t('home.current_streak'),
      value: '7 days',
      icon: '🔥',
      color: palette.amber,
    },
    {
      id: '4',
      title: t('home.total_time'),
      value: '24h 30m',
      icon: '⏱️',
      color: palette.plum,
    },
    {
      id: '5',
      title: t('home.climbs_completed'),
      value: '128',
      icon: '🧗',
      color: palette.coral,
    },
    {
      id: '6',
      title: t('home.personal_best'),
      value: 'V7',
      icon: '🏆',
      color: palette.gold,
    },
  ];

  return (
    <Screen contentStyle={styles.container}>
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
    </Screen>
  );
};

export default HomeScreen;
