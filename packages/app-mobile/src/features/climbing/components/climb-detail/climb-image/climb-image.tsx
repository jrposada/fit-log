import { Hold, SplinePoint } from '@shared/models/climb/climb';
import { FunctionComponent, useCallback } from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import InteractiveImage from '../../../../../library/interactive-image';
import ClimbImageOverlay from './climb-image-overlay';

type EditMode = 'holds' | 'spline';

interface ClimbImageProps {
  source: ImageSourcePropType;
  holds: Hold[];
  spline: SplinePoint[];
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
  editMode?: EditMode;
  onHoldAdd?: (hold: Hold) => void;
  onHoldRemove?: (index: number) => void;
  onSplinePointAdd?: (point: SplinePoint) => void;
  onSplinePointRemoveLast?: () => void;
}

const HOLD_HIT_RADIUS = 0.05; // normalized distance (5% of image dimension)
const SPLINE_POINT_HIT_RADIUS = 0.05;

const ClimbImage: FunctionComponent<ClimbImageProps> = ({
  source,
  holds,
  spline,
  style,
  editable = false,
  editMode = 'holds',
  onHoldAdd,
  onHoldRemove,
  onSplinePointAdd,
  onSplinePointRemoveLast,
}) => {
  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
      // point.x and point.y are already normalized 0-1 by InteractiveImage

      if (editMode === 'spline') {
        // In spline mode: tap near last control point to undo, otherwise add
        if (spline.length > 0) {
          const last = spline[spline.length - 1];
          const dx = point.x - last.x;
          const dy = point.y - last.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance <= SPLINE_POINT_HIT_RADIUS) {
            onSplinePointRemoveLast?.();
            return;
          }
        }
        onSplinePointAdd?.(point);
        return;
      }

      // Holds mode: existing behavior
      for (let i = 0; i < holds.length; i++) {
        const dx = point.x - holds[i].x;
        const dy = point.y - holds[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= HOLD_HIT_RADIUS) {
          onHoldRemove?.(i);
          return;
        }
      }

      onHoldAdd?.(point);
    },
    [
      editMode,
      holds,
      spline,
      onHoldAdd,
      onHoldRemove,
      onSplinePointAdd,
      onSplinePointRemoveLast,
    ]
  );

  return (
    <InteractiveImage
      source={source}
      style={style}
      onTap={editable ? handleTap : undefined}
    >
      <ClimbImageOverlay
        holds={holds}
        spline={spline}
        editable={editable}
        editMode={editMode}
      />
    </InteractiveImage>
  );
};

export default ClimbImage;
export type { ClimbImageProps, EditMode };
