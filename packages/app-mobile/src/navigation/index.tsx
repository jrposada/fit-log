import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useVersion } from '@shared-react/api/version/use-version';
import { StatusBar } from 'expo-status-bar';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BoulderEditorScreen from '../screens/boulder-editor-screen';
import HomeScreen from '../screens/home-screen';
import ImagePickerScreen from '../screens/image-picker-screen';
import { RootStackParamList } from '../types/routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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

      <View
        style={{
          ...styles.versionContainer,

          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <Text style={styles.versionText}>{t('version', { version })}</Text>
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  versionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  versionText: {
    fontSize: 10,
    color: '#666',
  },
});

export default Navigation;
