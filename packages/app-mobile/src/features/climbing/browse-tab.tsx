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
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import Modal from '../../library/modal';
import Separator from '../../library/separator';
import { ClimbingParamList } from '../../types/routes';
import FormGradeChips from './form-grade-chips';
import FormSearchInput from './form-search-input';
import GradeBadge from './grade-badge';
import LocationSelector from './location-selector';

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

  if (isLoadingClimbs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2962ff" />
      </View>
    );
  }

  return (
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
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {t('climbing.browse_no_climbs')}
              </Text>
            </View>
          ) : (
            Array.from(climbsBySector.entries()).map(
              ([sectorId, { name, climbs: sectorClimbs }]) => {
                const isExpanded =
                  expandedSectors.has(sectorId) || climbsBySector.size === 1;

                return (
                  <View key={sectorId} style={styles.sectorSection}>
                    <TouchableOpacity
                      style={styles.sectorHeader}
                      onPress={() => toggleSector(sectorId)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.sectorTitle}>
                        📍 {name} ({sectorClimbs.length})
                      </Text>
                      <Text style={styles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    </TouchableOpacity>

                    {isExpanded &&
                      sectorClimbs.map((climb) => (
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
                  </View>
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
                    <Text style={styles.modalTitle}>{quickViewClimb.name}</Text>
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
                                count: quickViewClimb.userStatus.attempts || 0,
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sectorSection: {
    marginBottom: 16,
  },
  sectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  climbCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  climbInfo: {
    flex: 1,
    marginRight: 12,
  },
  climbTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  climbTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  climbMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  sentBadge: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  projectBadge: {
    fontSize: 14,
  },
  attemptBadge: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
  },
  quickViewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  quickViewButtonText: {
    fontSize: 12,
    color: '#666',
  },
  modalHeader: {
    paddingVertical: 4,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  statusSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  logSendButton: {
    backgroundColor: '#1b5e20',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logSendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  projectButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  projectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default BrowseTab;
