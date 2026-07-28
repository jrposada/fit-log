import { SPORTS } from '@jrposada/fit-log-shared/common/sports/sports';
import { useFeed } from '@jrposada/fit-log-shared-react/api/feed/use-feed';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import Button from '../../library/button';
import EmptyState from '../../library/empty-state';
import LoadingState from '../../library/loading-state';
import RefetchBar from '../../library/refetch-bar';
import Screen from '../../library/screen';
import Section from '../../library/section';
import Tabs, { TabBarItem } from '../../library/tabs';
import { spacing } from '../../library/theme';
import FeedRow from '../feed/components/feed-row';
import { SportFilter } from '../feed/sport-filter-context';
import { useSportFilter } from '../feed/use-sport-filter';

const HistoryScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const { sportFilter, setSportFilter } = useSportFilter();

  const {
    items: sessions,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed({ sport: sportFilter === 'all' ? undefined : sportFilter });

  const showInitialLoader = isLoading && sessions.length === 0;
  const showRefetchIndicator = isFetching && !isLoading && !isFetchingNextPage;

  const filterItems: TabBarItem<SportFilter>[] = [
    { id: 'all', label: t('common.filter_all') },
    ...SPORTS.map((sport) => ({ id: sport, label: t(`${sport}.title`) })),
  ];

  return (
    <Screen stickyHeaderIndices={[0]}>
      <Tabs.Bar<SportFilter>
        items={filterItems}
        activeId={sportFilter}
        onChange={setSportFilter}
      />

      <Section gap="md">
        <RefetchBar active={showRefetchIndicator} />

        <LoadingState isLoading={showInitialLoader}>
          {sessions.length === 0 ? (
            <EmptyState message={t('history.empty')} />
          ) : (
            <>
              {sessions.map((session) => (
                <FeedRow key={session.id} session={session} />
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
        {/* Spacer so the last row isn't hidden behind the central FAB. */}
        <View style={{ height: spacing['4xl'] }} />
      </Section>
    </Screen>
  );
};

export default HistoryScreen;
