import useSWR from 'swr';

import { fetcher } from '../libs/fetcher';

export const usePost = (postId: string) => {
  // The first argument is the key, which is the URL we want to fetch
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/api/posts/${postId}` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
