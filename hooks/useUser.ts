import useSWR from 'swr';

import { fetcher } from '../libs/fetcher';

// This hook is used to fetch a single user (by id)
export const useUser = (userId: string) => {
  // If no userId is passed, return null (this will prevent the hook from fetching)
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
