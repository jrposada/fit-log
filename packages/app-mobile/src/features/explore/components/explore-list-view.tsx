import { ClimbSearchResult } from '@jrposada/fit-log-shared/models/climbs/climbs-search';
import { FunctionComponent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CollapsibleSection from '../../../library/collapsible-section';
import EmptyState from '../../../library/empty-state';
import LoadingState from '../../../library/loading-state';
import RefetchBar from '../../../library/refetch-bar';
import Screen from '../../../library/screen';
import Section from '../../../library/section';
import ClimbCard from '../../climbing/components/common/climb-card';

export interface ExploreListViewProps {
  climbs: ClimbSearchResult[];
  isLoading: boolean;
  isFetching: boolean;
}

const ExploreListView: FunctionComponent<ExploreListViewProps> = ({
  climbs,
  isLoading,
  isFetching,
}) => {
  const { t } = useTranslation();
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(
    new Set()
  );

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

  const showInitialLoader = isLoading && climbs.length === 0;
  const showRefetchIndicator = isFetching && !isLoading;

  return (
    <Screen>
      <Section gap="md">
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
    </Screen>
  );
};

export default ExploreListView;
