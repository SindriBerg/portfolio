import { Character } from '@/gql/__generated__/rick-and-morty-graphql';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Row } from '@tanstack/react-table';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { FaChevronUp } from "react-icons/fa";

export const CharacterRow = (row: Row<Character>) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Get a reference to the table body element
    const tableRef = document.getElementById('table-body');
    const filterSection = document.getElementById('table-top-section');
    if (!row.getIsExpanded()) return;
    // If the table body element does not exist, return early
    if (!tableRef) return;
    if (!filterSection) return;
    // Define a scroll event handler function
    const handleScroll = (): void => {
      if (rowRef.current) {
        const currRef = rowRef.current;
        const rowRefTop = currRef.getBoundingClientRect().top;
        // If the top position of the row element is less than or equal to
        // the height of the filter section + the tab and table header,
        // add the 'scroll-shadow' class
        if (rowRefTop <= filterSection.getBoundingClientRect().height + 32) {
          currRef.classList.add('scroll-shadow');
        }
        // Otherwise, remove the 'scroll-shadow' class
        else {
          currRef.classList.remove('scroll-shadow');
        }
      }
    };

    // Add the scroll event listener to the table body element
    tableRef.addEventListener('scroll', handleScroll);

    // Define a cleanup function to remove the scroll event listener when the component unmounts
    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [row]);

  return (
    <Box
      sx={{
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        transition: 'all 0.3s ease-in-out',
        ['& .scroll-shadow']: {
          boxShadow: `0px 4px 16px rgba(0, 0, 0, 0.3)`,
          transition: 'box-shadow 0.3s ease-in-out',
        },
      }}
      position="sticky"
      top={0}
    >
      <Grid
        columns={12}
        textAlign="left"
        alignItems="center"
        ref={rowRef}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'primary.300',
          },
          backgroundColor: row.getIsExpanded()
            ? 'primary.300'
            : 'white',
          transition: 'all 0.3s ease-in-out',
        }}
        position="sticky"
        top={0}
        zIndex={100}
        marginBottom={1}
        container
        onClick={(e): void => {
          e.preventDefault();
          return void row.toggleExpanded();
        }}
      >
        <Grid xs display="flex" flexDirection="row" alignItems="center">
          {row.original.image ? (
            <Image
              alt={`Image of ${row.original.name}`}
              src={row.original.image}
              width={row.getIsExpanded() ? 128 : 64}
              height={50}
              style={{
                objectFit: 'cover',
                transition: 'all 0.3s ease-in-out',
              }} />
          ) : (
            <Box sx={{ width: 50, height: 50, bgcolor: 'grey.300' }} />
          )}
        </Grid>
        <Grid xs>{row.original.name}</Grid>
        <Grid
          sx={{
            color: row.original.status === 'Alive'
              ? 'primary.main'
              : row.original.status === 'unknown'
                ? 'grey'
                : 'error.main',
            textTransform: 'capitalize',
          }}
          xs
        >
          {row.original.status}
        </Grid>
        <Grid xs>{row.original.species}</Grid>
        <Grid xs>{row.original.type}</Grid>
        <Grid xs>{row.original.gender}</Grid>
        <Grid xs sx={{ textTransform: 'capitalize' }}>{row.original.origin?.dimension}</Grid>
        <Grid xs>{row.original.episode.length}</Grid>
        <Grid xs onClick={(e) => {
          e.stopPropagation();
          return row.toggleExpanded();
        }}>
          <FaChevronUp
            size={16}
            className="fill-primary-main"
            style={{
              fill: 'primary.main',
              transform: !row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'all 0.3s ease-in-out',
            }} />
        </Grid>
      </Grid>
    </Box>
  );
};
