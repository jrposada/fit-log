type Point = { x: number; y: number };

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

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  // Pad the array: duplicate first and last points so every interior
  // segment has four surrounding control points.
  const pts: Point[] = [points[0], ...points, points[points.length - 1]];

  const parts: string[] = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < pts.length - 3; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const p2 = pts[i + 2];
    const p3 = pts[i + 3];

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
