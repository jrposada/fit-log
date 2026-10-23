import z from 'zod';

export type Range = { min: number; max: number };
export type NumberOrRange = number | Range;

export type TrainingPlanPrescription = {
  sets?: NumberOrRange;

  /**
   * Sets per week, keyed by the week within the block (1-based). Overrides
   * {@link TrainingPlanPrescription.sets}.
   */
  setsByWeek?: Record<number, number>;

  /** `null` means max reps. */
  reps?: NumberOrRange | null;
  holdS?: NumberOrRange;
  onS?: NumberOrRange;
  offS?: NumberOrRange;
  restS?: NumberOrRange;
  durationMin?: NumberOrRange;
  rpe?: NumberOrRange;

  /** What `reps` counts, e.g. `problems` or `sets`. */
  unit?: string;
  loadHint?: string;
  intensity?: string;
  notes?: string;
};

export const TRAINING_PLAN_ITEM_SECTIONS = [
  'warmup',
  'main',
  'accessory',
  'cooldown',
] as const;
export type TrainingPlanItemSection =
  (typeof TRAINING_PLAN_ITEM_SECTIONS)[number];

export type TrainingPlanItem = {
  order: number;
  section: TrainingPlanItemSection;
  exerciseId: string;
  prescription: TrainingPlanPrescription;
};

export const TRAINING_PLAN_SESSION_TEMPLATE_TYPES = ['gym', 'climb'] as const;
export type TrainingPlanSessionTemplateType =
  (typeof TRAINING_PLAN_SESSION_TEMPLATE_TYPES)[number];

export type TrainingPlanSessionTemplate = {
  id: string;
  name: string;
  type: TrainingPlanSessionTemplateType;
  focus: string;
  durationMin?: number;
  optional?: boolean;
  items: TrainingPlanItem[];
};

export type TrainingPlanExercise = {
  id: string;
  name: string;
  category: string;
  equipment: string[];
  description: string;
  cues?: string[];

  /** Display text, e.g. `60-70% of open-hand MVC-7`. */
  tindeqLoad?: string;
};

export type TrainingPlanBlock = {
  id: string;
  name: string;
  weeks: number[];
  focus: string;
};

/** ISO weekday, 1 = Monday. */
export type TrainingPlanDay = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const TRAINING_PLAN_SLOTS = ['am', 'pm', 'any'] as const;
export type TrainingPlanSlot = (typeof TRAINING_PLAN_SLOTS)[number];

export type TrainingPlanScheduleEntry = {
  blockId: string;
  day: TrainingPlanDay;
  slot: TrainingPlanSlot;

  /** `null` for a rest day. */
  sessionTemplateId: string | null;
  optional?: boolean;
  notes?: string;
};

export const TRAINING_PLAN_BENCHMARK_UNITS = [
  'kg',
  'v_grade',
  'rounds',
  'minutes',
  'text',
] as const;
export type TrainingPlanBenchmarkUnit =
  (typeof TRAINING_PLAN_BENCHMARK_UNITS)[number];

export type TrainingPlanBenchmark = {
  id: string;
  name: string;
  unit: TrainingPlanBenchmarkUnit;

  /** Week 0 is before the plan starts. */
  retestWeeks: number[];
};

export type TrainingPlanLoadPrescription = {
  exerciseId: string;

  /** When set, overrides the prescription without a block for that block. */
  blockId?: string;
  percentOfMvc: [number, number];
  notes?: string;
};

export type TrainingPlan = {
  id: string;
  name: string;
  goal: string;
  discipline: string;
  durationWeeks: number;
  athlete: Record<string, unknown>;
  exercises: TrainingPlanExercise[];
  sessionTemplates: TrainingPlanSessionTemplate[];
  blocks: TrainingPlanBlock[];
  schedule: TrainingPlanScheduleEntry[];
  progressionRules: { id: string; appliesTo: string; rule: string }[];
  tindeq: {
    baselineTest: { when: string; protocol: string; note?: string };
    loadPrescription: TrainingPlanLoadPrescription[];
    criticalForceTest?: { protocol: string; use: string; optional?: boolean };
    retestWeeks: number[];
  };
  benchmarks: TrainingPlanBenchmark[];
  glossary: { term: string; definition: string }[];
  coachNotes: string[];
};

export type TrainingPlanSummary = Pick<
  TrainingPlan,
  'id' | 'name' | 'goal' | 'durationWeeks'
>;

const rangeSchema = z.object({ min: z.number(), max: z.number() });
const numberOrRangeSchema = z.union([z.number(), rangeSchema]);

const prescriptionSchema = z.object({
  sets: numberOrRangeSchema.optional(),
  // JSON object keys are strings.
  setsByWeek: z
    .record(z.coerce.number().int().positive(), z.number().int().positive())
    .optional(),
  reps: numberOrRangeSchema.nullable().optional(),
  holdS: numberOrRangeSchema.optional(),
  onS: numberOrRangeSchema.optional(),
  offS: numberOrRangeSchema.optional(),
  restS: numberOrRangeSchema.optional(),
  durationMin: numberOrRangeSchema.optional(),
  rpe: numberOrRangeSchema.optional(),
  unit: z.string().nonempty().optional(),
  loadHint: z.string().nonempty().optional(),
  intensity: z.string().nonempty().optional(),
  notes: z.string().nonempty().optional(),
});

const itemSchema = z.object({
  order: z.number().int(),
  section: z.enum(TRAINING_PLAN_ITEM_SECTIONS),
  exerciseId: z.string().nonempty(),
  prescription: prescriptionSchema,
});

const sessionTemplateSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  type: z.enum(TRAINING_PLAN_SESSION_TEMPLATE_TYPES),
  focus: z.string().nonempty(),
  durationMin: z.number().positive().optional(),
  optional: z.boolean().optional(),
  items: z.array(itemSchema),
});

const exerciseSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  category: z.string().nonempty(),
  equipment: z.array(z.string().nonempty()),
  description: z.string().nonempty(),
  cues: z.array(z.string().nonempty()).optional(),
  tindeqLoad: z.string().nonempty().optional(),
});

const blockSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  weeks: z.array(z.number().int()),
  focus: z.string().nonempty(),
});

const scheduleEntrySchema = z.object({
  blockId: z.string().nonempty(),
  day: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
  ]),
  slot: z.enum(TRAINING_PLAN_SLOTS),
  sessionTemplateId: z.string().nonempty().nullable(),
  optional: z.boolean().optional(),
  notes: z.string().nonempty().optional(),
});

const benchmarkSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  unit: z.enum(TRAINING_PLAN_BENCHMARK_UNITS),
  retestWeeks: z.array(z.number().int().nonnegative()),
});

const loadPrescriptionSchema = z.object({
  exerciseId: z.string().nonempty(),
  blockId: z.string().nonempty().optional(),
  percentOfMvc: z.tuple([z.number().positive(), z.number().positive()]),
  notes: z.string().nonempty().optional(),
});

function addDuplicateIdIssues(
  ctx: z.RefinementCtx,
  collection: string,
  items: { id: string }[]
) {
  const seen = new Set<string>();
  items.forEach(({ id }, index) => {
    if (seen.has(id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [collection, index, 'id'],
        message: `Duplicate id "${id}"`,
      });
    }
    seen.add(id);
  });
}

export const trainingPlanSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    goal: z.string().nonempty(),
    discipline: z.string().nonempty(),
    durationWeeks: z.number().int().positive(),
    athlete: z.record(z.unknown()),
    exercises: z.array(exerciseSchema),
    sessionTemplates: z.array(sessionTemplateSchema),
    blocks: z.array(blockSchema),
    schedule: z.array(scheduleEntrySchema),
    progressionRules: z.array(
      z.object({
        id: z.string().nonempty(),
        appliesTo: z.string().nonempty(),
        rule: z.string().nonempty(),
      })
    ),
    tindeq: z.object({
      baselineTest: z.object({
        when: z.string().nonempty(),
        protocol: z.string().nonempty(),
        note: z.string().nonempty().optional(),
      }),
      loadPrescription: z.array(loadPrescriptionSchema),
      criticalForceTest: z
        .object({
          protocol: z.string().nonempty(),
          use: z.string().nonempty(),
          optional: z.boolean().optional(),
        })
        .optional(),
      retestWeeks: z.array(z.number().int().nonnegative()),
    }),
    benchmarks: z.array(benchmarkSchema),
    glossary: z.array(
      z.object({
        term: z.string().nonempty(),
        definition: z.string().nonempty(),
      })
    ),
    coachNotes: z.array(z.string().nonempty()),
  })
  .superRefine((plan, ctx) => {
    addDuplicateIdIssues(ctx, 'exercises', plan.exercises);
    addDuplicateIdIssues(ctx, 'sessionTemplates', plan.sessionTemplates);
    addDuplicateIdIssues(ctx, 'blocks', plan.blocks);
    addDuplicateIdIssues(ctx, 'benchmarks', plan.benchmarks);

    const exerciseIds = new Set(plan.exercises.map(({ id }) => id));
    const templateIds = new Set(plan.sessionTemplates.map(({ id }) => id));
    const blockIds = new Set(plan.blocks.map(({ id }) => id));

    plan.sessionTemplates.forEach((template, templateIndex) => {
      template.items.forEach((item, itemIndex) => {
        if (!exerciseIds.has(item.exerciseId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [
              'sessionTemplates',
              templateIndex,
              'items',
              itemIndex,
              'exerciseId',
            ],
            message: `Unknown exercise "${item.exerciseId}"`,
          });
        }
      });
    });

    plan.schedule.forEach((entry, index) => {
      if (
        entry.sessionTemplateId !== null &&
        !templateIds.has(entry.sessionTemplateId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['schedule', index, 'sessionTemplateId'],
          message: `Unknown session template "${entry.sessionTemplateId}"`,
        });
      }
      if (!blockIds.has(entry.blockId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['schedule', index, 'blockId'],
          message: `Unknown block "${entry.blockId}"`,
        });
      }
    });

    plan.tindeq.loadPrescription.forEach((prescription, index) => {
      if (!exerciseIds.has(prescription.exerciseId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tindeq', 'loadPrescription', index, 'exerciseId'],
          message: `Unknown exercise "${prescription.exerciseId}"`,
        });
      }
      if (
        prescription.blockId !== undefined &&
        !blockIds.has(prescription.blockId)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['tindeq', 'loadPrescription', index, 'blockId'],
          message: `Unknown block "${prescription.blockId}"`,
        });
      }
    });

    const blocksByWeek = new Map<number, number>();
    plan.blocks.forEach((block) => {
      block.weeks.forEach((week) => {
        blocksByWeek.set(week, (blocksByWeek.get(week) ?? 0) + 1);
      });
    });
    plan.blocks.forEach((block, blockIndex) => {
      block.weeks.forEach((week, weekIndex) => {
        if (week < 1 || week > plan.durationWeeks) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['blocks', blockIndex, 'weeks', weekIndex],
            message: `Week ${week} is outside 1-${plan.durationWeeks}`,
          });
        } else if ((blocksByWeek.get(week) ?? 0) > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['blocks', blockIndex, 'weeks', weekIndex],
            message: `Week ${week} belongs to more than one block`,
          });
        }
      });
    });
    for (let week = 1; week <= plan.durationWeeks; week++) {
      if (!blocksByWeek.has(week)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['blocks'],
          message: `Week ${week} does not belong to any block`,
        });
      }
    }
  });
