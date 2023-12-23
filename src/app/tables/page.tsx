'use client';
import {
  createTheme,
  styled,
  TextField,
  ThemeProvider,
} from '@mui/material';
import CharacterTable from '@/components/table/CharacterTable/CharacterTable';

export const myTheme = createTheme({
  palette: {
    primary: {
      main: '#359442',
    },
    background: {
      default: '#16173c',
    },
    secondary: {
      main: '#359442',
    },
  },
});

export const MyTextField = styled(TextField)({
  // Label of the text field when focused
  '& label.Mui-focused': {
    color: myTheme.palette.primary.main,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: myTheme.palette.primary.main,
  },
  '& .MuiOutlinedInput-root': {
    marginBottom: 20,
    backgroundColor: 'white',
    boxShadow: '0px -5px 10px white, -5px 0px 10px white',

    '&:hover fieldset': {
      borderColor: myTheme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: myTheme.palette.primary.main,
    },
  },
});

export default function Tables() {
  return (
    <ThemeProvider theme={myTheme}>
      <CharacterTable />
    </ThemeProvider>
  );
}
