import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import Select from '../../../library/select';
import CreateLocationForm from './create-location-form';

export interface LocationSelectorProps {
  locations: string[];
  value: string;
  onChange: (loc: string) => void;
  onAddNew: (location: string) => void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = ({
  locations,
  value,
  onChange,
  onAddNew,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('climbing.current_location')}</Text>
      <Select
        options={locations}
        value={value}
        onChange={onChange}
        onAddNew={onAddNew}
        placeholder={t('climbing.select_location')}
        searchPlaceholder={t('climbing.search_location')}
        addButtonLabel={t('actions.add')}
        closeButtonLabel={t('actions.close')}
        emptyStateMessage={t('climbing.no_locations_found')}
        allowAddNew
        renderCreateForm={(props) => <CreateLocationForm {...props} />}
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
