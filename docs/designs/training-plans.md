# Training plans

Date: 2026-10-23
Source: `climbing-plan-brief.md`, `climbing-plan.json`

## Goal

Follow the 12-week bouldering plan day by day on the phone: see today's
sessions with their prescriptions, log what was actually done per set, see
hangboard loads in kg derived from the latest Tindeq max, and log benchmark
retests.

## Decisions

| Topic | Decision |
|---|---|
| Plan ownership | Global, read-only catalog seeded from JSON. Users own only enrollments, session logs and benchmark results. |
| Storage shape | One `TrainingPlan` Mongo document embedding exercises, templates, blocks, schedule, benchmarks, tindeq, rules, glossary, notes. |
| Tindeq input | Hand-entered as benchmark results. No device/export import. |
| Tindeq meaning | MVC is total load (bodyweight + added). Added hang load = `% × MVC − bodyweight`; negative = pulley assist. |
| Logging granularity | Per set (reps, kg, hold s, duration min, RPE) per prescribed item, plus done/skipped and notes. |
| Sessions | A planned session is a `TrainingSession`. Climb templates → `sport: 'climbing'` (existing climb tracking still works inside it); gym templates → new `sport: 'gym'`. |
| "Today" | Enrollment has a `startDate` that must be a Monday. Day resolution runs client-side on the local date. |
| Units | kg and seconds, as in the plan. |
| Load auto-adjustment | None. `progressionRules` are displayed as text only. |
| Platform | `app-mobile` only. |

## Data model

### Shared types — `shared/src/models/training-plans/training-plan.ts`

API types plus a zod schema (`trainingPlanSchema`) mirroring the JSON in
camelCase. The seed converts snake_case keys to camelCase before parsing.

```ts
type Range = { min: number; max: number };
type NumberOrRange = number | Range;

type TrainingPlanPrescription = {
  sets?: NumberOrRange;
  setsByWeek?: Record<number, number>; // key = week within block (1-based)
  reps?: NumberOrRange | null;          // null = max reps
  holdS?: NumberOrRange;
  onS?: NumberOrRange;
  offS?: NumberOrRange;
  restS?: NumberOrRange;
  durationMin?: NumberOrRange;
  rpe?: NumberOrRange;
  unit?: string;        // 'problems' | 'sets' | ...
  loadHint?: string;
  intensity?: string;
  notes?: string;
};

type TrainingPlanItem = {
  order: number;
  section: 'warmup' | 'main' | 'accessory' | 'cooldown';
  exerciseId: string;
  prescription: TrainingPlanPrescription;
};

type TrainingPlanSessionTemplate = {
  id: string; name: string; type: 'gym' | 'climb'; focus: string;
  durationMin?: number; optional?: boolean;
  items: TrainingPlanItem[];
};

type TrainingPlanExercise = {
  id: string; name: string; category: string; equipment: string[];
  description: string; cues?: string[]; tindeqLoad?: string; // display text, e.g. '60-70% of open-hand MVC-7'
};

type TrainingPlanBlock = { id: string; name: string; weeks: number[]; focus: string };

type TrainingPlanScheduleEntry = {
  blockId: string; day: 1|2|3|4|5|6|7; slot: 'am' | 'pm' | 'any';
  sessionTemplateId: string | null; notes?: string;
};

type TrainingPlanBenchmark = {
  id: string; name: string;
  unit: 'kg' | 'v_grade' | 'rounds' | 'minutes' | 'text';
  retestWeeks: number[];
};

type TrainingPlan = {
  id: string; name: string; goal: string; discipline: string;
  durationWeeks: number;
  athlete: Record<string, unknown>;
  exercises: TrainingPlanExercise[];
  sessionTemplates: TrainingPlanSessionTemplate[];
  blocks: TrainingPlanBlock[];
  schedule: TrainingPlanScheduleEntry[];   // flattened from weekly_schedule
  progressionRules: { id: string; appliesTo: string; rule: string }[];
  tindeq: {
    baselineTest: { when: string; protocol: string; note?: string };
    loadPrescription: { exerciseId: string; blockId?: string; percentOfMvc: [number, number]; notes?: string }[];
    criticalForceTest?: { protocol: string; use: string; optional?: boolean };
    retestWeeks: number[];
  };
  benchmarks: TrainingPlanBenchmark[];
  glossary: { term: string; definition: string }[];
  coachNotes: string[];
};
```

Seed-time normalisation (in the CLI, not the schema):
- `x_min`/`x_max` → `x: { min, max }`; plain `x` kept as number.
- Item prescription fields move under `prescription`.
- `weekly_schedule: { [blockId]: entry[] }` → flat `schedule` with `blockId`.
- `session_id` → `sessionTemplateId`; `tindeq.load_prescription[].block` → `blockId`.

Schema refinements (fail with a path-qualified message):
1. Every `items[].exerciseId` and `loadPrescription[].exerciseId` resolves to an exercise.
2. Every non-null `schedule[].sessionTemplateId` resolves to a template.
3. Every `schedule[].blockId` and `loadPrescription[].blockId` resolves to a block.
4. Every week `1..durationWeeks` belongs to exactly one block; no block week outside that range.
5. Ids are unique within exercises, templates, blocks and benchmarks.

### Backend models — `backend/src/data/models/`

- `training-plan.ts` — `TrainingPlan` document of the shape above (`id` string,
  unique index). No owner. Read-only via API.
- `plan-enrollment.ts` — `{ owner, planId: string, startDate: Date,
  status: 'active' | 'completed' | 'abandoned' }`, timestamps. Partial unique
  index on `{ owner }` where `status: 'active'`.
- `benchmark-result.ts` — `{ owner, enrollment, benchmarkId: string,
  date: Date, week: number, value: number | string, notes? }`, timestamps.
  Index `{ owner, enrollment, benchmarkId, date: -1 }`.
- `training-session.ts` (extended):
  - `sport` enum becomes `'climbing' | 'gym'`.
  - Optional `planned: { enrollment, sessionTemplateId, week, day, slot }`.
  - `itemLogs: { itemOrder, exerciseId, status: 'done' | 'skipped', notes?,
    sets: { reps?, weightKg?, holdS?, durationMin?, rpe? }[] }[]`, default `[]`.

### Seed data

`climbing-plan.json` moves to `packages/cli/src/commands/seed/data/climbing-plan.json`
and gains a `bodyweight` benchmark (`unit: 'kg'`, `retest_weeks: [0, 4, 8, 12]`).

## Domain logic — `shared/src/common/training-plans/`

Pure functions, unit-tested with vitest.

- `resolvePlanDay(plan, startDate, date)` →
  `{ status: 'before' } | { status: 'after' } |
   { status: 'active', week, day, block, entries: TrainingPlanScheduleEntry[] }`.
  `week = floor(daysBetween(startDate, date) / 7) + 1`, `day` = ISO weekday.
  Dates compared as local calendar days.
- `weekInBlock(block, week)` → 1-based index of `week` within `block.weeks`.
- `resolvePrescription(item, block, week)` → prescription with `sets`
  replaced by `setsByWeek[weekInBlock]` when present.
- `hangLoad(plan, exerciseId, blockId, mvcKg, bodyweightKg?)` →
  `null` when the exercise has no load prescription; otherwise
  `{ percent: Range, totalKg: Range, addedKg?: Range }` with values rounded
  to 0.5 kg. Block-specific prescription wins over the generic one.
  `addedKg = totalKg − bodyweightKg` (negative = assist); omitted without
  bodyweight.
- `benchmarksDue(plan, week)` → benchmarks whose `retestWeeks` include `week`
  (week 0 = before start).

## API

All routes authenticated; handler → service → `toApi*` mapper per
`backend/src/api/routes/README.md`. Shared request/response types and zod
schemas per route file under `shared/src/models/<resource>/`, with type tests.

| Route | Notes |
|---|---|
| `GET /training-plans` | List (id, name, goal, durationWeeks). |
| `GET /training-plans/:id` | Full plan. |
| `GET /plan-enrollments/active` | Current user's active enrollment or `null`. |
| `PUT /plan-enrollments` | Create (planId, startDate) or update status. |
| `GET /benchmark-results?enrollment=` | Owner's results for an enrollment. |
| `PUT /benchmark-results` | Create/update. Server derives `week` from enrollment start and `date`. |
| `DELETE /benchmark-results/:id` | Owner only. |
| `PUT /training-sessions` (extended) | Accepts `sport: 'gym'`, `planned`, `itemLogs`. |

Validation (domain errors from `src/infrastructure/`):
- Enroll: plan exists; `startDate` is a Monday; no other active enrollment.
- Training session with `planned`: enrollment exists, is owned and active;
  `planned.week` is in `1..durationWeeks`; an entry with that
  `sessionTemplateId`, `day`, `slot` exists in the block containing the week;
  `sport` matches the template type (`climb` → `climbing`, `gym` → `gym`);
  each `itemLogs[].itemOrder` exists in the template with matching `exerciseId`.
- Benchmark result: benchmark id exists in the enrollment's plan; value type
  matches unit (number for numeric units, string for `v_grade`/`text`).

Feed/summary: add a minimal `gym` adapter alongside `feed-adapter-climbing.ts`
and `feed-stats-adapter-climbing.ts`. Summary headline `"<done>/<total> exercises"`.

## React hooks — `shared-react/src/api/`

`training-plans/` (`useTrainingPlans`, `useTrainingPlansById`),
`plan-enrollments/` (`usePlanEnrollmentsActive`, `usePlanEnrollmentsPut`),
`benchmark-results/` (`useBenchmarkResults`, `useBenchmarkResultsPut`,
`useBenchmarkResultsDelete`), matching the existing `use-training-sessions-*.ts`.

## Mobile UI — `app-mobile`

No new tab. Entry point is Home.

- **Home "Today" card.** No enrollment → "Start a plan". Active → week, block
  name, today's entries (slot, template name, optional flag, notes), rest-day
  notes, "Benchmarks due" chip in retest weeks. Before start → countdown and
  baseline-test reminder. After end → "Plan complete".
- **PlanEnroll screen.** Plan picker, Monday-only start date (default next
  Monday), Tindeq baseline-test protocol text.
- **PlanOverview screen.** Weeks grouped by block; each scheduled entry shows
  done / skipped / upcoming from linked `TrainingSession`s. Tapping an entry
  opens PlannedSessionDetail. Collapsible glossary, coach notes, progression
  rules. Abandon plan action.
- **PlannedSessionDetail screen.** Items grouped by section with the effective
  prescription and, for Tindeq items, total/added kg from the latest
  `open_hand_mvc` and `bodyweight` results (prompt to log them when missing).
  **Start** creates the `TrainingSession` with `planned` and enters the
  existing active-session flow.
- **Active session flyover (extended).** For planned sessions: item list with
  done/skip toggle and per-set rows. Visible set fields follow the
  prescription (reps, kg, hold s, duration min, RPE). Rows pre-filled from the
  prescription and the last logged sets of the same exercise. Climbing
  sessions keep the current-climb tracking below the items.
- **Benchmarks screen.** Plan benchmarks with latest value and history; log
  form (value, date, notes).

All strings go through i18n like existing screens.

## Testing

- vitest added to `shared` (version matching `app-web`, 3.2.4) with a `test`
  script.
- Unit tests: `resolvePlanDay` (before start, week boundaries, deload week,
  after end), `weekInBlock`, `resolvePrescription` (`setsByWeek`, ranges),
  `hangLoad` (block override, rounding, bodyweight subtraction, assist,
  no bodyweight), `benchmarksDue`, `trainingPlanSchema` (seed JSON passes;
  broken refs, week gaps and overlaps fail).
- Type tests for each new shared model, following `workout.test.ts`.
- Backend has no runtime test runner: `lint:types` plus a manual seed against
  the dev DB and exercising the routes.
- Mobile: `lint:types` and a simulator run-through.

## Delivery order

1. Shared plan schema, pure functions, vitest.
2. `TrainingPlan` model, seed command, catalog routes + hooks.
3. Enrollment model, routes, hooks.
4. Benchmark results model, routes, hooks.
5. `TrainingSession` extension + gym feed adapter.
6. Mobile: Today card, PlanEnroll, PlanOverview.
7. Mobile: PlannedSessionDetail and flyover item logging.
8. Mobile: Benchmarks screen.

## Out of scope

Plan editing in-app, multiple concurrent plans, automatic load progression,
Tindeq device/export import, web UI.
