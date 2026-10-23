type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function camelizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(camelizeKeys);
  }
  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        toCamelCase(key),
        camelizeKeys(child),
      ])
    );
  }
  return value;
}

/** Folds `xMin`/`xMax` pairs into `x: { min, max }`. A lone `xMin` (e.g.
 * `durationMin`) is a field of its own and is kept as is. */
function foldRanges(prescription: JsonObject): JsonObject {
  const folded: JsonObject = {};
  for (const [key, value] of Object.entries(prescription)) {
    const base = key.replace(/(Min|Max)$/, '');
    const isRangeBound =
      base !== key &&
      `${base}Min` in prescription &&
      `${base}Max` in prescription;
    if (!isRangeBound) {
      folded[key] = value;
    } else if (key.endsWith('Min')) {
      folded[base] = { min: value, max: prescription[`${base}Max`] };
    }
  }
  return folded;
}

function normalizeItem(item: unknown): unknown {
  if (!isObject(item)) {
    return item;
  }
  const { order, section, exerciseId, ...prescription } = item;
  return { order, section, exerciseId, prescription: foldRanges(prescription) };
}

function normalizeSessionTemplate(template: unknown): unknown {
  if (!isObject(template) || !Array.isArray(template.items)) {
    return template;
  }
  return { ...template, items: template.items.map(normalizeItem) };
}

function flattenSchedule(weeklySchedule: unknown): unknown {
  if (!isObject(weeklySchedule)) {
    return weeklySchedule;
  }
  return Object.entries(weeklySchedule).flatMap(([blockId, entries]) =>
    (Array.isArray(entries) ? entries : [entries]).map((entry) => {
      if (!isObject(entry)) {
        return entry;
      }
      const { sessionId, ...rest } = entry;
      return { blockId, ...rest, sessionTemplateId: sessionId };
    })
  );
}

function normalizeTindeq(tindeq: unknown): unknown {
  if (!isObject(tindeq) || !Array.isArray(tindeq.loadPrescription)) {
    return tindeq;
  }
  return {
    ...tindeq,
    loadPrescription: tindeq.loadPrescription.map((prescription: unknown) => {
      if (!isObject(prescription)) {
        return prescription;
      }
      const { block, ...rest } = prescription;
      return block === undefined ? rest : { ...rest, blockId: block };
    }),
  };
}

/**
 * Converts the snake_case seed file into the shape `trainingPlanSchema`
 * expects. Malformed parts are passed through untouched so the schema reports
 * them with their path.
 */
export function normalizeTrainingPlanJson(raw: unknown): unknown {
  const json = camelizeKeys(raw);
  if (!isObject(json)) {
    return json;
  }

  const plan = isObject(json.plan) ? json.plan : {};
  return {
    id: plan.id,
    name: plan.name,
    goal: plan.goal,
    discipline: plan.discipline,
    durationWeeks: plan.durationWeeks,
    athlete: plan.athlete,
    exercises: json.exercises,
    sessionTemplates: Array.isArray(json.sessionTemplates)
      ? json.sessionTemplates.map(normalizeSessionTemplate)
      : json.sessionTemplates,
    blocks: json.blocks,
    schedule: flattenSchedule(json.weeklySchedule),
    progressionRules: json.progressionRules,
    tindeq: normalizeTindeq(json.tindeq),
    benchmarks: json.benchmarks,
    glossary: json.glossary,
    coachNotes: json.coachNotes,
  };
}
