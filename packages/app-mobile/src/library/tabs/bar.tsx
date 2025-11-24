import type React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
  },
});

export default Bar;
