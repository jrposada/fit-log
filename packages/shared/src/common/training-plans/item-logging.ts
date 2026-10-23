import {
  NumberOrRange,
  TrainingPlan,
  TrainingPlanItem,
  TrainingPlanPrescription,
  TrainingPlanSessionTemplate,
} from '../../models/training-plans/training-plan.ts';
import {
  TrainingSession,
  TrainingSessionItemLog,
  TrainingSessionItemLogSet,
  TrainingSessionItemLogStatus,
} from '../../models/training-sessions/training-session.ts';
import { hasHangLoad } from './hang-load.ts';

export type ItemLogSetField = keyof TrainingSessionItemLogSet;

type VisibleSetFieldsParams = {
  plan: TrainingPlan;
  template: TrainingPlanSessionTemplate;
  item: TrainingPlanItem;
  /** Effective prescription of `item` for the session's week. */
  prescription: TrainingPlanPrescription;
};

/** Set fields worth logging for an item, in display order. */
export function visibleSetFields({
  plan,
  template,
  item,
  prescription,
}: VisibleSetFieldsParams): ItemLogSetField[] {
  const isTindeq = hasHangLoad(plan, item.exerciseId);
  const fields: ItemLogSetField[] = [];

  if (prescription.reps !== undefined) {
    fields.push('reps');
  }
  if (prescription.loadHint || template.type === 'gym' || isTindeq) {
    fields.push('weightKg');
  }
  if (prescription.holdS !== undefined || prescription.onS !== undefined) {
    fields.push('holdS');
  }
  if (prescription.durationMin !== undefined) {
    fields.push('durationMin');
  }
  if (prescription.rpe !== undefined) {
    fields.push('rpe');
  }
  return fields;
}

function lowerBound(value: NumberOrRange | null | undefined) {
  return value === null || value === undefined || typeof value === 'number'
    ? (value ?? undefined)
    : value.min;
}

export function defaultSetCount(
  prescription: TrainingPlanPrescription
): number {
  return lowerBound(prescription.sets) ?? 1;
}

function prescribedValue(
  prescription: TrainingPlanPrescription,
  field: ItemLogSetField
): number | undefined {
  switch (field) {
    case 'reps':
      return lowerBound(prescription.reps);
    case 'holdS':
      return lowerBound(prescription.holdS ?? prescription.onS);
    case 'durationMin':
      return lowerBound(prescription.durationMin);
    case 'rpe':
      return lowerBound(prescription.rpe);
    case 'weightKg':
      return undefined;
  }
}

/**
 * Initial set rows for an item. The prescription wins where it states a
 * value; the previous sets fill the rest (load, max reps), matched by set
 * position and falling back to the last previous set.
 */
export function prefillSets(
  prescription: TrainingPlanPrescription,
  fields: ItemLogSetField[],
  previousSets: TrainingSessionItemLogSet[]
): TrainingSessionItemLogSet[] {
  return Array.from({ length: defaultSetCount(prescription) }, (_, index) => {
    const previous =
      previousSets[index] ?? previousSets[previousSets.length - 1];
    const set: TrainingSessionItemLogSet = {};
    for (const field of fields) {
      const value = prescribedValue(prescription, field) ?? previous?.[field];
      if (value !== undefined) {
        set[field] = value;
      }
    }
    return set;
  });
}

/** Sets of the most recent done log of `exerciseId` outside the current
 * session, or `[]`. */
export function latestLoggedSets(
  sessions: Pick<TrainingSession, 'id' | 'startedAt' | 'itemLogs'>[],
  exerciseId: string,
  currentSessionId: string
): TrainingSessionItemLogSet[] {
  const logs = sessions
    .filter(({ id }) => id !== currentSessionId)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
    .flatMap(({ itemLogs }) => itemLogs);
  return (
    logs.find(
      (log) =>
        log.exerciseId === exerciseId &&
        log.status === 'done' &&
        log.sets.length > 0
    )?.sets ?? []
  );
}

/** Adds or replaces the log of `log.itemOrder`, keeping item order. */
export function setItemLog(
  itemLogs: TrainingSessionItemLog[],
  log: TrainingSessionItemLog
): TrainingSessionItemLog[] {
  return [...removeItemLog(itemLogs, log.itemOrder), log].sort(
    (a, b) => a.itemOrder - b.itemOrder
  );
}

export function removeItemLog(
  itemLogs: TrainingSessionItemLog[],
  itemOrder: number
): TrainingSessionItemLog[] {
  return itemLogs.filter((log) => log.itemOrder !== itemOrder);
}

type ItemRef = Pick<TrainingPlanItem, 'order' | 'exerciseId'>;

/**
 * Sets the item's status, or clears its log when it already has that status.
 * Skipped items keep no sets.
 */
export function toggleItemLogStatus(
  itemLogs: TrainingSessionItemLog[],
  item: ItemRef,
  status: TrainingSessionItemLogStatus,
  sets: TrainingSessionItemLogSet[]
): TrainingSessionItemLog[] {
  const existing = itemLogs.find(({ itemOrder }) => itemOrder === item.order);
  if (existing?.status === status) {
    return removeItemLog(itemLogs, item.order);
  }
  return setItemLog(itemLogs, {
    ...existing,
    itemOrder: item.order,
    exerciseId: item.exerciseId,
    status,
    sets: status === 'done' ? sets : [],
  });
}

/** Replaces the item's sets; logging sets marks an unlogged item done. */
export function updateItemLogSets(
  itemLogs: TrainingSessionItemLog[],
  item: ItemRef,
  sets: TrainingSessionItemLogSet[]
): TrainingSessionItemLog[] {
  const existing = itemLogs.find(({ itemOrder }) => itemOrder === item.order);
  return setItemLog(itemLogs, {
    itemOrder: item.order,
    exerciseId: item.exerciseId,
    status: 'done',
    ...existing,
    sets,
  });
}

/** Parses a set input, `undefined` when empty or not a valid value for
 * `field`. */
export function parseSetValue(
  field: ItemLogSetField,
  text: string
): number | undefined {
  const trimmed = text.trim().replace(',', '.');
  if (trimmed === '') {
    return undefined;
  }
  const value = Number(trimmed);
  if (Number.isNaN(value)) {
    return undefined;
  }

  switch (field) {
    // Negative load is pulley assist.
    case 'weightKg':
      return value;
    case 'reps':
      return Number.isInteger(value) && value >= 0 ? value : undefined;
    case 'rpe':
      return value >= 0 && value <= 10 ? value : undefined;
    case 'holdS':
    case 'durationMin':
      return value >= 0 ? value : undefined;
  }
}
