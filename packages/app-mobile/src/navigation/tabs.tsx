import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { SportFilterProvider } from '../features/feed/sport-filter-context';
import HistoryScreen from '../features/history/history-screen';
import HomeHeader from '../features/home/home-header';
import HomeScreen from '../features/home/home-screen';
import StatsScreen from '../features/stats/stats-screen';
import { Icon } from '../library/icon';
import { RootParamList } from '../types/routes';
import Fab from './fab';
import Header from './header';

const Tab = createBottomTabNavigator<RootParamList>();

const Tabs: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <SportFilterProvider>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            animation: 'shift',
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              header: () => <HomeHeader />,
              tabBarLabel: t('app_bar.home'),
              tabBarIcon: () => <Icon icon="🏠" size="lg" />,
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              header: () => <Header title={t('app_bar.history')} />,
              tabBarLabel: t('app_bar.history'),
              tabBarIcon: () => <Icon icon="📜" size="lg" />,
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              header: () => <Header title={t('app_bar.stats')} />,
              tabBarLabel: t('app_bar.stats'),
              tabBarIcon: () => <Icon icon="📊" size="lg" />,
            }}
          />
        </Tab.Navigator>
        <Fab />
      </View>
    </SportFilterProvider>
  );
};

export default Tabs;
