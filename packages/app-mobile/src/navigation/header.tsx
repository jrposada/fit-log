import { useNavigation } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  back?: boolean;
  title: string;
}

const Header: FunctionComponent<HeaderProps> = ({ back = false, title }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: version } = useVersion();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.leftSection}>
        {back ? (
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backButton}>
            <Text style={styles.backButtonText}>☰</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.versionText}>{t('version', { version })}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  versionText: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
});

export default Header;
