import { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../theme';
import { styles } from './screen.styles';

export interface ScreenProps {
  footer?: ReactNode;
  noFooterInsetBottom?: boolean;
  footerStyle?: StyleProp<ViewStyle>;
  keyboardAvoiding?: boolean;
  scrollViewProps?: ScrollViewProps;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const Screen: FunctionComponent<PropsWithChildren<ScreenProps>> = ({
  children,
  footer,
  noFooterInsetBottom = false,
  footerStyle,
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
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[
            styles.footer,
            {
              paddingBottom: noFooterInsetBottom
                ? spacing.lg
                : spacing.lg + insets.bottom,
            },
            footerStyle,
          ]}
        >
          {footer}
        </Animated.View>
      )}
    </>
  );

  return (
    <Animated.View layout={LinearTransition} style={[styles.container, style]}>
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
    </Animated.View>
  );
};

export default Screen;
