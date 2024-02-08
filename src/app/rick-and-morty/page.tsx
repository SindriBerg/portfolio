'use client';
import { createTheme, ThemeProvider } from '@mui/material';
import CharacterTable from '@/components/table/CharacterTable/CharacterTable';
import { SearchQueryProvider } from '@/components/providers/SearchQueryProvider';
import { TableFilters, TableFiltersProvider } from '@/components/table/TableFilters';

const myTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(151, 206, 76, 1)',
      '300': 'rgba(151, 206, 76, 0.3)',
      '400': '#c0e193',
    },
    background: {
      default: '#e4a788',
    },
    grey: {
      "300": 'rgb(238, 238, 238)',
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          ":hover": {
            backgroundColor: 'rgba(151, 206, 76, 1)'
          },
          "&.Mui-disabled": {
            "backgroundColor": '#78909c',
            cursor: 'not-allowed',
            pointerEvents: 'unseb',
          }
        },
      }
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
        <TableFiltersProvider>
          <CharacterTable />
        </TableFiltersProvider>
      </SearchQueryProvider>
    </ThemeProvider>
  );
}
