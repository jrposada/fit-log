import { Hold } from '@shared/models/climb/climb';
import { FunctionComponent, useCallback } from 'react';
import {
  ImageSourcePropType,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import InteractiveImage from '../../../../library/interactive-image';
import { styles } from './climb-image.styles';

interface ClimbImageProps {
  source: ImageSourcePropType;
  holds: Hold[];
  style?: StyleProp<ViewStyle>;
  editable?: boolean;
  onHoldAdd?: (hold: Hold) => void;
  onHoldRemove?: (index: number) => void;
}

const HOLD_HIT_RADIUS = 0.05; // normalized distance (5% of image dimension)

const ClimbImage: FunctionComponent<ClimbImageProps> = ({
  source,
  holds,
  style,
  editable = false,
  onHoldAdd,
  onHoldRemove,
}) => {
  const handleTap = useCallback(
    (point: { x: number; y: number }) => {
      // point.x and point.y are already normalized 0-1 by InteractiveImage

      // Check if tap is near an existing hold
      for (let i = 0; i < holds.length; i++) {
        const dx = point.x - holds[i].x;
        const dy = point.y - holds[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= HOLD_HIT_RADIUS) {
          onHoldRemove?.(i);
          return;
        }
      }

      // Add new hold
      onHoldAdd?.(point);
    },
    [holds, onHoldAdd, onHoldRemove]
  );

  return (
    <InteractiveImage
      source={source}
      style={style}
      onTap={editable ? handleTap : undefined}
    >
      {holds.length > 0 && (
        <View style={styles.container} pointerEvents="none">
          {holds.map((hold: Hold, index: number) => (
            <View
              key={`hold-${index}`}
              style={[
                styles.hold,
                editable && styles.holdEditable,
                {
                  left: `${hold.x * 100}%`,
                  top: `${hold.y * 100}%`,
                },
              ]}
            >
              {editable && <Text style={styles.holdRemoveIndicator}>x</Text>}
            </View>
          ))}
        </View>
      )}
    </InteractiveImage>
  );
};

export default ClimbImage;
export type { ClimbImageProps };
