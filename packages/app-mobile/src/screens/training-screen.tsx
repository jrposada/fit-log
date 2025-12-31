import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('training.title')}</Text>
      <View style={styles.cardsContainer}>
        {trainingCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { borderLeftColor: card.color }]}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: card.color }]}>
                {card.title}
              </Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default TrainingScreen;
