import { FunctionComponent, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IconButton from '../library/icon-button';
import { shadows, spacing } from '../library/theme';
import SportPickerModal from './sport-picker-modal';

const Fab: FunctionComponent = () => {
  const insets = useSafeAreaInsets();
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <>
      <IconButton
        icon="+"
        size="lg"
        variant="primary"
        rounded
        onPress={() => setPickerVisible(true)}
        style={[
          shadows.cardElevated,
          {
            position: 'absolute',
            alignSelf: 'center',
            bottom: insets.bottom + spacing['3xl'],
          },
        ]}
      />
      <SportPickerModal
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
      />
    </>
  );
};

export default Fab;
