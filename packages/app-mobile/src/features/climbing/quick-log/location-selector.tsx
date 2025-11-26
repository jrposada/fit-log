import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Location } from '@shared/models/location';
import { useClimbs } from '@shared-react/api/climbs/use-climbs';
import { useSectors } from '@shared-react/api/sectors/use-sectors';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Select from '../../../library/select';
import { ClimbingParamList } from '../../../types/routes';

type LocationSelectorNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

export interface LocationSelectorProps {
  locations: Location[];
  value: string;
  onChange: (locationId: string) => void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = ({
  locations,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<LocationSelectorNavigationProp>();
  const { data: allClimbs = [] } = useClimbs();

  const selectedLocation = locations.find((loc) => loc.id === value);

  const { data: sectors = [] } = useSectors({
    locationId: selectedLocation?.id || '',
  });

  const climbsForLocation = useMemo(
    () => allClimbs.filter((climb) => climb.location === selectedLocation?.id),
    [allClimbs, selectedLocation?.id]
  );

  const handleAddNew = (newLocationName: string) => {
    navigation.navigate('CreateLocation', { initialName: newLocationName });
  };

  const handleEditLocation = () => {
    if (selectedLocation) {
      navigation.navigate('CreateLocation', {
        locationId: selectedLocation.id,
      });
    }
  };

  const renderSelectedValue = () => {
    if (!selectedLocation) {
      return null;
    }

    return (
      <View style={styles.selectedContainer}>
        <View style={styles.selectedTextContainer}>
          <Text style={styles.selectedStats}>
            {t('climbing.climbs_count', { count: climbsForLocation.length })} •{' '}
            {t('climbing.sectors_count', { count: sectors.length })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{t('climbing.current_location')}</Text>
        {selectedLocation && (
          <TouchableOpacity
            onPress={handleEditLocation}
            style={styles.editButton}
            activeOpacity={0.6}
          >
            <Text style={styles.editButtonText}>✏️ {t('actions.edit')}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.selectWrapper}>
        <Select
          options={locations.map((loc) => loc.name)}
          value={selectedLocation?.name || ''}
          onChange={(name) => {
            const loc = locations.find((l) => l.name === name);
            if (loc) onChange(loc.id);
          }}
          onAddNew={handleAddNew}
          placeholder={t('climbing.select_location')}
          searchPlaceholder={t('climbing.search_location')}
          addButtonLabel={t('actions.add')}
          closeButtonLabel={t('actions.close')}
          emptyStateMessage={t('climbing.no_locations_found')}
          allowAddNew
        />
      </View>
      {selectedLocation && (
        <View style={styles.infoContainer}>{renderSelectedValue()}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 13,
    color: '#2962ff',
    fontWeight: '500',
  },
  selectWrapper: {
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTextContainer: {
    flex: 1,
  },
  selectedStats: {
    fontSize: 13,
    color: '#666',
  },
  placeholderText: {
    fontSize: 15,
    color: '#999',
  },
});

export default LocationSelector;
