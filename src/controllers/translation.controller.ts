import { NextFunction, Request, Response } from 'express';
import { Translation } from '../_entities/translation.entity';
import { User } from '../_entities/user.entity';
import { AppDataSource } from '../data-source';
import { MailService } from '../utils/mail.service';

export class TranslationController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const translationRepository = AppDataSource.getRepository(Translation);
      const translations = await translationRepository.find({
        relations: ['created_by', 'updated_by'],
      });
      res.json(translations);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const translationRepository = AppDataSource.getRepository(Translation);
      const translation = await translationRepository.findOne({
        where: { translation_id: req.params.id },
        relations: ['created_by', 'updated_by'],
      });
      if (translation) {
        res.json(translation);
      } else {
        res.status(404).json('String not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { str_english, urls, project_ids } = req.body;

      const translationRepository = AppDataSource.getRepository(Translation);
      const translation = await translationRepository.findOneBy({
        str_english: str_english,
      });

      if (translation) {
        res
          .status(409)
          .json(`String already exists.\n Key: ${translation.translation_id}`);
        return;
      }

      if (urls && urls.length > 0) {
        req.body.urls = urls.join(',');
      }
      if (project_ids && project_ids.length > 0) {
        req.body.project_ids = project_ids.join(',');
      }

      if (req.currentUserId) {
        req.body.created_by = req.currentUserId;
        req.body.updated_by = req.currentUserId;
      }

      req.body.created_at = new Date();
      req.body.updated_at = new Date();

      const newString = translationRepository.create(req.body);
      const result = await translationRepository.save(newString);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { str_english, str_french, str_spanish } = req.body;

      const translationRepository = AppDataSource.getRepository(Translation);
      const translation = await translationRepository.findOneBy({
        translation_id: req.params.id,
      });
      if (translation) {
        const { str_english, urls, project_ids } = req.body;
        // const isExist = await translationRepository.findOneBy({
        //   str_english: str_english,
        // });
        // if (isExist) {
        //   res
        //     .status(409)
        //     .json(`String already exists.\n Key: ${isExist.translation_id}`);
        //   return;
        // }
        if (urls && urls.length > 0) {
          req.body.urls = urls.join(',');
        }
        if (project_ids && project_ids.length > 0) {
          req.body.project_ids = project_ids.join(',');
        }

        if (req.currentUserId) {
          req.body.updated_by = req.currentUserId;
        }

        req.body.updated_at = new Date();

        // history
        const changes = [];
        if (translation.str_english !== str_english) {
          changes.push({
            changed_field: 'str_english',
            old_value: translation.str_english,
            new_value: str_english,
            changed_by: req.currentUserId,
            changed_at: new Date(),
          });
        }
        if (translation.str_french !== str_french) {
          changes.push({
            changed_field: 'str_french',
            old_value: translation.str_french,
            new_value: str_french,
            changed_by: req.currentUserId,
            changed_at: new Date(),
          });
        }
        if (translation.str_spanish !== str_spanish) {
          changes.push({
            changed_field: 'str_spanish',
            old_value: translation.str_spanish,
            new_value: str_spanish,
            changed_by: req.currentUserId,
            changed_at: new Date(),
          });
        }

        req.body.history = [...(translation.history || []), ...changes];

        translationRepository.merge(translation, req.body);
        const result = await translationRepository.save(translation);
        res.json(result);
      } else {
        res.status(404).json('String not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const translationRepository = AppDataSource.getRepository(Translation);
      const translation = await translationRepository.findOneBy({
        translation_id: req.params.id,
      });
      if (translation) {
        if (!translation.is_active) {
          res.status(500).json('This string is already deactivated');
          return;
        }
        translation.is_active = false;
        const result = await translationRepository.save(translation);

        const projectRepository = AppDataSource.getRepository(User);
        const query = projectRepository
          .createQueryBuilder('user')
          .select('user.email')
          .innerJoin('user.projects', 'project')
          .where('project.project_id IN (:...projectIds)', {
            projectIds: translation.project_ids.split(','),
          });

        const users = await query.getMany();
        if (users && users.length > 0) {
          const emails = users.map((user) => user.email);
          console.log(emails);
          const mailService = new MailService();
          await mailService.sendMail(
            emails,
            `Notification from MultiLang App`,
            `Dear User, \n\n S_1 key is deactivated. \n\n Regards, \n MultiLang App`
          );
        }

        res.status(200).json(result);
      } else {
        res.status(404).json('String not found');
      }
    } catch (error) {
      next(error);
    }
  };
}
