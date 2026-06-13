import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../library/button';
import Screen from '../../../library/screen';
import Tabs, { TabBarItem, TabContentItem } from '../../../library/tabs';
import BrowseTab from '../components/browse-tab/browse-tab';
import LogbookTab from '../components/logbook-tab/logbook-tab';
import StatsTab from '../components/stats-tab/stats-tab';
import { ClimbingParamList } from '../types';

type ClimbingNavigationProp = NativeStackNavigationProp<
  ClimbingParamList,
  'ClimbingMain'
>;

type Tab = 'logbook' | 'browse' | 'stats';

const ClimbingScreen: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ClimbingNavigationProp>();
  const [activeTab, setActiveTab] = useState<Tab>('logbook');
  const [locationId, setLocationId] = useState<string>();

  const items: (TabBarItem<Tab> & TabContentItem<Tab>)[] = [
    {
      id: 'logbook',
      label: t('climbing.logbook'),
      content: (
        <LogbookTab locationId={locationId} onLocationChange={setLocationId} />
      ),
    },
    {
      id: 'browse',
      label: t('climbing.browse'),
      content: <BrowseTab />,
    },
    {
      id: 'stats',
      label: t('climbing.stats'),
      content: <StatsTab />,
    },
  ];

  return (
    <Screen
      footer={
        activeTab === 'logbook' &&
        locationId && (
          <Button
            title={`+ ${t('climbing.log_custom_climb')}`}
            onPress={() => navigation.navigate('ClimbDetail', { locationId })}
            variant="primary"
          />
        )
      }
      noFooterInsetBottom
      stickyHeaderIndices={[0]}
    >
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
