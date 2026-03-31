import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ClimbGrade } from '@shared/models/climb/climb';
import {
  ClimbSearchResult,
  climbsSearchQuerySchema,
} from '@shared/models/climb/climb-search';
import { useClimbHistoriesPut } from '@shared-react/api/climb-histories/use-climb-histories-put';
import { useClimbsSearch } from '@shared-react/api/climbs/use-climbs-search';
import { beautifyGradeColor } from '@shared-react/beautifiers/grade-colors';
import { useDebounce } from '@shared-react/hooks/use-debounce';
import { FunctionComponent, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

import CollapsibleSection from '../../../../library/collapsible-section';
import EmptyState from '../../../../library/empty-state';
import LoadingState from '../../../../library/loading-state';
import Modal from '../../../../library/modal';
import Separator from '../../../../library/separator';
import { ClimbingParamList } from '../../types';
import GradeBadge from '../common/grade-badge';
import LocationSelector from '../common/location-selector';
import { styles } from './browse-tab.styles';
import FormGradeChips from './form-grade-chips';
import FormSearchInput from './form-search-input';

type ClimbCardNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

const BrowseTab: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbCardNavigationProp>();

  type FormData = z.input<typeof climbsSearchQuerySchema>;

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
  const [quickViewClimb, setQuickViewClimb] =
    useState<ClimbSearchResult | null>(null);

  // Watch form values
  const locationId = useWatch({ control: methods.control, name: 'locationId' });
  const search = useWatch({ control: methods.control, name: 'search' });
  const grade = useWatch({ control: methods.control, name: 'grade' });

  const debouncedSearch = useDebounce(search || '', 300);

  // Fetch climbs with backend filtering and user status
  const { data: climbs = [], isLoading: isLoadingClimbs } = useClimbsSearch({
    locationId: locationId || undefined,
    grade: grade && grade.length > 0 ? (grade as ClimbGrade[]) : undefined,
    search: debouncedSearch.trim() || undefined,
  });

  const climbHistoriesPut = useClimbHistoriesPut();

  // Group climbs by sector (display organization only)
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

  const handleLogSend = (climb: ClimbSearchResult) => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location:
        typeof climb.location === 'string' ? climb.location : climb.location.id,
      sector: climb.sector.id,
      status: 'send',
      attempts: 1,
    });
    setQuickViewClimb(null);
  };

  const handleAddProject = (climb: ClimbSearchResult) => {
    climbHistoriesPut.mutate({
      climb: climb.id,
      location:
        typeof climb.location === 'string' ? climb.location : climb.location.id,
      sector: climb.sector.id,
      status: 'project',
    });
    setQuickViewClimb(null);
  };

  const getStatusBadge = (climb: ClimbSearchResult) => {
    const status = climb.userStatus?.status;
    if (status === 'send' || status === 'flash') {
      return <Text style={styles.sentBadge}>✓</Text>;
    }
    if (status === 'project') {
      return <Text style={styles.projectBadge}>🎯</Text>;
    }
    if (status === 'attempt' && climb.userStatus?.attempts) {
      return (
        <Text style={styles.attemptBadge}>{climb.userStatus.attempts}x</Text>
      );
    }
    return null;
  };

  return (
    <LoadingState isLoading={isLoadingClimbs}>
      <FormProvider {...methods}>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
          >
            <FormSearchInput
              name="search"
              placeholder={t('climbing.browse_search_placeholder')}
            />
            <Separator />

            <Controller
              control={methods.control}
              name={'locationId'}
              render={({ field }) => (
                <LocationSelector
                  onChange={field.onChange}
                  value={field.value!}
                />
              )}
            />

            <FormGradeChips name="grade" />

            <Separator />

            {/* Climbs grouped by sector */}
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
                        <TouchableOpacity
                          key={climb.id}
                          style={styles.climbCard}
                          onPress={() => setQuickViewClimb(climb)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.climbInfo}>
                            <View style={styles.climbTopRow}>
                              <Text style={styles.climbTitle}>
                                <Text
                                  style={{
                                    color: beautifyGradeColor(climb.grade),
                                  }}
                                >
                                  ●
                                </Text>{' '}
                                {climb.grade} | {climb.name}
                              </Text>
                              {getStatusBadge(climb)}
                            </View>
                            <Text style={styles.climbMeta}>
                              {t('climbing.browse_created', {
                                date: new Date(
                                  climb.createdAt
                                ).toLocaleDateString(),
                              })}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.quickViewButton}
                            onPress={() => setQuickViewClimb(climb)}
                          >
                            <Text style={styles.quickViewButtonText}>
                              {t('climbing.browse_quick_view')}
                            </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </CollapsibleSection>
                  );
                }
              )
            )}
          </ScrollView>

          {/* Quick View Modal */}
          <Modal.Root
            visible={quickViewClimb !== null}
            onClose={() => setQuickViewClimb(null)}
          >
            {quickViewClimb && (
              <>
                <Modal.Header>
                  <View style={styles.modalHeader}>
                    <View style={styles.modalTitleRow}>
                      <GradeBadge grade={quickViewClimb.grade} />
                      <Text style={styles.modalTitle}>
                        {quickViewClimb.name}
                      </Text>
                    </View>
                    <Text style={styles.modalSubtitle}>
                      {quickViewClimb.sector.name}
                    </Text>
                  </View>
                </Modal.Header>
                <Modal.Body>
                  {quickViewClimb.image && (
                    <Image
                      source={{ uri: quickViewClimb.image.imageUrl }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  )}

                  {quickViewClimb.description && (
                    <Text style={styles.modalDescription}>
                      {quickViewClimb.description}
                    </Text>
                  )}

                  <View style={styles.statusSection}>
                    <Text style={styles.statusLabel}>
                      {t('climbing.browse_your_status')}:
                    </Text>
                    {quickViewClimb.userStatus ? (
                      <View style={styles.statusInfo}>
                        {getStatusBadge(quickViewClimb)}
                        <Text style={styles.statusText}>
                          {quickViewClimb.userStatus.status === 'send' ||
                          quickViewClimb.userStatus.status === 'flash'
                            ? t('climbing.browse_status_sent')
                            : quickViewClimb.userStatus.status === 'project'
                              ? t('climbing.browse_status_project')
                              : t('climbing.browse_status_attempted', {
                                  count:
                                    quickViewClimb.userStatus.attempts || 0,
                                })}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.statusText}>
                        {t('climbing.browse_status_not_tried')}
                      </Text>
                    )}
                  </View>

                  <View style={styles.actionButtons}>
                    {quickViewClimb.userStatus?.status !== 'send' &&
                      quickViewClimb.userStatus?.status !== 'flash' && (
                        <TouchableOpacity
                          style={styles.logSendButton}
                          onPress={() => handleLogSend(quickViewClimb)}
                          disabled={climbHistoriesPut.isPending}
                        >
                          <Text style={styles.logSendButtonText}>
                            ✓ {t('climbing.browse_log_send')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    {quickViewClimb.userStatus?.status !== 'project' &&
                      quickViewClimb.userStatus?.status !== 'send' &&
                      quickViewClimb.userStatus?.status !== 'flash' && (
                        <TouchableOpacity
                          style={styles.projectButton}
                          onPress={() => handleAddProject(quickViewClimb)}
                          disabled={climbHistoriesPut.isPending}
                        >
                          <Text style={styles.projectButtonText}>
                            + {t('climbing.project_action')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => {
                        setQuickViewClimb(null);
                        navigation.navigate('ClimbDetail', {
                          climbId: quickViewClimb.id,
                        });
                      }}
                    >
                      <Text style={styles.detailsButtonText}>
                        {t('climbing.browse_view_details')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Modal.Body>
              </>
            )}
          </Modal.Root>
        </View>
      </FormProvider>
    </LoadingState>
  );
};

export default BrowseTab;
