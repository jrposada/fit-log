import SearchIcon from '@mui/icons-material/Search';
import { t } from 'i18next';
import { FunctionComponent } from 'react';
import InputBase from './styled/input-base';
import Search from './styled/search';
import SearchIconWrapper from './styled/search-icon-wrapper';

const SearchInput: FunctionComponent = () => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBase placeholder={t('actions.search-placeholder')} />
    </Search>
  );
};

export default SearchInput;
