import { Character } from '@/gql/__generated__/rick-and-morty-graphql';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Row } from '@tanstack/react-table';
import Image from 'next/image';

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
          backgroundColor: '#35944220',
        },
        backgroundColor: row.getIsExpanded() ? '#35944220' : 'white',
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
              // width: 'auto',
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
              ? 'green'
              : row.original.status === 'unknown'
                ? 'grey'
                : 'red',
          textTransform: 'capitalize',
        }}
        xs
      >
        {row.original.status}
      </Grid>
      <Grid xs>{row.original.gender}</Grid>
      <Grid xs>{row.original.species}</Grid>
      <Grid xs>{row.original.origin?.dimension}</Grid>
      <Grid xs>{row.original.episode.length}</Grid>
    </Grid>
  </Box>
);
