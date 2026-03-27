import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@shared-react/contexts/auth/use-auth';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import HomeScreen from '../screens/home-screen';
import TrainingScreen from '../screens/training-screen';
import { RootParamList } from '../types/routes';
import AuthStack from '../features/auth/auth-stack';
import ClimbingStack from './climbing-stack';
import Header from './header';
import HomeHeader from './home-header';
import { styles } from './root.styles';

const Tab = createBottomTabNavigator<RootParamList>();

const Root: FunctionComponent = () => {
  const { t } = useTranslation();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
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
