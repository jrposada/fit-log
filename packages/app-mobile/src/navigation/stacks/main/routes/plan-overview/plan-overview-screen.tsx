import { usePlanEnrollmentsActive } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-active';
import { usePlanEnrollmentsPut } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-put';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { toLocalDateString } from '../../../../../features/training-plans/local-date';
import PlanWeeks from '../../../../../features/training-plans/plan-weeks';
import Button from '../../../../../library/button';
import CollapsibleSection from '../../../../../library/collapsible-section';
import LoadingState from '../../../../../library/loading-state';
import Screen from '../../../../../library/screen';
import Stack from '../../../../../library/stack';
import { useToast } from '../../../../../library/toast';
import { Typography } from '../../../../../library/typography';
import { RootStackParamList } from '../../../../../types/routes';

type PlanOverviewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlanOverview'
>;

const PlanOverviewScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigation = useNavigation<PlanOverviewNavigationProp>();

  const { data: enrollment, isLoading: isLoadingEnrollment } =
    usePlanEnrollmentsActive();
  const { data: plan, isLoading: isLoadingPlan } = useTrainingPlansById({
    id: enrollment?.planId,
  });

  const planEnrollmentsPut = usePlanEnrollmentsPut({
    onSuccess: () => navigation.goBack(),
    onError: (error) => {
      toast.show(t('training_plans.abandon_error', { error }), 'destructive');
    },
  });

  const handleAbandon = () => {
    if (!enrollment) return;
    Alert.alert(
      t('training_plans.abandon_confirm_title'),
      t('training_plans.abandon_confirm_message'),
      [
        { text: t('actions.cancel'), style: 'cancel' },
        {
          text: t('training_plans.abandon_button'),
          style: 'destructive',
          onPress: () =>
            planEnrollmentsPut.mutate({
              id: enrollment.id,
              planId: enrollment.planId,
              startDate: enrollment.startDate,
              status: 'abandoned',
            }),
        },
      ]
    );
  };

  return (
    <Screen padding="lg">
      <LoadingState isLoading={isLoadingEnrollment || isLoadingPlan}>
        {enrollment && plan && (
          <Stack gap="lg">
            <Stack gap="2xs">
              <Typography size="title">{plan.name}</Typography>
              <Typography size="callout" color="secondary">
                {plan.goal}
              </Typography>
            </Stack>

            <Button
              title={t('training_plans.benchmarks_title')}
              icon="assessment"
              variant="outline"
              size="md"
              onPress={() => navigation.navigate('Benchmarks')}
            />

            <PlanWeeks
              plan={plan}
              enrollment={enrollment}
              today={toLocalDateString()}
            />

            <Stack>
              <CollapsibleSection title={t('training_plans.overview_glossary')}>
                <Stack gap="sm">
                  {plan.glossary.map(({ term, definition }) => (
                    <Typography key={term} size="callout" color="secondary">
                      <Typography size="callout" weight="semibold">
                        {term}
                      </Typography>
                      {` — ${definition}`}
                    </Typography>
                  ))}
                </Stack>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('training_plans.overview_coach_notes')}
              >
                <Stack gap="sm">
                  {plan.coachNotes.map((note) => (
                    <Typography key={note} size="callout" color="secondary">
                      {note}
                    </Typography>
                  ))}
                </Stack>
              </CollapsibleSection>

              <CollapsibleSection
                title={t('training_plans.overview_progression_rules')}
              >
                <Stack gap="sm">
                  {plan.progressionRules.map(({ id, rule }) => (
                    <Typography key={id} size="callout" color="secondary">
                      {rule}
                    </Typography>
                  ))}
                </Stack>
              </CollapsibleSection>
            </Stack>

            <Button
              title={t('training_plans.abandon_button')}
              variant="destructive"
              onPress={handleAbandon}
              disabled={planEnrollmentsPut.isPending}
            />
          </Stack>
        )}
      </LoadingState>
    </Screen>
  );
};

export default PlanOverviewScreen;
