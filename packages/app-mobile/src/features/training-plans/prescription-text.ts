import {
  formatHangLoad,
  formatPrescription,
} from '@jrposada/fit-log-shared/common/training-plans/format-prescription';
import { HangLoad } from '@jrposada/fit-log-shared/common/training-plans/hang-load';
import { TrainingPlanPrescription } from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import { TFunction } from 'i18next';

const SEPARATOR = ' · ';

export function prescriptionText(
  t: TFunction,
  prescription: TrainingPlanPrescription
): string {
  return formatPrescription(prescription)
    .map(({ key, values }) => t(`training_plans.prescription_${key}`, values))
    .join(SEPARATOR);
}

export function hangLoadText(t: TFunction, load: HangLoad): string {
  return formatHangLoad(load)
    .map(({ key, values }) => t(`training_plans.hang_load_${key}`, values))
    .join(SEPARATOR);
}
