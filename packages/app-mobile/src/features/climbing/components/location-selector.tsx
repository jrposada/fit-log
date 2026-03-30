import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocations } from '@shared-react/api/locations/use-locations';
import { FunctionComponent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import Button from '../../../library/button';
import Card from '../../../library/card';
import LoadingState from '../../../library/loading-state';
import Section from '../../../library/section';
import Select from '../../../library/select';
import { colors } from '../../../library/theme';
import { ClimbingParamList } from '../types';

type LocationSelectorNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

export interface LocationSelectorProps {
  value: string;
  onChange: (locationId: string) => void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<LocationSelectorNavigationProp>();

  const { data: locations = [], isLoading: isLoadingLocations } =
    useLocations();

  const selectedLocation = locations.find((loc) => loc.id === value);

  const numSectors = useMemo(
    () => selectedLocation?.sectors.length ?? 0,
    [selectedLocation]
  );
  const numClimbs = useMemo(
    () =>
      selectedLocation?.sectors.reduce<number>(
        (reduced, sector) => reduced + sector.climbs.length,
        0
      ) ?? 0,
    [selectedLocation]
  );

  const handleAddNew = (newLocationName: string) => {
    navigation.navigate('LocationDetail', { initialName: newLocationName });
  };

  const handleEditLocation = () => {
    if (selectedLocation) {
      navigation.navigate('LocationDetail', {
        locationId: selectedLocation.id,
      });
    }
  };

  return (
    <LoadingState isLoading={isLoadingLocations}>
      <Section title={t('climbing.current_location')} gap="sm">
        <Select
          options={locations.map((loc) => loc.name)}
          value={selectedLocation?.name || ''}
          onChange={(name) => {
            const loc = locations.find((l) => l.name === name);
            if (loc) onChange(loc.id);
          }}
          onAddNew={handleAddNew}
          onClear={() => onChange('')}
          placeholder={t('climbing.select_location')}
          searchPlaceholder={t('climbing.search_location')}
          addButtonLabel={t('actions.add')}
          closeButtonLabel={t('actions.close')}
          emptyStateMessage={t('climbing.no_locations_found')}
          allowAddNew
        />
        {selectedLocation && (
          <Card variant="subdued" direction="horizontal">
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>
              {t('climbing.climbs_count', { count: numClimbs })} •{' '}
              {t('climbing.sectors_count', { count: numSectors })}
            </Text>
            <Button
              title={t('actions.edit')}
              icon="✏️"
              variant="ghost"
              size="sm"
              onPress={handleEditLocation}
            />
          </Card>
        )}
      </Section>
    </LoadingState>
  );
};

export default LocationSelector;
