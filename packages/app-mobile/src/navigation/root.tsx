import { useAuth } from '@jrposada/fit-log-shared-react/contexts/auth/use-auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import AuthStack from '../features/auth/auth-stack';
import ClimbingStack from '../features/climbing/climbing-stack';
import HomeHeader from '../features/home/home-header';
import HomeScreen from '../features/home/home-screen';
import ProfileScreen from '../features/profile/profile-screen';
import TrainingScreen from '../features/training/training-screen';
import { Icon } from '../library/icon';
import LoadingState from '../library/loading-state';
import { surfaces } from '../library/theme';
import { RootParamList, RootStackParamList } from '../types/routes';
import Header from './header';

const Tab = createBottomTabNavigator<RootParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Tabs: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
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
          tabBarLabel: t('home.title'),
          tabBarIcon: () => <Icon icon="🏠" size="lg" />,
        }}
      />
      <Tab.Screen
        name="Climbing"
        component={ClimbingStack}
        options={{
          headerShown: false,
          tabBarLabel: t('climbing.title'),
          tabBarIcon: () => <Icon icon="🧗" size="lg" />,
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingScreen}
        options={{
          header: () => <Header title={t('training.title')} />,
          tabBarLabel: t('training.title'),
          tabBarIcon: () => <Icon icon="💪" size="lg" />,
        }}
      />
    </Tab.Navigator>
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
