import useSWR from 'swr';

import { fetcher } from '../libs/fetcher';

export const usePosts = (userId?: string) => {
  // If userId is provided, fetch posts by user
  // Otherwise, fetch all posts
  const url = userId ? `/api/posts?userId=${userId}` : '/api/posts';
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};
