import { useDebounce } from '@/utility/helpers';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

type SearchQueryContextType = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchQueryContext = createContext<SearchQueryContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

const useSearchQuery = () => {
  const context = useContext(SearchQueryContext);
  if (context === undefined) {
    throw new Error(
      'useSearchQuery must be used within a SearchQueryProvider'
    );
  }
  return context;
};

const SearchQueryProvider = (props: PropsWithChildren) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const context: SearchQueryContextType = useMemo(() => {
    return {
      searchQuery,
      setSearchQuery,
    };
  }, [searchQuery, setSearchQuery]);

  return (
    <SearchQueryContext.Provider value={context}>
      {props.children}
    </SearchQueryContext.Provider>
  );
};

export { useSearchQuery, SearchQueryProvider };
