import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import HomeScreen from '../screens/home-screen';
import TrainingScreen from '../screens/training-screen';
import { RootParamList } from '../types/routes';
import ClimbingStack from './climbing-stack';
import Header from './header';

const Tab = createBottomTabNavigator<RootParamList>();

const Root: FunctionComponent = () => {
  const { t } = useTranslation();

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
            header: () => <Header title={t('home.title')} />,
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

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 24,
  },
});

export default Root;
