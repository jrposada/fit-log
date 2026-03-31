import type React from 'react';
import { View } from 'react-native';

import { styles } from './content.styles';

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
    <View style={styles.container}>
      <View style={styles.inner}>{activeItem?.content}</View>
    </View>
  );
}

export default Content;
