import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { TFunction } from 'i18next';

import { Icon } from '../../../library/icon';
import Header from '../../header';

export const homeOptions = (t: TFunction): BottomTabNavigationOptions => ({
  header: () => <Header title={t('home.title')} />,
  tabBarLabel: t('app_bar.home'),
  tabBarIcon: () => <Icon icon="🏠" size="lg" />,
});
