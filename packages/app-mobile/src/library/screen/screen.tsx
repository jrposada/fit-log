import { FunctionComponent, PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, spacing as spacingTokens } from '../theme';
import { footerVariantStyles, styles } from './screen.styles';

type SpacingToken = keyof typeof spacingTokens;

export interface ScreenProps {
  presentation?: 'modal' | 'fullscreen';
  footer?: ReactNode;
  noFooterInsetBottom?: boolean;
  footerVariant?: 'default' | 'transparent';
  keyboardAvoiding?: boolean;
  padding?: SpacingToken;
  paddingHorizontal?: SpacingToken;
  paddingVertical?: SpacingToken;
  centered?: boolean;
  stickyHeaderIndices?: number[];
  onContentLayout?: (event: LayoutChangeEvent) => void;
}

const Screen: FunctionComponent<PropsWithChildren<ScreenProps>> = ({
  children,
  presentation = 'fullscreen',
  footer,
  noFooterInsetBottom = false,
  footerVariant = 'default',
  keyboardAvoiding = false,
  padding,
  paddingHorizontal,
  paddingVertical,
  centered = false,
  stickyHeaderIndices,
  onContentLayout,
}) => {
  const insets = useSafeAreaInsets();

  const contentContainerStyle: ViewStyle = {
    ...(presentation === 'modal' &&
      footer === null && { paddingBottom: insets.bottom }),
    ...(presentation === 'modal' &&
      footer !== null && { paddingBottom: spacing.lg }),
    ...(padding != null && { padding: spacingTokens[padding] }),
    ...(paddingHorizontal != null && {
      paddingHorizontal: spacingTokens[paddingHorizontal],
    }),
    ...(paddingVertical != null && {
      paddingVertical: spacingTokens[paddingVertical],
    }),
    ...(centered && { flex: 1, justifyContent: 'center' }),
  };

  const content = (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={contentContainerStyle}
        scrollEnabled={!centered}
        stickyHeaderIndices={stickyHeaderIndices}
        onLayout={onContentLayout}
        keyboardShouldPersistTaps={keyboardAvoiding ? 'handled' : 'never'}
      >
        {children}
      </ScrollView>
      {footer && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={[
            footerVariantStyles[footerVariant],
            {
              paddingBottom:
                noFooterInsetBottom && presentation !== 'modal'
                  ? spacingTokens.lg
                  : spacingTokens.lg + insets.bottom,
            },
          ]}
        >
          {footer}
        </Animated.View>
      )}
    </>
  );

  return (
    <Animated.View layout={LinearTransition} style={styles.container}>
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
