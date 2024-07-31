import { NextFunction, Request, Response } from 'express';
import { Project } from '../_entities/project.entity';
import { AppDataSource } from '../data-source';

export class ProjectController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectRepository = AppDataSource.getRepository(Project);
      const projects = await projectRepository.find({
        relations: ['created_by', 'updated_by'],
      });
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectRepository = AppDataSource.getRepository(Project);
      const project = await projectRepository.findOne({
        where: { project_id: req.params.id },
        relations: ['created_by', 'updated_by', 'users'],
      });
      if (project) {
        res.json(project);
      } else {
        res.status(404).json('Project not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { languages } = req.body;
      if (languages && languages.length > 0) {
        req.body.languages = languages.join(',');
      }

      if (req.currentUserId) {
        req.body.created_by = req.currentUserId;
        req.body.updated_by = req.currentUserId;
      }

      req.body.created_at = new Date();
      req.body.updated_at = new Date();

      const projectRepository = AppDataSource.getRepository(Project);
      const newProject = projectRepository.create({
        name: req.body.name,
        description: req.body.description,
        languages: req.body.languages,
        created_by: req.body.created_by,
        updated_by: req.body.updated_by,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at,
      });
      const result = await projectRepository.save(newProject);

      if (req.body.users) {
        const projectInsertions = req.body.users.map(async (userId: string) => {
          await AppDataSource.createQueryBuilder()
            .insert()
            .into('project_users_user') // Use the actual name of your join table
            .values({
              projectProjectId: result.project_id,
              userUserId: userId,
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
      const projectRepository = AppDataSource.getRepository(Project);
      const project = await projectRepository.findOneBy({
        project_id: req.params.id,
      });
      if (project) {
        const { languages } = req.body;
        if (languages && languages.length > 0) {
          req.body.languages = languages.join(',');
        }

        if (req.currentUserId) {
          req.body.updated_by = req.currentUserId;
        }

        req.body.updated_at = new Date();

        if (req.body.users) {
          await AppDataSource.createQueryBuilder()
            .delete()
            .from('project_users_user')
            .where({ projectProjectId: project.project_id })
            .execute();

          const projectInsertions = req.body.users.map(async (userId: any) => {
            const test = await AppDataSource.createQueryBuilder()
              .insert()
              .into('project_users_user')
              .values({
                projectProjectId: project.project_id,
                userUserId: userId,
              })
              .execute();
          });

          await Promise.all(projectInsertions);
        }

        delete req.body.users;

        projectRepository.merge(project, req.body);
        const result = await projectRepository.save(project);

        res.json(result);
      } else {
        res.status(404).json('Project not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectRepository = AppDataSource.getRepository(Project);
      const result = await projectRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
