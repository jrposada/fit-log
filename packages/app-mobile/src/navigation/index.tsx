import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import ClimbingScreen from '../screens/climbing-screen';
import HomeScreen from '../screens/home-screen';
import TrainingScreen from '../screens/training-screen';
import { RootStackParamList } from '../types/routes';

const Tab = createBottomTabNavigator<RootStackParamList>();

const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: version } = useVersion();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <Text style={styles.versionText}>{t('version', { version })}</Text>
          ),
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: t('home.title'),
            tabBarIcon: () => <Text style={styles.tabIcon}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Climbing"
          component={ClimbingScreen}
          options={{
            title: t('climbing.title'),
            tabBarIcon: () => <Text style={styles.tabIcon}>🧗</Text>,
          }}
        />
        <Tab.Screen
          name="Training"
          component={TrainingScreen}
          options={{
            title: t('training.title'),
            tabBarIcon: () => <Text style={styles.tabIcon}>💪</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  versionText: {
    fontSize: 11,
    color: '#fff',
    marginRight: 12,
    opacity: 0.8,
  },
  tabIcon: {
    fontSize: 24,
  },
});

export default Navigation;
