import { NextApiRequest, NextApiResponse } from 'next';

import { client as prisma } from '../../libs/prismadb';
import { serverAuth } from '../../libs/serverAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.body;

    const { currentUser } = await serverAuth(req);

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('Invalid ID');
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    if (req.method === 'POST') {
      updatedFollowingIds.push(userId);

      // Notification part
      try {
        await prisma.notification.create({
          data: {
            body: 'Someone followed you!',
            userId,
          },
        });

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hasNotification: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    // Unfollow (only leave the ones that are not the userId)
    if (req.method === 'DELETE') {
      updatedFollowingIds = updatedFollowingIds.filter(
        (followingId) => followingId !== userId
      );
    }

    // Update the user that is following the other user (current user)
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(400).end();
  }
}
