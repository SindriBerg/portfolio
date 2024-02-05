import {
  Character,
  GetCharactersDocument,
  GetCharactersQuery,
  GetCharactersQueryVariables,
  QueryCharactersArgs,
} from '@/gql/__generated__/rick-and-morty-graphql';
import { isDefined, useDebounce } from '@/utility/helpers';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
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
  Dispatch,
  ReactElement,
  SetStateAction,
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
import { TableFilters, useTableFilters } from '../TableFilters';
import { GrFormPrevious, GrFormNext, GrChapterPrevious, GrChapterNext } from "react-icons/gr";
import { IconContext } from 'react-icons';

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

const PaginationButtons = (props: {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  handlePageChange: Dispatch<SetStateAction<number>>;
  amountOfPages: number;
  currentPage: number;
}) => {
  const { hasNextPage, hasPrevPage, handlePageChange, currentPage } = props;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // If the input value is not a number, return
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    // if (e.target.value !== '' && isNaN(Number(e.target.value))) return;
    // if (e.target.value === '') return handlePageChange(1)
    if (Number(e.target.value) > props.amountOfPages) return handlePageChange(props.amountOfPages)
    // if (Number(e.target.value) < 1) return handlePageChange(1)
    handlePageChange(Number(e.target.value));
  }, [handlePageChange, props.amountOfPages]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={1}
      sx={{
        backgroundColor: 'secondary.main',
        marginTop: 'auto',
        zIndex: 30,
        gap: 1
      }}
    >
      <IconContext.Provider value={{
        size: '16px',
      }}>
        <IconButton disabled={!hasPrevPage} onClick={() => handlePageChange(1)}>
          <GrChapterPrevious color="white" />
        </IconButton>
        <IconButton disabled={!hasPrevPage} onClick={() => handlePageChange((prev) => --prev)}>
          <GrFormPrevious color="white" />
        </IconButton>
        <TextField
          sx={{
            width: 50,
            '& .MuiInput-input': {
              textAlign: 'right'
            }
          }} value={currentPage} onChange={handleInputChange}
          InputProps={{ endAdornment: <Typography>/{props.amountOfPages}</Typography> }}
        />
        <IconButton disabled={!hasNextPage} onClick={() => handlePageChange((prev) => ++prev)}>
          <GrFormNext color="white" />
        </IconButton>
        <IconButton disabled={!hasNextPage} onClick={() => handlePageChange(props.amountOfPages)}>
          <GrChapterNext color="white" />
        </IconButton>
      </IconContext.Provider>
    </Box>
  );
}


export default function CharacterTable() {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [page, setPage] = useState<number>(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableRef = useRef(null);
  const { searchQuery } = useSearchQuery();

  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { filters } = useTableFilters();

  const { data, networkStatus } = useSuspenseQuery(
    GetCharactersDocument,
    {
      variables: {
        page,
        filter: {
          name: debouncedSearchTerm,
          ...filters
        }
      },
    }
  );

  const tableData = useMemo(
    () => data?.characters?.results ?? [],
    [data?.characters?.results]
  );

  const hasNextPage = data?.characters?.info?.next !== null;
  const hasPrevPage = data?.characters?.info?.prev !== null;
  const amountOfPages = data?.characters?.info?.pages ?? 1;


  useEffect(() => {
    setExpanded({});
  }, [page, searchQuery, sorting, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters])

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
    setPage(1);
  }, [setPage, debouncedSearchTerm])

  // This is in case I decide to implement infinite scrolling
  // useEffect(() => {
  //   if (!tableRef.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       console.log(entries);
  //       if (entries[0].isIntersecting) {
  //         console.log('Element is 50% or more visible');
  //         // Do something when the element hits the 0.5 threshold
  //       } else {
  //         console.log('Element is less than 50% visible');
  //         // Do something else when the element is less than 0.5 visibility
  //       }
  //       if (entries[0].isIntersecting && hasNextPage) {
  //         console.log('fetching more');
  //         fetchMore({
  //           variables: {
  //             page: page + 1,
  //             filter: {
  //               name: debouncedSearchTerm,
  //             }
  //           },
  //           updateQuery: (prev, { fetchMoreResult }) => {
  //             const prevResults = prev.characters?.results ?? [];
  //             const newResults =
  //               fetchMoreResult.characters?.results ?? [];
  //             return {
  //               characters: {
  //                 __typename: 'Characters',
  //                 info: fetchMoreResult.characters?.info,
  //                 results: [...prevResults, ...newResults],
  //               },
  //             };
  //           },
  //         });
  //       }
  //     },
  //     {
  //       threshold: 0.9,
  //     }
  //   );
  //   observer.observe(tableRef.current);
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [debouncedSearchTerm, fetchMore, hasNextPage, page]);

  return (
    <Box
      className="character-table"
      flexDirection="column"
      display="flex"
      height="100vh"
      overflow="hidden"
      position="relative"
    >
      <Box id="table-top-section" display="flex" flexDirection="column">
        <SearchbarSection
          queryResults={tableData.length}
          isLoading={networkStatus === NetworkStatus.loading}
        />
        <TableFilters />
      </Box>
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
      <Box
        id="table-body"
        ref={tableRef}
        sx={{
          overflowY: 'auto',
          'scrollbarWidth': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
        }}
      >
        {
          table.getRowModel().rows.map((r, index) => (
            <Box
              key={r.id}
              className="row-table-wrapper"
            // data-group-number={r.original.orderGroupNumber}
            >
              <CharacterRow {...r} />
              <AnimatePresence mode="wait">
                {
                  r.getIsExpanded()
                  && (
                    <EpisodeTable
                      episodeUrls={r.original.episode.map((e) => e?.id).filter(isDefined)}
                    />
                  )
                }
              </AnimatePresence>
            </Box>
          ))
        }
        {/* <TableBodyRenderer
          table={table}
          status={networkStatus}
          RowComponent={(row) => (
            <AnimatedExpandableRow
              key={row.id}
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
        /> */}
      </Box>
      <PaginationButtons
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        amountOfPages={amountOfPages}
        currentPage={page}
        handlePageChange={setPage} />
    </Box>
  );
}
