import { I18nextProvider } from 'react-i18next';

import i18n from './src/i18n';
import Navigation from './src/navigation';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Navigation />
    </I18nextProvider>
  );
}
