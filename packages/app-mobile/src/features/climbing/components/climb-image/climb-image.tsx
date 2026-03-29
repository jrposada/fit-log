import { Hold } from '@shared/models/climb/climb';
import { FunctionComponent } from 'react';
import { ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';

import InteractiveImage from '../../../../library/interactive-image';
import { styles } from './climb-image.styles';

interface ClimbImageProps {
  source: ImageSourcePropType;
  holds: Hold[];
  style?: StyleProp<ViewStyle>;
}

const ClimbImage: FunctionComponent<ClimbImageProps> = ({
  source,
  holds,
  style,
}) => {
  return (
    <InteractiveImage source={source} style={style}>
      {holds.length > 0 && (
        <View style={styles.container}>
          {holds.map((hold: Hold, index: number) => (
            <View
              key={`hold-${index}`}
              style={[
                styles.hold,
                {
                  left: `${hold.x * 100}%`,
                  top: `${hold.y * 100}%`,
                },
              ]}
            />
          ))}
        </View>
      )}
    </InteractiveImage>
  );
};

export default ClimbImage;
export type { ClimbImageProps };
