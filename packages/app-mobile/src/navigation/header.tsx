import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackButton from './back-button';

interface HeaderProps {
  back?: boolean;
  title: string;
  mode?: 'screen' | 'modal';
}

const Header: FunctionComponent<HeaderProps> = ({
  back = false,
  title,
  mode = 'screen',
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: version } = useVersion();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: mode === 'screen' ? insets.top : 8 },
      ]}
    >
      <View style={styles.leftSection}>
        {back && <BackButton />}
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
