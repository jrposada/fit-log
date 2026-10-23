import type {
  TrainingPlan as ApiTrainingPlan,
  TrainingPlanBenchmark,
  TrainingPlanBlock,
  TrainingPlanExercise,
  TrainingPlanItem,
  TrainingPlanLoadPrescription,
  TrainingPlanPrescription,
  TrainingPlanScheduleEntry,
  TrainingPlanSessionTemplate,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import {
  TRAINING_PLAN_BENCHMARK_UNITS,
  TRAINING_PLAN_ITEM_SECTIONS,
  TRAINING_PLAN_SESSION_TEMPLATE_TYPES,
  TRAINING_PLAN_SLOTS,
} from '@jrposada/fit-log-shared/models/training-plans/training-plan';
import type { Document, Types, WithTimestamps } from 'mongoose';
import { model, Schema } from 'mongoose';

const prescriptionSchema = new Schema<TrainingPlanPrescription>(
  {
    // Numeric-or-range fields hold either a number or `{ min, max }`.
    sets: {
      type: Schema.Types.Mixed,
      required: false,
    },
    setsByWeek: {
      type: Schema.Types.Mixed,
      required: false,
    },
    reps: {
      type: Schema.Types.Mixed,
      required: false,
    },
    holdS: {
      type: Schema.Types.Mixed,
      required: false,
    },
    onS: {
      type: Schema.Types.Mixed,
      required: false,
    },
    offS: {
      type: Schema.Types.Mixed,
      required: false,
    },
    restS: {
      type: Schema.Types.Mixed,
      required: false,
    },
    durationMin: {
      type: Schema.Types.Mixed,
      required: false,
    },
    rpe: {
      type: Schema.Types.Mixed,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    loadHint: {
      type: String,
      required: false,
    },
    intensity: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const itemSchema = new Schema<TrainingPlanItem>(
  {
    order: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      enum: [...TRAINING_PLAN_ITEM_SECTIONS],
      required: true,
    },
    exerciseId: {
      type: String,
      required: true,
    },
    prescription: {
      type: prescriptionSchema,
      required: true,
    },
  },
  { _id: false }
);

const sessionTemplateSchema = new Schema<TrainingPlanSessionTemplate>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [...TRAINING_PLAN_SESSION_TEMPLATE_TYPES],
      required: true,
    },
    focus: {
      type: String,
      required: true,
    },
    durationMin: {
      type: Number,
      required: false,
    },
    optional: {
      type: Boolean,
      required: false,
    },
    items: {
      type: [itemSchema],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const exerciseSchema = new Schema<TrainingPlanExercise>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    equipment: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    cues: {
      type: [String],
      required: false,
      default: undefined,
    },
    tindeqLoad: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const blockSchema = new Schema<TrainingPlanBlock>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    weeks: {
      type: [Number],
      required: true,
      default: [],
    },
    focus: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const scheduleEntrySchema = new Schema<TrainingPlanScheduleEntry>(
  {
    blockId: {
      type: String,
      required: true,
    },
    day: {
      type: Number,
      min: 1,
      max: 7,
      required: true,
    },
    slot: {
      type: String,
      enum: [...TRAINING_PLAN_SLOTS],
      required: true,
    },
    sessionTemplateId: {
      type: String,
      required: false,
      default: null,
    },
    optional: {
      type: Boolean,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const progressionRuleSchema = new Schema<
  ApiTrainingPlan['progressionRules'][number]
>(
  {
    id: {
      type: String,
      required: true,
    },
    appliesTo: {
      type: String,
      required: true,
    },
    rule: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const loadPrescriptionSchema = new Schema<TrainingPlanLoadPrescription>(
  {
    exerciseId: {
      type: String,
      required: true,
    },
    blockId: {
      type: String,
      required: false,
    },
    percentOfMvc: {
      type: [Number],
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const tindeqSchema = new Schema<ApiTrainingPlan['tindeq']>(
  {
    baselineTest: {
      type: new Schema<ApiTrainingPlan['tindeq']['baselineTest']>(
        {
          when: {
            type: String,
            required: true,
          },
          protocol: {
            type: String,
            required: true,
          },
          note: {
            type: String,
            required: false,
          },
        },
        { _id: false }
      ),
      required: true,
    },
    loadPrescription: {
      type: [loadPrescriptionSchema],
      required: true,
      default: [],
    },
    criticalForceTest: {
      type: new Schema<
        NonNullable<ApiTrainingPlan['tindeq']['criticalForceTest']>
      >(
        {
          protocol: {
            type: String,
            required: true,
          },
          use: {
            type: String,
            required: true,
          },
          optional: {
            type: Boolean,
            required: false,
          },
        },
        { _id: false }
      ),
      required: false,
    },
    retestWeeks: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const benchmarkSchema = new Schema<TrainingPlanBenchmark>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: [...TRAINING_PLAN_BENCHMARK_UNITS],
      required: true,
    },
    retestWeeks: {
      type: [Number],
      required: true,
      default: [],
    },
  },
  { _id: false }
);

const glossaryEntrySchema = new Schema<ApiTrainingPlan['glossary'][number]>(
  {
    term: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

export interface ITrainingPlan extends WithTimestamps<
  Document<Types.ObjectId>
> {
  /* Data */
  /** Human-readable plan id from the seed file, e.g. `boulder-v6-v7-12wk`. */
  id: string;
  name: string;
  goal: string;
  discipline: string;
  durationWeeks: number;
  athlete: ApiTrainingPlan['athlete'];
  exercises: TrainingPlanExercise[];
  sessionTemplates: TrainingPlanSessionTemplate[];
  blocks: TrainingPlanBlock[];
  schedule: TrainingPlanScheduleEntry[];
  progressionRules: ApiTrainingPlan['progressionRules'];
  tindeq: ApiTrainingPlan['tindeq'];
  benchmarks: TrainingPlanBenchmark[];
  glossary: ApiTrainingPlan['glossary'];
  coachNotes: string[];
}

const trainingPlanSchema = new Schema<ITrainingPlan>(
  {
    /* Data */
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    discipline: {
      type: String,
      required: true,
    },
    durationWeeks: {
      type: Number,
      required: true,
    },
    athlete: {
      type: Schema.Types.Mixed,
      required: true,
      default: {},
    },
    exercises: {
      type: [exerciseSchema],
      required: true,
      default: [],
    },
    sessionTemplates: {
      type: [sessionTemplateSchema],
      required: true,
      default: [],
    },
    blocks: {
      type: [blockSchema],
      required: true,
      default: [],
    },
    schedule: {
      type: [scheduleEntrySchema],
      required: true,
      default: [],
    },
    progressionRules: {
      type: [progressionRuleSchema],
      required: true,
      default: [],
    },
    tindeq: {
      type: tindeqSchema,
      required: true,
    },
    benchmarks: {
      type: [benchmarkSchema],
      required: true,
      default: [],
    },
    glossary: {
      type: [glossaryEntrySchema],
      required: true,
      default: [],
    },
    coachNotes: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    // An item with no prescription fields must still round-trip as `{}`.
    minimize: false,
  }
);

trainingPlanSchema.index({ id: 1 }, { unique: true });

export const TrainingPlan = model<ITrainingPlan>(
  'TrainingPlan',
  trainingPlanSchema
);
