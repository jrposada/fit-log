import SearchIcon from '@mui/icons-material/Search';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import InputBase from './styled/input-base';
import Search from './styled/search';
import SearchIconWrapper from './styled/search-icon-wrapper';

const SearchInput: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBase placeholder={t('actions.search_placeholder')} />
    </Search>
  );
};

export default SearchInput;
