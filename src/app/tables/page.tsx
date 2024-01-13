'use client';
import { createTheme, ThemeProvider } from '@mui/material';
import CharacterTable from '@/components/table/CharacterTable/CharacterTable';
import { SearchQueryProvider } from '@/components/providers/SearchQueryProvider';

export const myTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(151, 206, 76, 1)',
      '300': 'rgba(151, 206, 76, 0.3)',
    },
    background: {
      default: '#e4a788',
    },
    secondary: {
      main: 'rgba(171, 213, 236, 1)',
      '300': 'rgba(171, 213, 236, 0.3)',
    },
  },
  components: {
    MuiInputLabel: {
      defaultProps: {
        shrink: false,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
        sx: {
          '& label': {
            color: 'primary.main',
            top: '-20px',
            fontSize: '12px',
          },
          '& .MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before':
            {
              borderBottomColor: 'primary.main',
            },
        },
      },
    },
  },
});

export default function Tables() {
  return (
    <ThemeProvider theme={myTheme}>
      <SearchQueryProvider>
        <CharacterTable />
      </SearchQueryProvider>
    </ThemeProvider>
  );
}
