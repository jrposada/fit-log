import { useClimbsSearch } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-search';
import { useDebounce } from '@jrposada/fit-log-shared-react/hooks/use-debounce';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';

import { Icon } from '../../../library/icon';
import Stack from '../../../library/stack';
import { ink } from '../../../library/theme';
import { Typography } from '../../../library/typography';
import GradeBadge from '../../climbing/components/common/grade-badge';
import { ActiveTrainingSession } from '../active-training-session/active-training-session';
import ClimbChip from './climb-chip';
import { styles } from './log-a-try-climb-picker.styles';
import { LogATryClimbSelection } from './log-a-try-climb-selection';

export interface LogATryClimbPickerProps {
  session: ActiveTrainingSession;
  selection: LogATryClimbSelection | null;
  onSelect: (selection: LogATryClimbSelection) => void;
}

const LogATryClimbPicker: FunctionComponent<LogATryClimbPickerProps> = ({
  session,
  selection,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: results } = useClimbsSearch({
    search: debouncedSearch.trim() || undefined,
    locationId: session.location?.id,
    limit: 10,
  });

  const handleSelectResult = (result: {
    id: string;
    location: { id: string };
    sector: { id: string };
  }) => {
    onSelect({
      climbId: result.id,
      locationId: result.location.id,
      sectorId: result.sector.id,
    });
    setIsSearching(false);
    setSearch('');
  };

  return (
    <Stack gap="sm">
      <Stack direction="horizontal" style={styles.chipsRow}>
        {session.climbHistories.map((history) => (
          <ClimbChip
            key={history.climb}
            climbId={history.climb}
            selected={selection?.climbId === history.climb}
            onPress={() =>
              onSelect({
                climbId: history.climb,
                locationId: history.location,
                sectorId: history.sector,
              })
            }
          />
        ))}
        <TouchableOpacity onPress={() => setIsSearching((prev) => !prev)}>
          <Typography color="accent" weight="semibold">
            {t('climbing.log_a_try_search_new_climb')}
          </Typography>
        </TouchableOpacity>
      </Stack>

      {isSearching && (
        <Stack gap="sm">
          <Stack direction="horizontal" align="center" style={styles.searchRow}>
            <Icon icon="search" size="sm" color={ink.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('climbing.log_a_try_search_placeholder')}
              placeholderTextColor={ink.tertiary}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
          </Stack>
          <FlatList
            style={styles.resultsList}
            data={results ?? []}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Typography color="secondary" align="center">
                {t('climbing.log_a_try_search_empty')}
              </Typography>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelectResult(item)}
              >
                <GradeBadge grade={item.grade} />
                <Stack gap="2xs" flex>
                  <Typography weight="semibold">{item.name}</Typography>
                  <Typography size="callout" color="secondary">
                    {item.location.name} · {item.sector.name}
                  </Typography>
                </Stack>
              </TouchableOpacity>
            )}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default LogATryClimbPicker;
