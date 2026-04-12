import { Hold, SplinePoint } from '@shared/models/climb/climb';
import { FunctionComponent, useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { accent, surfaces } from '../../../../../library/theme';
import { catmullRomToSvgPath } from './catmull-rom';
import { EditMode } from './climb-image';

const HOLD_RADIUS = 12;
const HOLD_BORDER = 2;
const HOLD_FILL = 'rgba(255, 0, 0, 0.5)';
const HOLD_FILL_EDITABLE = 'rgba(255, 0, 0, 0.7)';
const HOLD_X_SIZE = 4;
const HOLD_X_STROKE = 2;

const SPLINE_STROKE = 3;
const SPLINE_CONTROL_RADIUS = 5;
const SPLINE_CONTROL_BORDER = 1;

interface ClimbImageOverlayProps {
  holds: Hold[];
  spline: SplinePoint[];
  editable?: boolean;
  editMode?: EditMode;
}

const ClimbImageOverlay: FunctionComponent<ClimbImageOverlayProps> = ({
  holds,
  spline,
  editable = false,
  editMode = 'holds',
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height }
    );
  }, []);

  const hasContent = holds.length > 0 || spline.length > 0;

  if (!hasContent) {
    return <View style={styles.container} onLayout={handleLayout} />;
  }

  const { width, height } = size;
  const ready = width > 0 && height > 0;

  const toPixel = (p: { x: number; y: number }) => ({
    x: p.x * width,
    y: p.y * height,
  });

  // Pre-compute spline path
  const splinePixels = ready ? spline.map(toPixel) : [];
  const splinePath = ready ? catmullRomToSvgPath(splinePixels) : '';

  return (
    <View style={styles.container} onLayout={handleLayout} pointerEvents="none">
      {ready && (
        <Svg viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
          {/* Spline curve */}
          {splinePath !== '' && (
            <Path
              d={splinePath}
              stroke={accent.primary}
              strokeWidth={SPLINE_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Spline control points (edit mode) */}
          {editable &&
            editMode === 'spline' &&
            splinePixels.map((p, i) => (
              <Circle
                key={`sp-${i}`}
                cx={p.x}
                cy={p.y}
                r={SPLINE_CONTROL_RADIUS}
                fill={accent.primary}
                stroke={surfaces.base}
                strokeWidth={SPLINE_CONTROL_BORDER}
              />
            ))}

          {/* Hold circles */}
          {holds.map((hold, i) => {
            const p = toPixel(hold);
            return (
              <Circle
                key={`hold-${i}`}
                cx={p.x}
                cy={p.y}
                r={HOLD_RADIUS}
                fill={editable ? HOLD_FILL_EDITABLE : HOLD_FILL}
                stroke={surfaces.base}
                strokeWidth={HOLD_BORDER}
              />
            );
          })}

          {/* "x" marks on holds in hold-edit mode */}
          {editable &&
            editMode === 'holds' &&
            holds.map((hold, i) => {
              const p = toPixel(hold);
              return (
                <Line
                  key={`hx-${i}`}
                  x1={p.x - HOLD_X_SIZE}
                  y1={p.y - HOLD_X_SIZE}
                  x2={p.x + HOLD_X_SIZE}
                  y2={p.y + HOLD_X_SIZE}
                  stroke={surfaces.base}
                  strokeWidth={HOLD_X_STROKE}
                />
              );
            })}
          {editable &&
            editMode === 'holds' &&
            holds.map((hold, i) => {
              const p = toPixel(hold);
              return (
                <Line
                  key={`hx2-${i}`}
                  x1={p.x + HOLD_X_SIZE}
                  y1={p.y - HOLD_X_SIZE}
                  x2={p.x - HOLD_X_SIZE}
                  y2={p.y + HOLD_X_SIZE}
                  stroke={surfaces.base}
                  strokeWidth={HOLD_X_STROKE}
                />
              );
            })}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ClimbImageOverlay;
export type { ClimbImageOverlayProps };
