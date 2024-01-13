import {
  GetEpisodesByIdQuery,
  GetEpisodesByIdDocument,
  Episode,
} from '@/gql/__generated__/rick-and-morty-graphql';
import { isDefined } from '@/utility/helpers';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  useReactTable,
  getCoreRowModel,
  Row,
  flexRender,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { useMemo, useCallback, ReactElement } from 'react';
import { episodeColumns } from './tableHelper';
import { useQuery } from '@apollo/client';
import { TableBodyRenderer } from './TableBodyRenderer';
import uniqueId from 'lodash/uniqueId';

interface SubTableProps {
  episodeUrls: string[];
}

export function EpisodeTable(props: SubTableProps) {
  const { episodeUrls } = props;
  const { data, loading, networkStatus } =
    useQuery<GetEpisodesByIdQuery>(GetEpisodesByIdDocument, {
      variables: {
        ids: episodeUrls,
      },
    });

  // We memoize the data to avoid unnecessary rerenders
  const rows = useMemo(
    () => data?.episodesByIds?.filter(isDefined) ?? [],
    [data]
  );

  const subTable = useReactTable<Episode>({
    data: rows as Episode[],
    getCoreRowModel: getCoreRowModel(),
    columns: episodeColumns,
  });

  const RowComponent = useCallback(
    (row: Row<Episode>): ReactElement => (
      <Grid xs={12} container key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <Grid xs>
            {flexRender(
              cell.column.columnDef.cell,
              cell.getContext()
            )}
          </Grid>
        ))}
      </Grid>
    ),
    []
  );

  return (
    <motion.div
      className="episode-table"
      key={uniqueId('episode-table')}
      initial={{
        height: 0,
        opacity: 0,
      }}
      animate={{
        height: 'auto',
        opacity: 1,
      }}
      exit={{
        height: 0,
        opacity: 0,
      }}
      style={{
        overflow: 'hidden',
        paddingInline: 40,
      }}
    >
      <Grid
        xs={12}
        id="table-header"
        display="flex"
        minHeight={32}
        alignItems="center"
      >
        {subTable.getHeaderGroups().map((hg) =>
          hg.headers.map((h) => (
            <Grid key={h.id} xs>
              {flexRender(h.column.columnDef.header, h.getContext())}
            </Grid>
          ))
        )}
      </Grid>
      <TableBodyRenderer
        status={networkStatus}
        table={subTable}
        RowComponent={RowComponent}
      />
    </motion.div>
  );
}
