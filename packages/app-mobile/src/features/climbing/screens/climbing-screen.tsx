import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import EmptyState from '../../../library/empty-state';
import Screen from '../../../library/screen';
import Tabs, { TabBarItem, TabContentItem } from '../../../library/tabs';
import BrowseTab from '../components/browse-tab';
import QuickLogTab from '../components/quick-log-tab';
import { ClimbingParamList } from '../types';

type ClimbingNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

type Tab = 'quick-log' | 'browse' | 'projects' | 'stats';

const ClimbingScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbingNavigationProp>();
  const [activeTab, setActiveTab] = useState<Tab>('quick-log');
  const [locationId, setLocationId] = useState<string>('');

  const items: (TabBarItem<Tab> & TabContentItem<Tab>)[] = [
    {
      id: 'quick-log',
      label: t('climbing.quick_log'),
      content: (
        <QuickLogTab locationId={locationId} onLocationChange={setLocationId} />
      ),
      footer: locationId ? (
        <Button
          title={`+ ${t('climbing.log_custom_climb')}`}
          onPress={() => navigation.navigate('ClimbDetail', { locationId })}
          variant="primary"
        />
      ) : undefined,
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
