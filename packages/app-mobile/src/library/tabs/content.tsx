import type React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export type TabContentItem<T extends string> = {
  id: T;
  content: React.ReactNode;
};

export interface TabsContentProps<T extends string> {
  items: TabContentItem<T>[];
  activeId: T;
}

function Content<T extends string>({
  items,
  activeId,
}: TabsContentProps<T>): React.ReactElement {
  const activeItem = items.find((i) => i.id === activeId);
  return (
    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.inner}>{activeItem?.content}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  inner: {
    padding: 20,
  },
});

export default Content;
