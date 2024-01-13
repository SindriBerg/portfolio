import {
  Character,
  Episode,
} from '@/gql/__generated__/rick-and-morty-graphql';
import { createColumnHelper } from '@tanstack/react-table';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  Avatar,
  Box,
  Grid2Props,
  Typography,
  styled,
} from '@mui/material';
import { extractIdFromUrl, isDefined } from '@/utility/helpers';
import { useQuery } from '@tanstack/react-query';
import { getCharacterRange } from '@/api/rick-and-morty-api-service';
import { ReactNode } from 'react';

function NameCell(props: { name: string; img?: string }) {
  const { name, img } = props;
  return (
    <Box display="flex">
      <Box marginRight={1}>
        {/* <motion.img
          style={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            objectFit: "cover",
            color: "transparent",
            textIndent: "10000px",
          }}
          alt="Character image"
          src={img}
        /> */}
        <Avatar src={img} alt="Character avatar" />
      </Box>
      <Box display="flex" alignItems="center">
        <div>{name}</div>
      </Box>
    </Box>
  );
}

function StatusCell(props: { status: string }) {
  const { status } = props;
  return (
    <Box
      style={{
        color: status === 'Alive' ? 'green' : 'red',
        textTransform: 'capitalize',
      }}
    >
      {status}
    </Box>
  );
}

function SeasonCell(props: { episodeInfo: Episode['episode'] }) {
  const { episodeInfo } = props;

  const season = episodeInfo?.split('S')[1].split('E')[0];
  return <Box>{season}</Box>;
}

function EpisodeCell(props: { episodeInfo: Episode['episode'] }) {
  const { episodeInfo } = props;
  const episode = episodeInfo?.split('S')[1].split('E')[1];
  return <Box>{episode}</Box>;
}

// const characterColumnHelper = createColumnHelper<Character>();
// export const characterColumns = [
//   characterColumnHelper.accessor((c) => c.name, {
//     id: "name",
//     cell: (info) => {
//       return (
//         <Box>
//           <NameCell
//             name={info.getValue() ?? "N/A"}
//             img={info.row.original.image ?? ''}
//           />
//         </Box>
//       );
//     },
//     footer: (props) => props.column.id,
//     header: () => <Box>Name</Box>,
//   }),
//   characterColumnHelper.accessor((row) => row.status, {
//     id: "status",
//     cell: (info) => <StatusCell status={info.getValue() ?? ""} />,
//     header: () => <span>Status</span>,
//     footer: (props) => props.column.id,
//   }),
//   // header: (c) => <Box border="2px solid black">Name</Box>,
//   // footer: (info) => info.column.id,
//   characterColumnHelper.accessor((character) => character.species, {
//     id: "species",
//     cell: (info) => info.getValue(),
//     header: "Species",
//   }),
//   characterColumnHelper.accessor((character) => character.gender, {
//     id: "gender",
//     cell: (info) => info.getValue(),
//     header: "Gender",
//   }),
//   characterColumnHelper.accessor((character) => character.location?.name, {
//     id: "location",
//     cell: (info) => info.getValue(),
//     header: "Location",
//   }),
//   characterColumnHelper.accessor((c) => c.origin?.name, {
//     id: "origin",
//     header: "Origin",
//     cell: (info) => info.getValue(),
//   }),
// ];

function JerryCell(props: { ids: string[] }) {
  const { ids } = props;

  const jerry = ids.some((id) => {
    if (id) {
      return id === '5';
    }
  });

  return <Box>{jerry ? 'Yes' : 'No'}</Box>;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: 'capitalize',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
}));

const characterColHelper = createColumnHelper<Character>();
export const characterColumns = [
  characterColHelper.accessor('image', {
    id: 'image',
    header: () => <Grid xs />,
  }),
  characterColHelper.accessor('name', {
    id: 'name',
    header: () => (
      <Grid xs>
        <StyledTypography>Name</StyledTypography>
      </Grid>
    ),
  }),
  characterColHelper.accessor('status', {
    id: 'status',
    header: (cell) => (
      <Grid xs>
        <StyledTypography>Status</StyledTypography>
      </Grid>
    ),
  }),
  characterColHelper.accessor('species', {
    id: 'species',
    header: () => (
      <Grid xs>
        <StyledTypography>Species</StyledTypography>
      </Grid>
    ),
  }),
  characterColHelper.accessor('gender', {
    id: 'gender',
    cell: (info) => info.getValue(),
    header: () => (
      <Grid xs>
        <StyledTypography>Gender</StyledTypography>
      </Grid>
    ),
  }),
  characterColHelper.accessor('origin.dimension', {
    header: () => (
      <Grid xs>
        <StyledTypography>Dimension</StyledTypography>
      </Grid>
    ),
    id: 'dimension',
  }),
  characterColHelper.accessor('episode', {
    header: () => (
      <Grid xs>
        <StyledTypography>Episodes</StyledTypography>
      </Grid>
    ),
    id: 'episodes',
  }),
];

const episodeColumnHelper = createColumnHelper<Episode>();
export const episodeColumns = [
  episodeColumnHelper.accessor((e) => e.name, {
    id: 'episode_name',
    header: 'Name',
  }),
  episodeColumnHelper.accessor((e) => e.air_date, {
    id: 'episode_air_date',
    header: 'Aired on',
    // cell: (info) => <div>{info.getValue()}</div>,
  }),
  episodeColumnHelper.accessor((e) => e.episode, {
    id: 'episode_season',
    header: 'Season',
    cell: (info) => <SeasonCell episodeInfo={info.getValue()} />,
  }),
  episodeColumnHelper.accessor((e) => e.episode, {
    id: 'episode_episode',
    header: 'Episode',
    cell: (info) => <EpisodeCell episodeInfo={info.getValue()} />,
  }),
  episodeColumnHelper.accessor((e) => e.characters, {
    id: 'episode_characters',
    header: 'Does it contain Jerry?',
    cell: (info) => {
      const characters = info.getValue();
      return (
        <JerryCell
          ids={characters.map((c) => c?.id).filter(isDefined)}
        />
      );
    },
  }),
];
