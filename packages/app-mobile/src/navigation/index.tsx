import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import BoulderEditorScreen from '../screens/boulder-editor-screen';
import HomeScreen from '../screens/home-screen';
import ImagePickerScreen from '../screens/image-picker-screen';
import { RootStackParamList } from '../types/routes';

const Stack = createBottomTabNavigator<RootStackParamList>();

const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();
  const { data: version } = useVersion();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
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
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t('boulder.screen_title_home') }}
        />
        <Stack.Screen
          name="ImagePicker"
          component={ImagePickerScreen}
          options={{ title: t('boulder.screen_title_select') }}
        />
        <Stack.Screen
          name="BoulderEditor"
          component={BoulderEditorScreen}
          options={{ title: t('boulder.screen_title_editor') }}
        />
      </Stack.Navigator>
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
});

export default Navigation;
