import { zodResolver } from '@hookform/resolvers/zod';
import { ClimbGrade } from '@shared/models/climb/climb';
import {
  ClimbSearchResult,
  climbsSearchQuerySchema,
} from '@shared/models/climb/climb-search';
import { useClimbsSearch } from '@shared-react/api/climbs/use-climbs-search';
import { useDebounce } from '@shared-react/hooks/use-debounce';
import { FunctionComponent, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import CollapsibleSection from '../../../../library/collapsible-section';
import EmptyState from '../../../../library/empty-state';
import FormTextInput from '../../../../library/form/form-text-input';
import LoadingState from '../../../../library/loading-state';
import RefetchBar from '../../../../library/refetch-bar';
import Section from '../../../../library/section';
import Separator from '../../../../library/separator';
import ClimbCard from '../common/climb-card';
import FormGradeChips from '../common/form-grade-chips';
import LocationSelector from '../common/location-selector';

type FormData = z.input<typeof climbsSearchQuerySchema>;

const BrowseTab: FunctionComponent = () => {
  const { t } = useTranslation();

  const methods = useForm<FormData>({
    resolver: zodResolver(climbsSearchQuerySchema),
    defaultValues: {
      locationId: '',
      search: '',
      grade: [],
    },
  });

  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(
    new Set()
  );

  const locationId = useWatch({ control: methods.control, name: 'locationId' });
  const search = useWatch({ control: methods.control, name: 'search' });
  const grade = useWatch({ control: methods.control, name: 'grade' });

  const debouncedSearch = useDebounce(search || '', 300);

  const {
    data: climbs = [],
    isLoading,
    isFetching,
  } = useClimbsSearch({
    locationId: locationId || undefined,
    grade: grade && grade.length > 0 ? (grade as ClimbGrade[]) : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const showInitialLoader = isLoading && climbs.length === 0;
  const showRefetchIndicator = isFetching && !isLoading;

  const climbsBySector = useMemo(() => {
    const grouped = new Map<
      string,
      { name: string; climbs: ClimbSearchResult[] }
    >();

    climbs.forEach((climb) => {
      const sectorId = climb.sector.id;
      const sectorName = climb.sector.name;

      if (!grouped.has(sectorId)) {
        grouped.set(sectorId, { name: sectorName, climbs: [] });
      }
      grouped.get(sectorId)!.climbs.push(climb);
    });

    return grouped;
  }, [climbs]);

  const toggleSector = (sectorId: string) => {
    setExpandedSectors((prev) => {
      const next = new Set(prev);
      if (next.has(sectorId)) {
        next.delete(sectorId);
      } else {
        next.add(sectorId);
      }
      return next;
    });
  };

  return (
    <FormProvider {...methods}>
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
            <LocationSelector onChange={field.onChange} value={field.value!} />
          )}
        />

        <FormGradeChips name="grade" />

        <Separator />

        <RefetchBar active={showRefetchIndicator} />

        <LoadingState isLoading={showInitialLoader}>
          {climbsBySector.size === 0 ? (
            <EmptyState message={t('climbing.browse_no_climbs')} />
          ) : (
            Array.from(climbsBySector.entries()).map(
              ([sectorId, { name, climbs: sectorClimbs }]) => {
                const isExpanded =
                  expandedSectors.has(sectorId) || climbsBySector.size === 1;

                return (
                  <CollapsibleSection
                    key={sectorId}
                    title={name}
                    count={sectorClimbs.length}
                    icon="📍"
                    expanded={isExpanded}
                    onToggle={() => toggleSector(sectorId)}
                  >
                    {sectorClimbs.map((climb) => (
                      <ClimbCard
                        key={climb.id}
                        climb={climb}
                        location={{
                          id:
                            typeof climb.location === 'string'
                              ? climb.location
                              : climb.location.id,
                          name:
                            typeof climb.location === 'string'
                              ? ''
                              : climb.location.name,
                        }}
                        sector={{
                          id: climb.sector.id,
                          name: climb.sector.name,
                        }}
                      />
                    ))}
                  </CollapsibleSection>
                );
              }
            )
          )}
        </LoadingState>
      </Section>
    </FormProvider>
  );
};

export default BrowseTab;
