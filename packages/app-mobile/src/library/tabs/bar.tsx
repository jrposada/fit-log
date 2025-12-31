import type React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './bar.styles';

export type TabBarItem<T extends string> = {
  id: T;
  label: React.ReactNode;
};

export interface TabsBarProps<T extends string> {
  items: TabBarItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
}

function Bar<T extends string>({
  items,
  activeId,
  onChange,
}: TabsBarProps<T>): React.ReactElement {
  return (
    <View style={styles.tabBar}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.tab, activeId === item.id && styles.activeTab]}
          onPress={() => onChange(item.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeId === item.id && styles.activeTabText,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Bar;
