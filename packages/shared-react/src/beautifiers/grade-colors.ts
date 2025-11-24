const GRADE_PALETTE: Record<string, string> = {
  V0: '#B9F6CA',
  V1: '#A5F2B8',
  V2: '#90EEA6',
  V3: '#7BD993',
  V4: '#4CAF50',
  V5: '#FFC947',
  V6: '#FFB300',
  V7: '#FF9800',
  V8: '#F57C00',
  V9: '#EF5350',
  V10: '#E53935',
  V11: '#D32F2F',
  V12: '#C62828',
  V13: '#8E24AA',
  V14: '#7B1FA2',
  V15: '#512DA8',
  V16: '#303F9F',
  V17: '#1A237E',
};

const FALLBACK_COLOR = '#9E9E9E';

/**
 * Maps a climb V-grade string to a stable HEX color.
 *
 * Accepted input formats:
 *  - Single grades (e.g. "V4", "v7") – case-insensitive.
 *  - Ranges like "V5-6" – first grade is used ("V5").
 *  - "VB" (Beginner) – treated as V0.
 *  - Any unparsable / empty value falls back to a neutral grey.
 *
 * Color bands are grouped for visual scanability while still providing
 * incremental distinction:
 *  - Greens: V0–V4 (intro & fundamental progression)
 *  - Ambers / Oranges: V5–V8 (intermediate difficulty)
 *  - Reds: V9–V12 (advanced / powerful)
 *  - Purples / Indigos: V13–V17 (elite / high-end)
 *
 * Example:
 *  beautifyGradeColor('V6') -> '#FFB300'
 *  beautifyGradeColor('v10') -> '#E53935'
 *  beautifyGradeColor('VB') -> '#B9F6CA'
 *  beautifyGradeColor('Unknown') -> '#9E9E9E'
 *
 * @param grade Raw grade string from user or data source.
 * @returns A HEX color string representing the grade band.
 */
function beautifyGradeColor(grade: string): string {
  if (!grade) return FALLBACK_COLOR;

  const normalized = grade.trim().toUpperCase();

  if (normalized === 'VB') return GRADE_PALETTE['V0'];

  const match = normalized.match(/V(\d{1,2})/);

  if (!match) return FALLBACK_COLOR;

  const key = `V${match[1]}`;
  return GRADE_PALETTE[key] || FALLBACK_COLOR;
}

export { beautifyGradeColor };
