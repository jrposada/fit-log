import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FunctionComponent } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconName } from '../library/icon';
import { accent, ink } from '../library/theme';
import { styles } from './bottom-tab-bar.styles';

const TAB_ICONS: Record<string, IconName> = {
  Home: 'home',
  Explore: 'explore',
  Activity: 'query-stats',
};

const BottomTabBar: FunctionComponent<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]!;
        const label = (options.tabBarLabel ??
          options.title ??
          route.name) as string;
        const isFocused = state.index === index;
        const icon = TAB_ICONS[route.name] ?? 'circle';

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={handlePress}
            style={[styles.tab, isFocused && styles.tabActive]}
          >
            <Icon
              icon={icon}
              size="md"
              color={isFocused ? accent.onAccent : ink.secondary}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? accent.onAccent : ink.secondary },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
