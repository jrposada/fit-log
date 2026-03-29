import { FunctionComponent, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../theme';
import { styles } from './screen-header.styles';

export interface ScreenHeaderProps {
  title: string | undefined;
  back?: boolean;
  onBackPress?: () => void;
  extra?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  mode?: 'screen' | 'modal';
}

const ScreenHeader: FunctionComponent<ScreenHeaderProps> = ({
  title = '',
  back = false,
  onBackPress,
  extra,
  action,
  loading = false,
  mode = 'screen',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: mode === 'screen' ? insets.top : spacing.sm },
      ]}
    >
      <View style={styles.leftSection}>
        {back && (
          <Pressable onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
          {loading ? '...' : ''}
        </Text>
        {extra && <View style={styles.extra}>{extra}</View>}
      </View>
      {action}
    </View>
  );
};

export default ScreenHeader;
