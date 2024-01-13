import {
  Character,
  GetCharactersDocument,
} from '@/gql/__generated__/rick-and-morty-graphql';
import { isDefined, useDebounce } from '@/utility/helpers';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import {
  Autocomplete,
  Box,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  ExpandedState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { AnimatePresence } from 'framer-motion';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { characterColumns } from '../tableHelper';
import { EpisodeTable } from '../EpisodeTable';
import { TableBodyRenderer } from '../TableBodyRenderer';
import { CharacterRow } from './CharacterRow';
import { useSearchQuery } from '@/components/providers/SearchQueryProvider';
import { NetworkStatus } from '@apollo/client';
import { CiSearch } from 'react-icons/ci';

type AnimatedExpandableRowProps<T> = {
  animatedChild: () => ReactElement;
  row: Row<T>;
  rowComponent: (row: Row<T>) => ReactElement;
};

const AnimatedExpandableRow = <T,>(
  props: AnimatedExpandableRowProps<T>
) => {
  const {
    animatedChild: AnimatedChild,
    row,
    rowComponent: RowComponent,
  } = props;
  return (
    <Box className="row-wrapper">
      <RowComponent {...row} />
      <AnimatePresence mode="wait" key={row.id}>
        {row.getIsExpanded() && <AnimatedChild key={row.id} />}
      </AnimatePresence>
    </Box>
  );
};

const SearchbarSection = (props: {
  queryResults: number;
  isLoading: boolean;
}) => {
  const { setSearchQuery } = useSearchQuery();

  return (
    <Grid columns={12} container padding={2}>
      <Grid
        xs={4}
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography
          color="primary.main"
          variant="h5"
          fontWeight="bold"
        >
          Rick and Morty
        </Typography>
        {props.isLoading ? (
          <Skeleton />
        ) : (
          <Typography variant="h6">
            {props.queryResults} characters found
          </Typography>
        )}
      </Grid>
      <Grid xs={8} container>
        <Grid xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label={null}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a character"
            InputProps={{
              startAdornment: (
                <CiSearch size={24} style={{ marginRight: 10 }} />
              ),
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

const TableFilters = () => {
  return (
    <Grid
      container
      padding={2}
      columns={5}
      className="table-filters"
      display="flex"
      flexDirection="row"
      paddingBlock={1}
    >
      <Grid xs={1}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs={1} paddingLeft={3}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs={1} paddingLeft={3}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs={1} paddingLeft={3}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs={1} paddingLeft={3}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default function CharacterTable() {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableRef = useRef(null);
  const { searchQuery } = useSearchQuery();

  const debouncedSearchTerm = useDebounce(searchQuery, 500);

  const { data, fetchMore, networkStatus } = useSuspenseQuery(
    GetCharactersDocument,
    {
      variables: {
        page,
        name: debouncedSearchTerm,
      },
    }
  );
  const tableData = useMemo(
    () => data?.characters?.results ?? [],
    [data?.characters?.results]
  );

  const hasNextPage = data?.characters?.info?.next !== null;
  const hasPrevPage = data?.characters?.info?.prev !== null;

  const resetExpanded = useCallback(() => {
    setExpanded({});
  }, []);

  useEffect(() => {
    resetExpanded();
  }, [page, searchQuery, sorting, resetExpanded]);

  const table = useReactTable<Character>({
    data: tableData as Character[],
    columns: characterColumns,
    state: {
      expanded,
      sorting,
    },
    enableExpanding: true,
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  useEffect(() => {
    if (!tableRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        console.log(entries);
        if (entries[0].isIntersecting) {
          console.log('Element is 50% or more visible');
          // Do something when the element hits the 0.5 threshold
        } else {
          console.log('Element is less than 50% visible');
          // Do something else when the element is less than 0.5 visibility
        }
        if (entries[0].isIntersecting && hasNextPage) {
          console.log('fetching more');
          fetchMore({
            variables: {
              page: page + 1,
              name: debouncedSearchTerm,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const prevResults = prev.characters?.results ?? [];
              const newResults =
                fetchMoreResult.characters?.results ?? [];
              return {
                characters: {
                  __typename: 'Characters',
                  info: fetchMoreResult.characters?.info,
                  results: [...prevResults, ...newResults],
                },
              };
            },
          });
        }
      },
      {
        threshold: 0.9,
      }
    );
    observer.observe(tableRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box
      className="character-table"
      flexDirection="column"
      display="flex"
      height="100vh"
      overflow="hidden"
    >
      <SearchbarSection
        queryResults={tableData.length}
        isLoading={networkStatus === NetworkStatus.loading}
      />
      <TableFilters />
      <Grid container xs={12}>
        <Grid
          xs={12}
          id="table-header"
          display="flex"
          minHeight={32}
          borderTop="1px solid black"
          borderBottom="1px solid black"
          alignItems="center"
        >
          {table
            .getHeaderGroups()
            .map((headerGroup) =>
              headerGroup.headers.map((header) =>
                flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )
              )
            )}
        </Grid>
      </Grid>
      <Box
        id="table-body"
        ref={tableRef}
        sx={{
          overflowY: 'scroll',
        }}
      >
        <TableBodyRenderer
          table={table}
          status={networkStatus}
          RowComponent={(row) => (
            <AnimatedExpandableRow
              row={row}
              animatedChild={() => (
                <EpisodeTable
                  key={row.id}
                  episodeUrls={row.original.episode
                    .map((e) => e?.id)
                    .filter(isDefined)}
                />
              )}
              rowComponent={CharacterRow}
            />
          )}
          ref={tableRef}
        />
      </Box>
    </Box>
  );
}
