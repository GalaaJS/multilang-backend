import { NextFunction, Request, Response } from 'express';
import { Project } from '../_entities/project.entity';
import { Translation } from '../_entities/translation.entity';
import { AppDataSource } from '../data-source';

export class DataController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { project, url, lang } = req.query;

      if (!project || !url || !lang) {
        return res.status(400).send('Missing parameters');
      }

      if (project.length !== 4) {
        return res.status(400).send('Invalid project parameter');
      }

      if (url.length !== 5) {
        return res.status(400).send('Invalid url parameter');
      }

      let languageColumn: string;
      let langCode: string;

      switch (lang) {
        case 'english':
          languageColumn = 'str_english';
          langCode = 'en';
          break;
        case 'french':
          languageColumn = 'str_french';
          langCode = 'fr';
          break;
        case 'spanish':
          languageColumn = 'str_spanish';
          langCode = 'es';
          break;
        default:
          return res.status(400).send('Invalid language parameter');
      }

      // check if project has language
      const projectEntity = await AppDataSource.getRepository(Project)
        .createQueryBuilder('project')
        .select(['project.project_id'])
        .where('project.project_id = :project', {
          project,
        })
        .andWhere('POSITION(:langCode IN project.languages) > 0', { langCode })
        .getRawMany();
      if (projectEntity.length === 0) {
        return res.status(404).send(`${lang} not found in ${project}`);
      }

      const translations = await AppDataSource.getRepository(Translation)
        .createQueryBuilder('translation')
        .select([
          'translation.translation_id AS k',
          `translation.${languageColumn} AS v`,
        ])
        .where('POSITION(:project IN translation.project_ids) > 0', {
          project,
        })
        .andWhere('POSITION(:url IN translation.urls) > 0', { url })
        .andWhere('translation.is_active = true')
        .getRawMany();

      res.json(translations);
    } catch (error) {
      next(error);
    }
  };
}
