import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import Select from '../../../library/select';
import { ClimbingParamList } from '../../../types/routes';

type LocationSelectorNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

export interface LocationSelectorProps {
  locations: string[];
  value: string;
  onChange: (loc: string) => void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = ({
  locations,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<LocationSelectorNavigationProp>();

  const handleAddNew = (newLocationName: string) => {
    navigation.navigate('CreateLocation', { initialName: newLocationName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('climbing.current_location')}</Text>
      <Select
        options={locations}
        value={value}
        onChange={onChange}
        onAddNew={handleAddNew}
        placeholder={t('climbing.select_location')}
        searchPlaceholder={t('climbing.search_location')}
        addButtonLabel={t('actions.add')}
        closeButtonLabel={t('actions.close')}
        emptyStateMessage={t('climbing.no_locations_found')}
        allowAddNew
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
});

export default LocationSelector;
