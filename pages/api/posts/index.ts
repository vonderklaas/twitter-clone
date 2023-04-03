import { NextApiRequest, NextApiResponse } from 'next';

import { serverAuth } from '../../../libs/serverAuth';
import { client as prisma } from '../../../libs/prismadb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only handle POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    // Create Posts
    if (req.method === 'POST') {
      // Extract current user
      const { currentUser } = await serverAuth(req);
      // Extract body contents
      const { body } = req.body;

      const post = await prisma.post.create({
        data: {
          body,
          userId: currentUser.id,
        },
      });

      return res.status(200).json(post);
    }

    // Fetch Posts
    if (req.method === 'GET') {
      const { userId } = req.query;

      let posts;

      // If userId is provided, fetch posts by user
      if (userId && typeof userId === 'string') {
        posts = await prisma.post.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      } else {
        // Otherwise, fetch all posts
        posts = await prisma.post.findMany({
          include: {
            user: true,
            comments: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }

      return res.status(200).json(posts);
    }
  } catch (error) {
    return res.status(400).end();
  }
}
