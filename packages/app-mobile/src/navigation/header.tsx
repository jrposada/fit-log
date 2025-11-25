import { useVersion } from '@shared-react/api/version/use-version';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  title: string;
}

const Header: FunctionComponent<HeaderProps> = ({ title }) => {
  const { t } = useTranslation();
  const { data: version } = useVersion();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.versionText}>{t('version', { version })}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
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
