import type React from 'react';
import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { styles } from './content.styles';

export type TabContentItem<T extends string> = {
  id: T;
  content: React.ReactNode;
  footer?: ReactNode;
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.inner}>{activeItem?.content}</View>
      </ScrollView>
      {activeItem?.footer && (
        <View style={styles.footer}>{activeItem.footer}</View>
      )}
    </View>
  );
}

export default Content;
