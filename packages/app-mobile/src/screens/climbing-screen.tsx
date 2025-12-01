import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import QuickLogTab from '../features/climbing/quick-log-tab';
import Tabs, { TabBarItem, TabContentItem } from '../library/tabs';

type Tab = 'quick-log' | 'browse' | 'projects' | 'stats';

const ClimbingScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('quick-log');

  const items: (TabBarItem<Tab> & TabContentItem<Tab>)[] = [
    {
      id: 'quick-log',
      label: t('climbing.quick_log'),
      content: <QuickLogTab />,
    },
    {
      id: 'browse',
      label: t('climbing.browse'),
      content: (
        <Text style={styles.placeholderText}>
          {t('climbing.browse_content')}
        </Text>
      ),
    },
    {
      id: 'projects',
      label: t('climbing.projects'),
      content: (
        <Text style={styles.placeholderText}>
          {t('climbing.projects_content')}
        </Text>
      ),
    },
    {
      id: 'stats',
      label: t('climbing.stats'),
      content: (
        <Text style={styles.placeholderText}>
          {t('climbing.stats_content')}
        </Text>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <Tabs.Bar<Tab>
        items={items}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id)}
      />
      <Tabs.Content<Tab> items={items} activeId={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ClimbingScreen;
