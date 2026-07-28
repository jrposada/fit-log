import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import AuthStack from '../features/auth/auth-stack';
import { SportFilterProvider } from '../features/feed/sport-filter-context';
import HistoryScreen from '../features/history/history-screen';
import HomeHeader from '../features/home/home-header';
import HomeScreen from '../features/home/home-screen';
import ProfileScreen from '../features/profile/profile-screen';
import StatsScreen from '../features/stats/stats-screen';
import { Icon } from '../library/icon';
import LoadingState from '../library/loading-state';
import { surfaces } from '../library/theme';
import { RootParamList, RootStackParamList } from '../types/routes';
import Fab from './fab';
import Header from './header';

const Tab = createBottomTabNavigator<RootParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
              tabBarLabel: t('app_bar.profile'),
              tabBarIcon: () => <Icon icon="👤" size="lg" />,
            }}
          />
        </Tab.Navigator>
        <Fab />
      </View>
    </SportFilterProvider>
  );
};

const Root: FunctionComponent = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <LoadingState isLoading style={{ backgroundColor: surfaces.page }} />
      </NavigationContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
