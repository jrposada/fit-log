import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ExploreScreen from '../features/explore/explore-screen';
import { SportFilterProvider } from '../features/feed/sport-filter-context';
import ActiveTrainingSessionFlyover from '../features/training-sessions/active-training-session/active-training-session-flyover';
import { RootParamList } from '../types/routes';
import BottomTabBar from './bottom-tab-bar';
import Header from './common/header';
import ActivityScreen from './routes/activity/activity-screen';
import { homeOptions } from './routes/home/home-options';
import HomeScreen from './routes/home/home-screen';

const Tab = createBottomTabNavigator<RootParamList>();

const Tabs: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <SportFilterProvider>
      <View style={{ flex: 1 }}>
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
        <ActiveTrainingSessionFlyover />
      </View>
    </SportFilterProvider>
  );
};

export default Tabs;
