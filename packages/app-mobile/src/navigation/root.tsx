import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import AuthStack from '../features/auth/auth-stack';
import ClimbingStack from '../features/climbing/climbing-stack';
import HomeHeader from '../features/home/home-header';
import HomeScreen from '../features/home/home-screen';
import TrainingScreen from '../features/training/training-screen';
import LoadingState from '../library/loading-state';
import { RootParamList } from '../types/routes';
import Header from './header';
import { styles } from './root.styles';

const Tab = createBottomTabNavigator<RootParamList>();

const Root: FunctionComponent = () => {
  const { t } = useTranslation();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <LoadingState style={{ backgroundColor: '#f5f5f5' }} />
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
            tabBarIcon: () => <Text style={styles.tabIcon}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Climbing"
          component={ClimbingStack}
          options={{
            headerShown: false,
            tabBarLabel: t('climbing.title'),
            tabBarIcon: () => <Text style={styles.tabIcon}>🧗</Text>,
          }}
        />
        <Tab.Screen
          name="Training"
          component={TrainingScreen}
          options={{
            header: () => <Header title={t('training.title')} />,
            tabBarLabel: t('training.title'),
            tabBarIcon: () => <Text style={styles.tabIcon}>💪</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Root;
