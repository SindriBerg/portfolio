import type { ReactElement, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

import type {
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
} from '@apollo/client';
import { TextField, type AutocompleteValue } from '@mui/material';
import type {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
} from '@mui/material/Autocomplete';
import type { TextFieldProps } from '@mui/material/TextField';

import { useQuery } from '@apollo/client';
import Autocomplete from '@mui/material/Autocomplete';

interface GenericFetchAutocompleteProps<
  D,
  TData,
  TVariables extends OperationVariables,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
> extends Omit<
    AutocompleteProps<
      // CollectionOption: The type for the options and returned value(s)
      D,
      // Multiple: Can be set by the consuming Frontend
      Multiple,
      // DisableClearable: Can be set by the consuming Frontend
      DisableClearable,
      // FreeSolo: Must be false, otherwise value can be of type string
      false
    >,
    'freeSolo' | 'options' | 'renderInput'
  > {
  fetchQuery: TypedDocumentNode<TData, TVariables>;
  textFieldProps?: TextFieldProps;
  queryOptions: QueryHookOptions<TData, TVariables>;
  sortingKey?: keyof D;
  idKey: keyof D;
  dataMapper: (data: TData) => Array<D>;
  optionLabelFormatter: (option: D) => string;
  tagLabelFormatter: (tag: D) => string;
  inputLabels: {
    single: string;
    plural: string;
  };
}

/**
 * GenericFetchAutocomplete Component
 *
 * A flexible Autocomplete component that allows you to fetch and display options in an input field.
 *
 * @template D - The type for the options and returned value(s)
 * @template TData - The type for data fetched from the query
 * @template TVariables - Variables for the query
 * @param {DocumentNode | TypedDocumentNode<TData>} fetchQuery - The GraphQL query document to fetch options.
 * @param {TextFieldProps} textFieldProps - Additional props for the text field.
 * @param {ReactNode} value - The current value of the Autocomplete component.
 * @param {boolean} multiple - Indicates if multiple selections are allowed.
 * @param {boolean} limitTags - Indicates the maximum number of tags to display.
 * @param {keyof D | undefined} sortingKey - Key for sorting the options.
 * @param {QueryHookOptions<TData, TVariables>} queryOptions - Options for the query.
 * @param {keyof D} idKey - Key to identify options.
 * @param {{ single: string, plural: string }} inputLabels - Labels for the input field.
 * @param {(data: TData) => Array<D>} dataMapper - Function to map fetched data to options.
 * @param {(option: D) => string} optionLabelFormatter - Function to format option labels.
 * @param {(option: D) => string} tagLabelFormatter - Function to format tag labels.
 * @param {AutocompleteProps} autoCompleteProps - Additional props for the Autocomplete component.
 *
 * @returns {ReactElement} - The rendered GenericFetchAutocomplete component.
 */
const GenericFetchAutocomplete = <
  D,
  TData,
  TVariables extends OperationVariables,
  Multiple extends boolean,
  DisableClearable extends boolean = false,
>({
  fetchQuery,
  textFieldProps = {},
  value,
  multiple,
  sortingKey,
  queryOptions,
  idKey,
  inputLabels,
  dataMapper,
  onChange,
  optionLabelFormatter,
  tagLabelFormatter,
  ...autoCompleteProps
}: GenericFetchAutocompleteProps<
  D,
  TData,
  TVariables,
  Multiple,
  DisableClearable
>): ReactElement => {
  const { data, loading } = useQuery<TData, TVariables>(
    fetchQuery,
    queryOptions
  );

  const mappedOptions: Array<D> = useMemo(() => {
    if (!data) return [];
    return dataMapper(data);
  }, [data, dataMapper]);

  const handleChangeCallback = useCallback(
    (
      event: React.SyntheticEvent,
      v: AutocompleteValue<D, Multiple, DisableClearable, false>,
      reason: AutocompleteChangeReason,
      details?: AutocompleteChangeDetails<D>
    ): void => {
      onChange?.(event, v, reason, details);
    },
    [onChange]
  );

  return (
    <Autocomplete
      value={value}
      loading={loading}
      options={mappedOptions}
      getOptionLabel={optionLabelFormatter}
      renderInput={(params): ReactNode => (
        <TextField {...params} {...textFieldProps} />
      )}
      isOptionEqualToValue={(o, v): boolean => o[idKey] === v[idKey]}
      ChipProps={{ size: 'small' }}
      freeSolo={false}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      blurOnSelect={!multiple}
      openOnFocus
      fullWidth
      onChange={handleChangeCallback}
      {...autoCompleteProps}
    />
  );
};

export type { GenericFetchAutocompleteProps };
export { GenericFetchAutocomplete };
