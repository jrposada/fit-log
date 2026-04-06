import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import IconCard from '../../library/icon-card';
import Screen from '../../library/screen';
import { palette, spacing } from '../../library/theme';
import { Typography } from '../../library/typography';
import { styles } from './training-screen.styles';

type TrainingCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const TrainingScreen: FunctionComponent = () => {
  const { t } = useTranslation();

  const trainingCards: TrainingCard[] = [
    {
      id: '1',
      title: t('training.workout_plans'),
      description: t('training.workout_plans_description'),
      icon: '📋',
      color: palette.green,
    },
    {
      id: '2',
      title: t('training.strength_training'),
      description: t('training.strength_training_description'),
      icon: '🏋️',
      color: palette.blue,
    },
    {
      id: '3',
      title: t('training.endurance'),
      description: t('training.endurance_description'),
      icon: '🏃',
      color: palette.amber,
    },
    {
      id: '4',
      title: t('training.flexibility'),
      description: t('training.flexibility_description'),
      icon: '🧘',
      color: palette.plum,
    },
    {
      id: '5',
      title: t('training.training_stats'),
      description: t('training.training_stats_description'),
      icon: '📈',
      color: palette.coral,
    },
    {
      id: '6',
      title: t('training.personal_records'),
      description: t('training.personal_records_description'),
      icon: '🏆',
      color: palette.gold,
    },
  ];

  return (
    <Screen padding="xl">
      <Typography
        size="display"
        style={{ marginBottom: spacing.xl, marginTop: spacing.md }}
      >
        {t('training.title')}
      </Typography>
      <View style={styles.cardsContainer}>
        {trainingCards.map((card) => (
          <IconCard
            key={card.id}
            icon={card.icon}
            color={card.color}
            title={card.title}
            subtitle={card.description}
            variant="description"
            onPress={() => {}}
          />
        ))}
      </View>
    </Screen>
  );
};

export default TrainingScreen;
