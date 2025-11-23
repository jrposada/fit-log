import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBouldersByid } from '@shared-react/api/boulders/use-boulders-by-id';
import { useBouldersDelete } from '@shared-react/api/boulders/use-boulders-delete';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { RootStackParamList } from '../types/routes';

type BoulderDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BoulderDetails'>;
  route: RouteProp<RootStackParamList, 'BoulderDetails'>;
};

const BoulderDetailsScreen: FunctionComponent<BoulderDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { boulderId } = route.params;
  const { data: boulder, isLoading } = useBouldersByid({
    id: boulderId,
  });
  const { mutate: deleteBoulder, isPending } = useBouldersDelete({
    onSuccess: () => {
      Alert.alert(
        t('boulder.delete_success_title'),
        t('boulder.delete_success_message'),
        [{ text: t('actions.ok'), onPress: () => navigation.navigate('Home') }]
      );
    },
    onError: (error) => {
      Alert.alert(t('boulder.delete_error_title'), error);
    },
  });

  if (isLoading) {
    return <Text>{t('loading')}</Text>;
  }

  if (!boulder) {
    return <Text>{t('boulder.not_found')}</Text>;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: boulder.image }} style={styles.image} />
      <Text style={styles.date}>
        {new Date(boulder.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.holds}>
        {t('boulder.holds_label', { count: boulder.holds.length })}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteBoulder(boulderId)}
        disabled={isPending}
      >
        <Text style={styles.deleteButtonText}>
          {t('boulder.delete_button')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: 300, height: 300, marginBottom: 16 },
  date: { fontSize: 16, marginBottom: 8 },
  holds: { fontSize: 16, marginBottom: 16 },
  deleteButton: { backgroundColor: 'red', padding: 12, borderRadius: 8 },
  deleteButtonText: { color: 'white', fontWeight: 'bold' },
});

export default BoulderDetailsScreen;
