import { Character } from '@/gql/__generated__/rick-and-morty-graphql';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Row } from '@tanstack/react-table';
import Image from 'next/image';

export const CharacterRow = (row: Row<Character>) => (
  <Grid
    columns={12}
    textAlign="left"
    alignItems="center"
    sx={{
      cursor: 'pointer',
    }}
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
          alt={`${row.original.name}-image`}
          src={row.original.image}
          width={50}
          height={50}
          style={{
            objectFit: 'cover',
            width: 'auto',
          }}
        />
      ) : (
        <Box sx={{ width: 50, height: 50, bgcolor: 'grey.300' }} />
      )}
    </Grid>
    <Grid xs>{row.original.name}</Grid>
    <Grid xs>{row.original.status}</Grid>
    <Grid xs>{row.original.gender}</Grid>
    <Grid xs>{row.original.species}</Grid>
    <Grid xs>{row.original.origin?.dimension}</Grid>
    <Grid xs>{row.original.episode.length}</Grid>
  </Grid>
);
