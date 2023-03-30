import { NextApiRequest, NextApiResponse } from 'next';

import { client as prisma } from '../../../libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      throw new Error('Invalid ID');
    }

    // Get single user
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // Get user's followers count (all users that have this current user id in their followingIds)
    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return res.status(200).json({ ...existingUser, followersCount });
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
