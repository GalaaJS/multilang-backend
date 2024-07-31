import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { User } from '../_entities/user.entity';
import { AppDataSource } from '../data-source';

export class UserController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();
      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersWithoutPassword);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { user_id: +req.params.id },
        relations: ['projects'],
      });
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json('User not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, email, projects } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        username: username,
      });
      if (user) {
        res.status(409).json('User already exists');
        return;
      }

      const newUser = userRepository.create({
        username: username,
        password: password,
        email: email,
        created_at: new Date(),
      });
      const result = await userRepository.save(newUser);

      if (projects) {
        const projectInsertions = projects.map(async (projectId: string) => {
          await AppDataSource.createQueryBuilder()
            .insert()
            .into('project_users_user')
            .values({
              userUserId: result.user_id,
              projectProjectId: projectId,
            })
            .execute();
        });

        await Promise.all(projectInsertions);
      }

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ user_id: +req.params.id });
      if (user) {
        if (req.body.password) {
          req.body.password = bcrypt.hashSync(req.body.password, 10);
        } else {
          delete req.body.password;
        }

        if (req.body.projects) {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from('project_users_user')
            .where({ userUserId: req.params.id })
            .execute();

          const projectInsertions = req.body.projects.map(
            async (projectId: string) => {
              await AppDataSource.createQueryBuilder()
                .insert()
                .into('project_users_user')
                .values({
                  userUserId: user.user_id,
                  projectProjectId: projectId,
                })
                .execute();
            }
          );

          await Promise.all(projectInsertions);
        }

        delete req.body.projects;

        userRepository.merge(user, req.body);
        const result = await userRepository.save(user);
        res.json(result);
      } else {
        res.status(404).json('User not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const result = await userRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // check session
  static checkSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await AppDataSource.getRepository(User).findOneBy({
        user_id: req.currentUserId,
      });
      if (user) {
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      } else {
        res.status(401).send('Unauthorized');
      }
    } catch (error) {
      next(error);
    }
  };
}
