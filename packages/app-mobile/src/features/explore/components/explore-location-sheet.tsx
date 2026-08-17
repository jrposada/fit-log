import { Location } from '@jrposada/fit-log-shared/models/locations/location';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';

import { Icon } from '../../../library/icon';
import IconButton from '../../../library/icon-button';
import Modal from '../../../library/modal';
import Stack from '../../../library/stack';
import { accent, ink } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import { RootStackParamList } from '../../../types/routes';
import { styles } from './explore-location-sheet.styles';

interface ExploreLocationSheetProps {
  visible: boolean;
  onClose: () => void;
  locations: Location[];
  isLoading: boolean;
  selectedLocationId: string;
  onChange: (locationId: string) => void;
}

const ExploreLocationSheet: FunctionComponent<ExploreLocationSheetProps> = ({
  visible,
  onClose,
  locations,
  selectedLocationId,
  onChange,
}) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter((location) =>
      location.name.toLowerCase().includes(query)
    );
  }, [locations, search]);

  const handleSelect = (locationId: string) => {
    onChange(locationId === selectedLocationId ? '' : locationId);
    onClose();
  };

  const handleCreateNew = () => {
    onClose();
    navigation.navigate('LocationDetail', { initialName: search.trim() });
  };

  return (
    <Modal.Root visible={visible} onClose={onClose}>
      <Modal.Header>
        <Stack gap="md">
          <Stack direction="horizontal" align="center" justify="between">
            <Typography size="title">
              {t('explore.location_sheet_title')}
            </Typography>
            <IconButton icon="close" variant="ghost" onPress={onClose} />
          </Stack>
          <View style={styles.searchRow}>
            <Icon icon="search" size="sm" color={ink.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('explore.location_sheet_search_placeholder')}
              placeholderTextColor={ink.tertiary}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </Stack>
      </Modal.Header>
      <Modal.Body>
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Typography color="secondary" align="center">
              {t('explore.location_sheet_empty')}
            </Typography>
          }
          renderItem={({ item }) => {
            const isSelected = item.id === selectedLocationId;
            return (
              <TouchableOpacity
                style={[styles.row, isSelected && styles.rowSelected]}
                onPress={() => handleSelect(item.id)}
              >
                <Stack direction="horizontal" align="center" gap="sm">
                  <Icon
                    icon="location-on"
                    size="sm"
                    color={isSelected ? accent.primary : ink.secondary}
                  />
                  <Stack gap="2xs">
                    <Typography
                      weight="semibold"
                      color={isSelected ? 'accent' : 'primary'}
                    >
                      {item.name}
                    </Typography>
                    <Typography size="callout" color="secondary">
                      {t('explore.pin_sectors', {
                        count: item.sectors.length,
                      })}
                    </Typography>
                  </Stack>
                </Stack>
                {isSelected && (
                  <Icon icon="check" size="sm" color={accent.primary} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Icon icon="add" size="sm" color={ink.primary} />
          <Typography weight="semibold">
            {t('explore.location_sheet_create_new')}
          </Typography>
        </TouchableOpacity>
      </Modal.Footer>
    </Modal.Root>
  );
};

export default ExploreLocationSheet;
