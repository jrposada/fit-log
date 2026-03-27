import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import Tabs, { TabBarItem, TabContentItem } from '../../../library/tabs';
import BrowseTab from '../components/browse-tab';
import QuickLogTab from '../components/quick-log-tab';
import { styles } from './climbing-screen.styles';

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
      content: <BrowseTab />,
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

export default ClimbingScreen;
