import { Hold } from '@shared/models/climb/climb';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Typography } from '../../../../library/typography';
import ClimbImage from '../../components/climb-detail/climb-image';

type ClimbDetailImageSectionProps = {
  imageUri: string;
  holds: Hold[];
  scrollHeight: number;
  isEditMode: boolean;
  onHoldAdd: (hold: Hold) => void;
  onHoldRemove: (index: number) => void;
};

const ClimbDetailImageSection: FunctionComponent<
  ClimbDetailImageSectionProps
> = ({
  imageUri,
  holds,
  scrollHeight,
  isEditMode,
  onHoldAdd,
  onHoldRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Animated.View layout={LinearTransition}>
      <ClimbImage
        source={{ uri: imageUri }}
        holds={holds}
        style={{
          height: isEditMode ? scrollHeight * 0.6 : scrollHeight,
        }}
        editable={isEditMode}
        onHoldAdd={onHoldAdd}
        onHoldRemove={onHoldRemove}
      />
      {isEditMode && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Typography
            size="callout"
            color="secondary"
            style={{ textAlign: 'center', marginTop: 8 }}
          >
            {t('climbing.mark_holds_hint')}
          </Typography>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default ClimbDetailImageSection;
