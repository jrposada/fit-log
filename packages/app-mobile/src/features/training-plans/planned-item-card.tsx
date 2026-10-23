import {
  hangLoad,
  hasHangLoad,
} from '@jrposada/fit-log-shared/common/training-plans/hang-load';
import {
  TrainingPlan,
  TrainingPlanItem,
  TrainingPlanPrescription,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../../library/card';
import CollapsibleSection from '../../library/collapsible-section';
import Stack from '../../library/stack';
import { Typography } from '../../library/typography';
import { RootStackParamList } from '../../types/routes';
import { hangLoadText, prescriptionText } from './prescription-text';

type PlannedItemCardProps = {
  plan: TrainingPlan;
  blockId: string;
  item: TrainingPlanItem;
  /** Effective prescription of `item` for the planned week. */
  prescription: TrainingPlanPrescription;
  /** Latest open-hand MVC, in kg. */
  mvcKg?: number;
  /** Latest bodyweight, in kg. */
  bodyweightKg?: number;
};

const PlannedItemCard: FunctionComponent<PlannedItemCardProps> = ({
  plan,
  blockId,
  item,
  prescription,
  mvcKg,
  bodyweightKg,
}) => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openBenchmarks = () => navigation.navigate('Benchmarks');

  const exercise = plan.exercises.find(({ id }) => id === item.exerciseId);
  const summary = prescriptionText(t, prescription);
  const load =
    mvcKg === undefined
      ? null
      : hangLoad(plan, item.exerciseId, blockId, mvcKg, bodyweightKg);

  return (
    <Card variant="flat">
      <Stack gap="xs">
        <Typography size="body" weight="semibold">
          {exercise?.name ?? item.exerciseId}
        </Typography>
        {summary !== '' && <Typography size="callout">{summary}</Typography>}
        {prescription.intensity && (
          <Typography size="callout" color="secondary">
            {prescription.intensity}
          </Typography>
        )}
        {prescription.loadHint && (
          <Typography size="callout" color="secondary">
            {prescription.loadHint}
          </Typography>
        )}
        {hasHangLoad(plan, item.exerciseId) &&
          (load ? (
            <>
              <Typography size="callout" weight="semibold" color="accent">
                {hangLoadText(t, load)}
              </Typography>
              {bodyweightKg === undefined && (
                <Typography
                  size="caption"
                  color="warning"
                  style={{ textDecorationLine: 'underline' }}
                  onPress={openBenchmarks}
                >
                  {t('training_plans.hang_load_missing_bodyweight')}
                </Typography>
              )}
            </>
          ) : (
            <Typography
              size="callout"
              color="warning"
              style={{ textDecorationLine: 'underline' }}
              onPress={openBenchmarks}
            >
              {t('training_plans.hang_load_missing_mvc')}
            </Typography>
          ))}
        {prescription.notes && (
          <Typography size="callout" color="tertiary">
            {prescription.notes}
          </Typography>
        )}
        {exercise && (
          <CollapsibleSection title={t('training_plans.exercise_details')}>
            <Stack gap="xs">
              <Typography size="callout" color="secondary">
                {exercise.description}
              </Typography>
              {exercise.cues?.map((cue) => (
                <Typography key={cue} size="callout" color="secondary">
                  {`• ${cue}`}
                </Typography>
              ))}
            </Stack>
          </CollapsibleSection>
        )}
      </Stack>
    </Card>
  );
};

export default PlannedItemCard;
