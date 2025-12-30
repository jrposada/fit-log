import { useNavigation } from '@react-navigation/native';
import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  back?: boolean;
  title: string | undefined;
  extra?: React.ReactNode;
  action?: React.ReactNode;
  loading?: boolean;
  mode?: 'screen' | 'modal';
}

const Header: FunctionComponent<HeaderProps> = ({
  back = false,
  title = '',
  extra,
  action,
  loading = false,
  mode = 'screen',
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { data: version } = useVersion();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.header,
        { paddingTop: mode === 'screen' ? insets.top : 8 },
      ]}
    >
      <View style={styles.leftSection}>
        {back && (
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
          {loading ? '...' : ''}
        </Text>
        {extra && <View style={{ marginLeft: 8 }}>{extra}</View>}
      </View>
      {!!action && action}
      {!action && (
        <Text style={styles.versionText}>{t('version', { version })}</Text>
      )}
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
  backButton: {
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    flexShrink: 1,
  },
  versionText: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
});

export default Header;
