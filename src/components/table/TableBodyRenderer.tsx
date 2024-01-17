import { NetworkStatus } from '@apollo/client';
import { Box, Skeleton } from '@mui/material';
import { Table, Row } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ReactElement, ForwardedRef, forwardRef } from 'react';
import Image from 'next/image';

type TableBodyRendererProps<T> = {
  table: Table<T>;
  status: NetworkStatus;
  skeletonRowCount?: number;
  RowComponent: (row: Row<T>) => ReactElement;
};

// Generic wrapper to handle loading states on the bodies of tables more easily.
export function TableBodyRendererInner<T>(
  props: TableBodyRendererProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { status, table, RowComponent } = props;
  if (status === NetworkStatus.loading) {
    return (
      Array.from({ length: props.skeletonRowCount ?? 0 }).map((_, i) => (
        <Skeleton key={i} height={24} width='100%' />
      ))
    );
  }
  if (status === NetworkStatus.error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width={1}
        alignItems="center"
        height={750}
        justifyContent="center"
      >
        <div style={{ fontSize: 30, marginBottom: 10 }}>
          I think Morty messed with the portal gun again....
        </div>
        <Image src={'/angryrick.webp'} alt="Error image" height={250} />
      </Box>
    );
  } else return table.getRowModel().rows.map((r) => <RowComponent key={r.id} {...r} />)
}

export const TableBodyRenderer = forwardRef(
  TableBodyRendererInner
) as <T>(
  props: TableBodyRendererProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
  }
) => ReturnType<typeof TableBodyRendererInner>;
