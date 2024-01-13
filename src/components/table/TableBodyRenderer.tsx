import { NetworkStatus } from '@apollo/client';
import { Box } from '@mui/material';
import { Table, Row } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { ReactElement, ForwardedRef, forwardRef } from 'react';

type TableBodyRendererProps<T> = {
  table: Table<T>;
  status: NetworkStatus;
  RowComponent: (row: Row<T>) => ReactElement;
};

// Generic wrapper to handle loading states on the bodies of tables more easily.
function TableBodyRendererInner<T>(
  props: TableBodyRendererProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { status, table, RowComponent } = props;
  if (status === NetworkStatus.loading) {
    return (
      <Box
        ref={ref}
        display="flex"
        flexDirection="column"
        width={1}
        alignItems="center"
        height={750}
        justifyContent="center"
      >
        <motion.img
          style={{
            width: 250,
            height: 250,
          }}
          animate={{
            height: [225, 250, 225],
            width: [250, 225, 250],
          }}
          transition={{ repeat: Infinity }}
          src={'/portal.gif'}
        />
        <div
          style={{
            fontSize: 50,
          }}
          className="ram-font"
        >
          Loading
        </div>
      </Box>
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
        <img src={'/angryrick.webp'} height={250} />
      </Box>
    );
  } else return table.getRowModel().rows.map(RowComponent);
}

export const TableBodyRenderer = forwardRef(
  TableBodyRendererInner
) as <T>(
  props: TableBodyRendererProps<T> & {
    ref?: ForwardedRef<HTMLDivElement>;
  }
) => ReturnType<typeof TableBodyRendererInner>;
