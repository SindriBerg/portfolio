import { FilterCharacter } from "@/gql/__generated__/rick-and-morty-graphql";
import { Autocomplete, TextField } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { createContext, useContext, PropsWithChildren, useState, useMemo, Dispatch, SetStateAction } from "react";

type TableFiltersContextType = {
  filters: FilterCharacter;
  setfilters: Dispatch<SetStateAction<FilterCharacter>>;
};

const TableFiltersContext = createContext<TableFiltersContextType>({
  filters: {},
  setfilters: () => { },
});

const useTableFilters = () => {
  const context = useContext(TableFiltersContext);
  if (context === undefined) {
    throw new Error(
      'useTableFilters must be used within a TableFiltersProvider'
    );
  }
  return context;
};

const TableFiltersProvider = (props: PropsWithChildren) => {
  const [filters, setfilters] = useState<FilterCharacter>({
    gender: null,
    species: null,
    status: null,
    type: null,
  });

  const context: TableFiltersContextType = useMemo(() => {
    return {
      filters,
      setfilters,
    };
  }, [filters, setfilters]);

  return (
    <TableFiltersContext.Provider value={context}>
      {props.children}
    </TableFiltersContext.Provider>
  );
};

const TableFilters = () => {
  const { filters, setfilters } = useTableFilters();
  return (
    <Grid
      container
      padding={2}
      columns={5}
      className="table-filters"
      display="flex"
      flexDirection="row"
      paddingBlock={1}
    >
      <Grid xs paddingLeft={3}>
        <Autocomplete
          options={['Alive', 'Dead', 'Unknown']}
          value={filters.status}
          onChange={(_, newValue) => {
            setfilters((prev) => ({
              ...prev,
              status: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              label="Status"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs paddingLeft={3}>
        <Autocomplete
          options={['Human', 'Alien', 'Poopybutthole']}
          value={filters.species}
          onChange={(_, newValue) => {
            setfilters((prev) => ({
              ...prev,
              species: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              label="Species"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs paddingLeft={3}>
        <Autocomplete
          options={['Male', 'Female', 'Unknown', 'Genderless']}
          value={filters.gender}
          onChange={(_, newValue) => {
            setfilters((prev) => ({
              ...prev,
              gender: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              label="Gender"
              variant="standard"
            />
          )}
        />
      </Grid>
      <Grid xs paddingLeft={3}>
        <Autocomplete
          options={['Male', 'Female', 'Unknown', 'Genderless']}
          value={filters.type}
          onChange={(_, newValue) => {
            setfilters((prev) => ({
              ...prev,
              type: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{
                shrink: false,
              }}
              label="Type"
              variant="standard"
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export { TableFilters, useTableFilters, TableFiltersProvider };
