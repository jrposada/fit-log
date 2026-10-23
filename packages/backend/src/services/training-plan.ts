import type { ITrainingPlan } from '../data/models/training-plan.ts';
import { TrainingPlan } from '../data/models/training-plan.ts';
import ResourceNotFound from '../infrastructure/not-found-error.ts';

async function getTrainingPlans(): Promise<ITrainingPlan[]> {
  return TrainingPlan.find().sort({ name: 1 });
}

async function getTrainingPlanById(id: string): Promise<ITrainingPlan> {
  const trainingPlan = await TrainingPlan.findOne({ id });

  if (!trainingPlan) {
    throw new ResourceNotFound(`Training plan with id ${id} not found`);
  }

  return trainingPlan;
}

export { getTrainingPlanById, getTrainingPlans };
