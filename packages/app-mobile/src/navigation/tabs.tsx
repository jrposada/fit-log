import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import ActivityScreen from '../features/activity/activity-screen';
import { SportFilterProvider } from '../features/feed/sport-filter-context';
import MapScreen from '../features/map/map-screen';
import { Icon } from '../library/icon';
import { RootParamList } from '../types/routes';
import Header from './common/header';
import TrainingSessionFlyover from './flyovers/training-session-flyover';
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
            name="Activity"
            component={ActivityScreen}
            options={{
              header: () => <Header title={t('app_bar.activity')} />,
              tabBarLabel: t('app_bar.activity'),
              tabBarIcon: () => <Icon icon="📊" size="lg" />,
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              header: () => <Header title={t('app_bar.map')} />,
              tabBarLabel: t('app_bar.map'),
              tabBarIcon: () => <Icon icon="🗺️" size="lg" />,
            }}
          />
        </Tab.Navigator>
        <TrainingSessionFlyover />
      </View>
    </SportFilterProvider>
  );
};

export default Tabs;
