type Point = { x: number; y: number };

type CatmullRomSegment = {
  p1: Point;
  p2: Point;
  cp1: Point;
  cp2: Point;
};

function buildSegments(points: Point[], alpha: number): CatmullRomSegment[] {
  if (points.length < 2) return [];

  if (points.length === 2) {
    const p0 = points[0]!;
    const p1 = points[1]!;
    // Treat the straight line as a degenerate cubic so sampling logic is uniform.
    return [{ p1: p0, p2: p1, cp1: p0, cp2: p1 }];
  }

  const pts = [points[0]!, ...points, points[points.length - 1]!];
  const segments: CatmullRomSegment[] = [];

  for (let i = 0; i < pts.length - 3; i++) {
    const p0 = pts[i]!;
    const p1 = pts[i + 1]!;
    const p2 = pts[i + 2]!;
    const p3 = pts[i + 3]!;

    const d1 = Math.pow(Math.hypot(p1.x - p0.x, p1.y - p0.y), alpha);
    const d2 = Math.pow(Math.hypot(p2.x - p1.x, p2.y - p1.y), alpha);
    const d3 = Math.pow(Math.hypot(p3.x - p2.x, p3.y - p2.y), alpha);

    const d1Safe = d1 || 1;
    const d2Safe = d2 || 1;
    const d3Safe = d3 || 1;

    const cp1 = {
      x: p1.x + (p2.x - p0.x) / (3 * (1 + d1Safe / d2Safe)),
      y: p1.y + (p2.y - p0.y) / (3 * (1 + d1Safe / d2Safe)),
    };
    const cp2 = {
      x: p2.x - (p3.x - p1.x) / (3 * (1 + d3Safe / d2Safe)),
      y: p2.y - (p3.y - p1.y) / (3 * (1 + d3Safe / d2Safe)),
    };

    segments.push({ p1, p2, cp1, cp2 });
  }

  return segments;
}

function evalCubicBezier(seg: CatmullRomSegment, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * seg.p1.x + b * seg.cp1.x + c * seg.cp2.x + d * seg.p2.x,
    y: a * seg.p1.y + b * seg.cp1.y + c * seg.cp2.y + d * seg.p2.y,
  };
}

/**
 * Returns the segment whose curve passes closest to `target`, along with that
 * minimum distance. Sampling resolution is controlled by `samplesPerSegment`.
 * Returns null if there are fewer than 2 points.
 */
export function closestSegmentToPoint(
  points: Point[],
  target: Point,
  samplesPerSegment = 20,
  alpha = 0.5
): { segmentIndex: number; distance: number } | null {
  const segments = buildSegments(points, alpha);
  if (segments.length === 0) return null;

  let bestIdx = -1;
  let bestDist = Infinity;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    for (let s = 0; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const pt = evalCubicBezier(seg, t);
      const d = Math.hypot(pt.x - target.x, pt.y - target.y);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
  }

  return { segmentIndex: bestIdx, distance: bestDist };
}

/**
 * Convert an ordered array of points into an SVG path `d` string
 * using Catmull-Rom → cubic-bezier conversion.
 *
 * The curve passes through every point (interpolating spline).
 * Alpha parameter controls parameterisation:
 *   0 = uniform, 0.5 = centripetal (default), 1 = chordal
 */
export function catmullRomToSvgPath(points: Point[], alpha = 0.5): string {
  if (points.length < 2) return '';

  const point0 = points[0]!;
  const point1 = points[1]!;

  if (points.length === 2) {
    return `M ${point0.x} ${point0.y} L ${point1.x} ${point1.y}`;
  }

  // Pad the array: duplicate first and last points so every interior
  // segment has four surrounding control points.
  const pts = [point0, ...points, points[points.length - 1]]!;

  const parts: string[] = [`M ${point0.x} ${point0.y}`];

  for (let i = 0; i < pts.length - 3; i++) {
    const p0 = pts[i]!;
    const p1 = pts[i + 1]!;
    const p2 = pts[i + 2]!;
    const p3 = pts[i + 3]!;

    // Knot intervals (centripetal parameterisation)
    const d1 = Math.pow(Math.hypot(p1.x - p0.x, p1.y - p0.y), alpha);
    const d2 = Math.pow(Math.hypot(p2.x - p1.x, p2.y - p1.y), alpha);
    const d3 = Math.pow(Math.hypot(p3.x - p2.x, p3.y - p2.y), alpha);

    // Avoid division by zero for coincident points
    const d1Safe = d1 || 1;
    const d2Safe = d2 || 1;
    const d3Safe = d3 || 1;

    // Cubic bezier control points derived from Catmull-Rom
    const cp1x = p1.x + (p2.x - p0.x) / (3 * (1 + d1Safe / d2Safe));
    const cp1y = p1.y + (p2.y - p0.y) / (3 * (1 + d1Safe / d2Safe));

    const cp2x = p2.x - (p3.x - p1.x) / (3 * (1 + d3Safe / d2Safe));
    const cp2y = p2.y - (p3.y - p1.y) / (3 * (1 + d3Safe / d2Safe));

    parts.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
  }

  return parts.join(' ');
}
