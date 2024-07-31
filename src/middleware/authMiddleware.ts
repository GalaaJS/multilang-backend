import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppDataSource } from '../data-source';
import { UserConnected } from '../_entities/user_connected.entity';

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.url === '/auth/login') {
      return next();
    }

    const cookies = req.cookies;
    if (cookies && cookies.access_token) {
      const token = cookies.access_token;
      const session = await AppDataSource.getRepository(
        UserConnected
      ).findOneBy({ token: token });

      if (session) {
        const lastConnected = new Date(session.lastConnected);
        lastConnected.setMinutes(lastConnected.getMinutes() + 100);

        if (lastConnected < new Date()) {
          try {
            await AppDataSource.getRepository(UserConnected).remove(session);
          } catch (error) {
            logger.error(error);
          }
          res.status(401).send('Unauthorized');
        } else {
          session.lastConnected = new Date();
          await await AppDataSource.getRepository(UserConnected).save(session);
          req.currentUserId = session.user_id;
          return next();
        }
      } else {
        res.status(401).send('Unauthorized');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    return next(error);
  }
}
