import useSWR from 'swr';

import { fetcher } from '../libs/fetcher';

export const useCurrentUser = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/current', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
