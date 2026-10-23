import {
  latestLoggedSets,
  prefillSets,
  toggleItemLogStatus,
  updateItemLogSets,
  visibleSetFields,
} from '@jrposada/fit-log-shared/common/training-plans/item-logging';
import { resolvePrescription } from '@jrposada/fit-log-shared/common/training-plans/resolve-prescription';
import { toTrainingSessionsPutRequest } from '@jrposada/fit-log-shared/common/training-sessions/to-training-sessions-put-request';
import {
  TrainingSession,
  TrainingSessionItemLog,
  TrainingSessionPlanned,
} from '@jrposada/fit-log-shared/models/training-sessions/training-session';
import { usePlanEnrollmentsActive } from '@jrposada/fit-log-shared-react/api/plan-enrollments/use-plan-enrollments-active';
import { useTrainingPlansById } from '@jrposada/fit-log-shared-react/api/training-plans/use-training-plans-by-id';
import { useTrainingSessions } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions';
import { useTrainingSessionsPut } from '@jrposada/fit-log-shared-react/api/training-sessions/use-training-sessions-put';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Separator from '../../library/separator';
import Stack from '../../library/stack';
import { useToast } from '../../library/toast';
import { Typography } from '../../library/typography';
import PlannedItemLog from './planned-item-log';
import { prescriptionText } from './prescription-text';

// The most recent sessions are enough to find an exercise's last sets.
const PREVIOUS_SESSIONS_LIMIT = 20;

type PlannedItemsLogProps = {
  session: TrainingSession & { planned: TrainingSessionPlanned };
};

/** Item logging for a planned session. Remount per session: item logs are
 * held locally so quick successive edits never build on a stale cache. */
const PlannedItemsLog: FunctionComponent<PlannedItemsLogProps> = ({
  session,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { planned } = session;

  const { data: enrollment } = usePlanEnrollmentsActive();
  const { data: plan } = useTrainingPlansById({
    id: enrollment?.id === planned.enrollment ? enrollment.planId : undefined,
  });
  const { items: previousSessions } = useTrainingSessions({
    enrollment: planned.enrollment,
    limit: PREVIOUS_SESSIONS_LIMIT,
  });

  const [itemLogs, setItemLogs] = useState(session.itemLogs);
  const trainingSessionsPut = useTrainingSessionsPut({
    onError: (error) => {
      toast.show(t('training_plans.item_log_error', { error }), 'destructive');
    },
  });

  const block = plan?.blocks.find(({ weeks }) => weeks.includes(planned.week));
  const template = plan?.sessionTemplates.find(
    ({ id }) => id === planned.sessionTemplateId
  );
  if (!plan || !block || !template) {
    return null;
  }

  const save = (next: TrainingSessionItemLog[]) => {
    setItemLogs(next);
    trainingSessionsPut.mutate(
      toTrainingSessionsPutRequest({ ...session, itemLogs: next })
    );
  };

  return (
    <Stack gap="sm">
      <Typography
        size="overline"
        color="secondary"
        style={{ textTransform: 'uppercase' }}
      >
        {t('training_plans.planned_items_title')}
      </Typography>
      {template.items.map((item, index) => {
        const prescription = resolvePrescription(item, block, planned.week);
        const fields = visibleSetFields({ plan, template, item, prescription });
        const log = itemLogs.find(({ itemOrder }) => itemOrder === item.order);
        const sets =
          log?.status === 'done'
            ? log.sets
            : prefillSets(
                prescription,
                fields,
                latestLoggedSets(previousSessions, item.exerciseId, session.id)
              );

        return (
          <Stack key={item.order} gap="sm">
            {index > 0 && <Separator />}
            <PlannedItemLog
              title={
                plan.exercises.find(({ id }) => id === item.exerciseId)?.name ??
                item.exerciseId
              }
              summary={prescriptionText(t, prescription)}
              fields={fields}
              status={log?.status}
              sets={sets}
              onToggleStatus={(status) =>
                save(toggleItemLogStatus(itemLogs, item, status, sets))
              }
              onChangeSets={(next) =>
                save(updateItemLogSets(itemLogs, item, next))
              }
            />
          </Stack>
        );
      })}
    </Stack>
  );
};

export default PlannedItemsLog;
