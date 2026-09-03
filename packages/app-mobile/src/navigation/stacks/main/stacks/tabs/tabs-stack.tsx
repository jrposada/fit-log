import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { SportFilterProvider } from '../../../../../features/feed/sport-filter-context';
import { RootParamList } from '../../../../../types/routes';
import Header from '../../../../common/header';
import BottomTabBar from './bottom-tab-bar';
import ActivityScreen from './routes/activity/activity-screen';
import ExploreScreen from './routes/explore/explore-screen';
import { homeOptions } from './routes/home/home-options';
import HomeScreen from './routes/home/home-screen';

const Tab = createBottomTabNavigator<RootParamList>();

const TabsStack: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <SportFilterProvider>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <BottomTabBar {...props} />}
        screenOptions={{
          animation: 'shift',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={homeOptions(t)}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            header: () => <Header title={t('app_bar.explore')} />,
            tabBarLabel: t('app_bar.explore'),
          }}
        />
        <Tab.Screen
          name="Activity"
          component={ActivityScreen}
          options={{
            header: () => <Header title={t('app_bar.activity')} />,
            tabBarLabel: t('app_bar.activity'),
          }}
        />
      </Tab.Navigator>
    </SportFilterProvider>
  );
};

export default TabsStack;
