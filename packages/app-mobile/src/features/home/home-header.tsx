import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../navigation/header';

const HomeHeader: FunctionComponent = () => {
  const { t } = useTranslation();

  return <Header title={t('home.title')} />;
};

export default HomeHeader;
