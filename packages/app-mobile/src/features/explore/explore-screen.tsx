import { zodResolver } from '@hookform/resolvers/zod';
import { ClimbGrade } from '@jrposada/fit-log-shared/common/climbs/grades';
import { climbsSearchQuerySchema } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { useClimbsSearch } from '@jrposada/fit-log-shared-react/api/climbs/use-climbs-search';
import { useLocations } from '@jrposada/fit-log-shared-react/api/locations/use-locations';
import { useDebounce } from '@jrposada/fit-log-shared-react/hooks/use-debounce';
import { FunctionComponent, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { z } from 'zod';

import FormTextInput from '../../library/form/form-text-input';
import LoadingState from '../../library/loading-state';
import Section from '../../library/section';
import Separator from '../../library/separator';
import Tabs, { TabBarItem } from '../../library/tabs';
import FormGradeChips from '../climbing/components/common/form-grade-chips';
import LocationSelector from '../climbing/components/common/location-selector';
import ExploreListView from './components/explore-list-view';
import ExploreMapView from './components/explore-map-view';
import { styles } from './explore-screen.styles';
import { ExploreFilters, useExploreFilters } from './use-explore-filters';

type FormData = z.input<typeof climbsSearchQuerySchema>;
type ExploreView = 'map' | 'list';

const ExploreScreen: FunctionComponent = () => {
  const { initialValues, persist } = useExploreFilters();

  if (initialValues === null) {
    return <LoadingState isLoading />;
  }

  return (
    <ExploreContent initialValues={initialValues} onFiltersChange={persist} />
  );
};

const ExploreContent: FunctionComponent<{
  initialValues: ExploreFilters;
  onFiltersChange: (values: ExploreFilters) => void;
}> = ({ initialValues, onFiltersChange }) => {
  const { t } = useTranslation();

  const methods = useForm<FormData>({
    resolver: zodResolver(climbsSearchQuerySchema),
    defaultValues: initialValues,
  });

  const search = useWatch({ control: methods.control, name: 'search' });
  const grade = useWatch({ control: methods.control, name: 'grade' });
  const locationId = useWatch({ control: methods.control, name: 'locationId' });

  const debouncedSearch = useDebounce(search || '', 300);

  useEffect(() => {
    onFiltersChange({
      search: debouncedSearch,
      grade: (grade as ClimbGrade[] | undefined) ?? [],
      locationId: locationId || '',
    });
  }, [debouncedSearch, grade, locationId, onFiltersChange]);

  const hasActiveFilters =
    Boolean(debouncedSearch.trim()) ||
    (grade && grade.length > 0) ||
    Boolean(locationId);

  const {
    data: climbs = [],
    isLoading: isLoadingClimbs,
    isFetching: isFetchingClimbs,
  } = useClimbsSearch({
    locationId: locationId || undefined,
    grade: grade && grade.length > 0 ? (grade as ClimbGrade[]) : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const {
    items: locations,
    isLoading: isLoadingLocations,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLocations();

  // The map needs every location up front, so keep pulling pages until
  // exhausted instead of exposing pagination on a map.
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [view, setView] = useState<ExploreView>('map');

  const viewItems: TabBarItem<ExploreView>[] = [
    { id: 'map', label: t('explore.map_tab') },
    { id: 'list', label: t('explore.list_tab') },
  ];

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <Section gap="md">
          <FormTextInput
            name="search"
            placeholder={t('climbing.browse_search_placeholder')}
          />

          <Separator />

          <Controller
            control={methods.control}
            name="locationId"
            render={({ field }) => (
              <LocationSelector
                onChange={field.onChange}
                value={field.value!}
              />
            )}
          />

          <FormGradeChips name="grade" />
        </Section>

        <Tabs.Bar<ExploreView>
          items={viewItems}
          activeId={view}
          onChange={setView}
        />

        <View style={styles.content}>
          {view === 'map' ? (
            <ExploreMapView
              locations={locations}
              climbs={climbs}
              isLoading={isLoadingLocations}
              hasActiveFilters={Boolean(hasActiveFilters)}
            />
          ) : (
            <ExploreListView
              climbs={climbs}
              isLoading={isLoadingClimbs}
              isFetching={isFetchingClimbs}
            />
          )}
        </View>
      </View>
    </FormProvider>
  );
};

export default ExploreScreen;
