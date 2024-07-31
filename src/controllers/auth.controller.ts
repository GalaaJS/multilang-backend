import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User } from '../_entities/user.entity';
import { UserConnected } from '../_entities/user_connected.entity';
import { AppDataSource } from '../data-source';
import { CustomError } from '../utils/customError';

export class AuthController {
  // login
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateLogin(req, res, next);
      // const user = await AppDataSource.getRepository(User).findOneBy({
      //   username: req.body.username,
      // });
      const user = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .addSelect('user.password') // Include the password column
        .where('user.username = :username', { username: req.body.username })
        .getOne();

      if (!user) {
        throw new CustomError('Username or password wrong', 500);
      }

      const isEqual = bcrypt.compareSync(req.body.password, user.password);
      if (isEqual) {
        const token = generateRandomString(150);
        const userEntity = new UserConnected();
        userEntity.user_id = user.user_id;
        userEntity.token = token;
        userEntity.lastConnected = new Date();
        const userConnected = await AppDataSource.getRepository(
          UserConnected
        ).save(userEntity);

        res
          .cookie('access_token', userConnected.token, {
            maxAge: 9000000,
            httpOnly: true,
          })
          .status(200)
          .json({
            user_id: user.user_id,
            username: user.username,
          });
      } else {
        throw new CustomError('Username or password wrong', 500);
      }
    } catch (error) {
      next(error);
    }
  };

  // register
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        username: req.body.username,
      });
      if (user) {
        res.status(409).json('User already exists');
        return;
      }

      const userEntity = new User();
      userEntity.username = req.body.username;
      userEntity.password = req.body.password;
      userEntity.email = req.body.email;
      userEntity.created_at = new Date();

      const result = await userRepository.save(userEntity);
      const { password, ...userWithoutPassword } = result;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      next(err);
    }
  };
}

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new CustomError('Username or password wrong', 500);
  }
};

function generateRandomString(length: number) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
