import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import IconCard from '../../library/icon-card';
import ScreenContainer from '../../library/screen-container';
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
      color: '#4CAF50',
    },
    {
      id: '2',
      title: t('training.strength_training'),
      description: t('training.strength_training_description'),
      icon: '🏋️',
      color: '#2196F3',
    },
    {
      id: '3',
      title: t('training.endurance'),
      description: t('training.endurance_description'),
      icon: '🏃',
      color: '#FF9800',
    },
    {
      id: '4',
      title: t('training.flexibility'),
      description: t('training.flexibility_description'),
      icon: '🧘',
      color: '#9C27B0',
    },
    {
      id: '5',
      title: t('training.training_stats'),
      description: t('training.training_stats_description'),
      icon: '📈',
      color: '#F44336',
    },
    {
      id: '6',
      title: t('training.personal_records'),
      description: t('training.personal_records_description'),
      icon: '🏆',
      color: '#FFD700',
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{t('training.title')}</Text>
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
      </ScrollView>
    </ScreenContainer>
  );
};

export default TrainingScreen;
