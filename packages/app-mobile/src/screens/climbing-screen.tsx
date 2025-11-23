import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ClimbingCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

const ClimbingScreen: FunctionComponent = () => {
  const { t } = useTranslation();

  const climbingCards: ClimbingCard[] = [
    {
      id: '1',
      title: t('climbing.recent_boulders'),
      description: t('climbing.recent_boulders_description'),
      icon: '🧗‍♂️',
      color: '#4CAF50',
    },
    {
      id: '2',
      title: t('climbing.log_new_boulder'),
      description: t('climbing.log_new_boulder_description'),
      icon: '📷',
      color: '#2196F3',
    },
    {
      id: '3',
      title: t('climbing.progress_tracker'),
      description: t('climbing.progress_tracker_description'),
      icon: '📊',
      color: '#FF9800',
    },
    {
      id: '4',
      title: t('climbing.favorite_routes'),
      description: t('climbing.favorite_routes_description'),
      icon: '⭐',
      color: '#9C27B0',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('climbing.title')}</Text>
      <View style={styles.cardsContainer}>
        {climbingCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: card.color }]}
          >
            <Text style={styles.cardIcon}>{card.icon}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
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
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});

export default ClimbingScreen;
