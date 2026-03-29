import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import Screen from '../../../library/screen';
import Tabs, { TabBarItem, TabContentItem } from '../../../library/tabs';
import BrowseTab from '../components/browse-tab';
import QuickLogTab from '../components/quick-log-tab';

type Tab = 'quick-log' | 'browse' | 'projects' | 'stats';

const ClimbingScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('quick-log');

  const items: (TabBarItem<Tab> & TabContentItem<Tab>)[] = [
    {
      id: 'quick-log',
      label: t('climbing.quick_log'),
      content: <QuickLogTab />,
      footer: (
        <Button
          title={`+ ${t('climbing.log_custom_climb')}`}
          onPress={() => {}}
          variant="primary"
        />
      ),
    },
    {
      id: 'browse',
      label: t('climbing.browse'),
      content: <BrowseTab />,
    },
    {
      id: 'projects',
      label: t('climbing.projects'),
      content: <EmptyState message={t('climbing.projects_content')} />,
    },
    {
      id: 'stats',
      label: t('climbing.stats'),
      content: <EmptyState message={t('climbing.stats_content')} />,
    },
  ];

  return (
    <Screen scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}>
      <Tabs.Bar<Tab>
        items={items}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id)}
      />
      <Tabs.Content<Tab> items={items} activeId={activeTab} />
    </Screen>
  );
};

export default ClimbingScreen;
