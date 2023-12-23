import { useEffect, useState } from "react";

// This is a type guard to filter out null and undefined values from an array
export const isDefined = <T>(value: T | null | undefined): value is T => value !== undefined;

// This function is very similar to the one above, but this lets us loop through specific keys
// and make sure that those keys are actually not null or undefined. This is currently used
// in the EditStyle schema to make sure that the nested objects are not null or undefined
export function hasProps<T, Keys extends Array<keyof T>>(obj: T, keys: Keys):
  obj is T & { [K in Keys[number]]: NonNullable<T[K]> } {
  return keys.every((key) => obj[key] !== undefined && obj[key] !== null);
}

// Debounce function to help debounce the input field on the search bar
export function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export function extractIdFromUrl(episodes: string[]) {
  return episodes
    .map((e) => {
      const url = new URL(e);
      return url.pathname.split("/").pop();
    })
    .filter(isDefined);
}
