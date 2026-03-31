import { FunctionComponent, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import IconButton from '../icon-button';
import { colors, spacing } from '../theme';
import { styles } from './screen-header.styles';

export interface ScreenHeaderProps {
  title: string | undefined;
  subtitle?: string;
  onBackPress?: () => void;
  extra?: ReactNode;
  action?: ReactNode;
  loading?: boolean;
  mode?: 'screen' | 'modal';
}

const ScreenHeader: FunctionComponent<ScreenHeaderProps> = ({
  title = '',
  subtitle,
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
        {onBackPress && (
          <IconButton
            variant="ghost"
            icon="←"
            onPress={onBackPress}
            color={colors.headerText}
            size="lg"
          />
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
            {loading ? '...' : ''}
          </Text>
          {subtitle && (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {extra && <View style={styles.extra}>{extra}</View>}
      </View>
      {action}
    </View>
  );
};

export default ScreenHeader;
