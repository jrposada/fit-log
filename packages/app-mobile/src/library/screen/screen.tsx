import { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../theme';
import { styles } from './screen.styles';

export interface ScreenProps {
  footer?: ReactNode;
  keyboardAvoiding?: boolean;
  scrollViewProps?: ScrollViewProps;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const Screen: FunctionComponent<PropsWithChildren<ScreenProps>> = ({
  children,
  footer,
  keyboardAvoiding = false,
  scrollViewProps,
  contentStyle,
  style,
}) => {
  const insets = useSafeAreaInsets();

  const content = (
    <>
      <ScrollView style={[styles.scroll, contentStyle]} {...scrollViewProps}>
        {children}
      </ScrollView>
      {footer && (
        <View
          style={[styles.footer, { paddingBottom: spacing.lg + insets.bottom }]}
        >
          {footer}
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.container, style]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
};

export default Screen;
