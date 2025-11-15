import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import BoulderEditorScreen from '../screens/boulder-editor-screen';
import HomeScreen from '../screens/home-screen';
import ImagePickerScreen from '../screens/image-picker-screen';
import { RootStackParamList } from '../types/routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();

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

export default Navigation;
