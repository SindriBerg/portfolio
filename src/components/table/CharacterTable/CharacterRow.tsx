import { Character } from '@/gql/__generated__/rick-and-morty-graphql';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Row } from '@tanstack/react-table';
import Image from 'next/image';
import { FaChevronUp } from "react-icons/fa";

export const CharacterRow = (row: Row<Character>) => (
  <Box
    sx={{
      cursor: 'pointer',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.3s ease-in-out',
    }}
    position="sticky"
    top={0}
  >
    <Grid
      columns={12}
      textAlign="left"
      alignItems="center"
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
            }}
          />
        ) : (
          <Box sx={{ width: 50, height: 50, bgcolor: 'grey.300' }} />
        )}
      </Grid>
      <Grid xs>{row.original.name}</Grid>
      <Grid
        sx={{
          color:
            row.original.status === 'Alive'
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
