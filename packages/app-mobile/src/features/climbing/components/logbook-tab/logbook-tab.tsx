import { ClimbHistoriesGetQueryStatus } from '@jrposada/fit-log-shared/models/climb-histories/climb-histories-get';
import { useClimbHistories } from '@jrposada/fit-log-shared-react/api/climb-histories/use-climb-histories';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import Button from '../../../../library/button';
import EmptyState from '../../../../library/empty-state';
import LoadingState from '../../../../library/loading-state';
import RefetchBar from '../../../../library/refetch-bar';
import Section from '../../../../library/section';
import Separator from '../../../../library/separator';
import Tabs, { TabBarItem } from '../../../../library/tabs';
import { spacing } from '../../../../library/theme';
import { useSwipeHint } from '../../hooks/use-swipe-hint';
import ClimbCard from '../common/climb-card';
import LocationSelector from '../common/location-selector';

type StatusFilter = 'projects' | 'in-progress' | 'completed' | 'all';

const STATUS_FILTERS: Record<
  StatusFilter,
  ClimbHistoriesGetQueryStatus[] | undefined
> = {
  projects: ['project'],
  'in-progress': ['attempt', 'project'],
  completed: ['send', 'flash'],
  all: undefined,
};

interface LogbookTabProps {
  locationId: string | undefined;
  onLocationChange: (locationId: string) => void;
}

const LogbookTab: FunctionComponent<LogbookTabProps> = ({
  locationId,
  onLocationChange,
}) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('in-progress');

  const {
    items: climbHistories,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClimbHistories({
    locationId: locationId || undefined,
    status: STATUS_FILTERS[statusFilter],
  });

  const showInitialLoader = isLoading && climbHistories.length === 0;
  const showRefetchIndicator = isFetching && !isLoading && !isFetchingNextPage;

  const { shouldPeek, markShown } = useSwipeHint();

  const filterItems: TabBarItem<StatusFilter>[] = [
    { id: 'projects', label: t('climbing.logbook_filter_projects') },
    { id: 'in-progress', label: t('climbing.logbook_filter_in_progress') },
    { id: 'completed', label: t('climbing.logbook_filter_completed') },
    { id: 'all', label: t('climbing.logbook_filter_all') },
  ];

  return (
    <Section gap="md">
      <LocationSelector value={locationId || ''} onChange={onLocationChange} />

      <Separator />

      <Tabs.Bar<StatusFilter>
        items={filterItems}
        activeId={statusFilter}
        onChange={setStatusFilter}
      />

      <RefetchBar active={showRefetchIndicator} />

      <LoadingState isLoading={showInitialLoader}>
        {climbHistories.length === 0 ? (
          <EmptyState message={t('climbing.logbook_empty')} />
        ) : (
          <>
            {climbHistories.map((climbHistory, index) => (
              <ClimbCard
                key={climbHistory.id}
                climb={climbHistory.climb}
                location={climbHistory.location}
                sector={climbHistory.sector}
                history={climbHistory}
                shouldPeek={index === 0 && shouldPeek}
                onPeekDone={markShown}
              />
            ))}
            {hasNextPage && (
              <View style={{ paddingTop: spacing.sm }}>
                {isFetchingNextPage ? (
                  <ActivityIndicator />
                ) : (
                  <Button
                    title={t('actions.load_more')}
                    variant="outline"
                    onPress={() => fetchNextPage()}
                  />
                )}
              </View>
            )}
          </>
        )}
      </LoadingState>
    </Section>
  );
};

export default LogbookTab;
