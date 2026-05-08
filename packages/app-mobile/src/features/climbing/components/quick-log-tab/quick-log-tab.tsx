import { ClimbHistoriesGetQueryStatus } from '@shared/models/climb-history/climb-history-get';
import { useClimbHistories } from '@shared-react/api/climb-histories/use-climb-histories';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import Button from '../../../../library/button';
import EmptyState from '../../../../library/empty-state';
import LoadingState from '../../../../library/loading-state';
import Section from '../../../../library/section';
import Separator from '../../../../library/separator';
import Tabs, { TabBarItem } from '../../../../library/tabs';
import { spacing } from '../../../../library/theme';
import { useSwipeHint } from '../../hooks/use-swipe-hint';
import ClimbCard from '../common/climb-card';
import LocationSelector from '../common/location-selector';

type StatusFilter = 'in-progress' | 'completed' | 'all';

const STATUS_FILTERS: Record<
  StatusFilter,
  ClimbHistoriesGetQueryStatus[] | undefined
> = {
  'in-progress': ['attempt', 'project'],
  completed: ['send', 'flash'],
  all: undefined,
};

interface QuickLogTabProps {
  locationId: string | undefined;
  onLocationChange: (locationId: string) => void;
}

const QuickLogTab: FunctionComponent<QuickLogTabProps> = ({
  locationId,
  onLocationChange,
}) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('in-progress');

  const {
    items: climbHistories,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClimbHistories({
    locationId: locationId || undefined,
    status: STATUS_FILTERS[statusFilter],
  });

  const { shouldPeek, markShown } = useSwipeHint();

  const filterItems: TabBarItem<StatusFilter>[] = [
    { id: 'in-progress', label: t('climbing.quick_log_filter_in_progress') },
    { id: 'completed', label: t('climbing.quick_log_filter_completed') },
    { id: 'all', label: t('climbing.quick_log_filter_all') },
  ];

  return (
    <LoadingState isLoading={isLoading}>
      <Section gap="md">
        <LocationSelector
          value={locationId || ''}
          onChange={onLocationChange}
        />

        <Separator />

        <Tabs.Bar<StatusFilter>
          items={filterItems}
          activeId={statusFilter}
          onChange={setStatusFilter}
        />

        {climbHistories.length === 0 ? (
          <EmptyState message={t('climbing.quick_log_empty')} />
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
      </Section>
    </LoadingState>
  );
};

export default QuickLogTab;
