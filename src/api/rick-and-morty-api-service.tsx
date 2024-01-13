import { Character, Episode } from '@/gql/__generated__/rick-and-morty-graphql';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

type APIResponse<T> = {
  data: T
}

// This function fetches characters from the API.
// It accepts a queryFnContext object that contains a tuple consisting of:
// 1: the query key, which is what ReactQuery uses to identify the cached queries.
// 2: A simple Record<string, string> object that contains the query parameters.
export async function getCharactersWithFilters(
  queryFnContext: QueryFunctionContext<
    [string, Record<string, string | number>]
  >
): Promise<APIResponse<Character>> {
  // We pull out the query key and query parameters from the queryFnContext object.
  // We then invalidate the keys.
  // If no keys exist, we will pass an empty params object resulting in a simple query without filters.
  const [, rawParams] = queryFnContext.queryKey;
  const params: Record<string, string | number> = {};
  // We loop through the query parameters and use the Object constructor to pull out
  // the keys from the passed query parameters.
  for (const key of Object.keys(rawParams)) {
    if (rawParams[key]) {
      params[key] = rawParams[key];
    }
  }
  try {
    const query = await axios.get(
      'https://rickandmortyapi.com/api/character/',
      {
        params,
      }
    );
    return query.data;
  } catch (error) {
    // This API has a weird way of handling errors on an empty request.
    // It returns an object with an error key pair instead of an empty array.
    console.error(error);
    throw error;
  }
}

// Simple function to fetch a single episode from the API.
// NOTE: I could not use this since I encountered a problem with useQueries and rerendering.
export async function getEpisode(
  queryFnContext: QueryFunctionContext<[string, string]>
): Promise<Episode> {
  const [, episodeUrl] = queryFnContext.queryKey;
  const query = await axios.get(episodeUrl);
  return query.data;
}

export async function getEpisodeRange(
  queryFnContext: QueryFunctionContext<[string, string[]]>
): Promise<Episode[]> {
  const [, episodeIds] = queryFnContext.queryKey;
  try {
    const query = await axios.get(
      // I wrap them into an array as otherwise the API sometimes responds
      // with an array of episodes when given multiple IDS with "../1,2,3" etc.,
      // but responds with an object when it is only one ID. This caused an issue in the subtable types, so I did a quick fix.
      `https://rickandmortyapi.com/api/episode/[${episodeIds}]`
    );
    return query.data;
  } catch (error) {
    // This API has a weird way of handling errors on an empty request.
    // It returns an object with an error key pair instead of an empty array.
    console.log(error);
    throw error;
  }
}

export async function getCharacterRange(
  queryFnContext: QueryFunctionContext<[string, string[]]>
): Promise<Character[]> {
  const [, characterIds] = queryFnContext.queryKey;
  try {
    const query = await axios.get(
      // I wrap them into an array as otherwise the API sometimes responds
      // with an array of characters when given multiple IDS with "../1,2,3" etc.,
      // but responds with an object when it is only one ID. This caused an issue in the subtable types, so I did a quick fix.
      `https://rickandmortyapi.com/api/character/[${characterIds}]`
    );
    return query.data;
  } catch (error) {
    // This API has a weird way of handling errors on an empty request.
    // It returns an object with an error key pair instead of an empty array.
    console.log(error);
    throw error;
  }
}
