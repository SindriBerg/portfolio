// The "isClient" is just check for window !== undefined.
import { useMemo, useRef } from 'react';
import { create, type StoreApi, type UseBoundStore } from 'zustand';

const useStoreSync = <T>(
  useStore: UseBoundStore<StoreApi<T>>,
  state: T
): UseBoundStore<StoreApi<T>> => {
  // Ref to store flag and avoid rerender.
  const unsynced = useRef(true);
  // Creating store hook with initial state from the server.
  const useServerStore = useMemo(() => create<T>(() => state), [state]);

  if (unsynced.current) {
    // Setting state and changing flag.
    useStore.setState(state);
    unsynced.current = false;
  }
  // For "client" we'll return the original store.
  // For "server" we'll return the newly created one.
  return window !== undefined ? useStore : useServerStore;
};

export { useStoreSync };