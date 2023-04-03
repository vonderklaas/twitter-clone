import axios from 'axios';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { useCurrentUser } from './useCurrentUser';
import { useLoginModal } from './useLoginModal';
import { usePost } from './usePost';
import { usePosts } from './usePosts';

export const useLike = ({
  postId,
  userId,
}: {
  postId: string;
  userId?: string;
}) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  const loginModal = useLoginModal();

  const hasLiked = useMemo(() => {
    const list = fetchedPost?.likedIds || [];

    return list.includes(currentUser?.id);
  }, [fetchedPost, currentUser]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (hasLiked) {
        // Delete request if user has already liked the post
        request = () => axios.delete('/api/like', { data: { postId } });
      } else {
        // Post request if user has not liked the post
        request = () => axios.post('/api/like', { postId });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();

      toast.success('Success');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [
    currentUser,
    hasLiked,
    postId,
    mutateFetchedPosts,
    mutateFetchedPost,
    loginModal,
  ]);

  return {
    hasLiked,
    toggleLike,
  };
};
