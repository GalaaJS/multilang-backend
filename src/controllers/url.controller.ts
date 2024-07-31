import { NextFunction, Request, Response } from 'express';
import { URL } from '../_entities/url.entity';
import { AppDataSource } from '../data-source';
export class UrlController {
  static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urlRepository = AppDataSource.getRepository(URL);
      const urls = await urlRepository.find({
        relations: ['created_by', 'updated_by'],
      });
      res.json(urls);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urlRepository = AppDataSource.getRepository(URL);
      const url = await urlRepository.findOne({
        where: { url_id: req.params.id },
        relations: ['created_by', 'updated_by'],
      });
      if (url) {
        res.json(url);
      } else {
        res.status(404).json('URL not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.currentUserId) {
        req.body.created_by = req.currentUserId;
        req.body.updated_by = req.currentUserId;
      }

      req.body.created_at = new Date();
      req.body.updated_at = new Date();

      const urlRepository = AppDataSource.getRepository(URL);
      const newUrl = urlRepository.create(req.body);
      const result = await urlRepository.save(newUrl);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urlRepository = AppDataSource.getRepository(URL);
      const url = await urlRepository.findOneBy({ url_id: req.params.id });
      if (url) {
        if (req.currentUserId) {
          req.body.updated_by = req.currentUserId;
        }

        req.body.updated_at = new Date();

        urlRepository.merge(url, req.body);
        const result = await urlRepository.save(url);
        res.json(result);
      } else {
        res.status(404).json('URL not found');
      }
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urlRepository = AppDataSource.getRepository(URL);
      const result = await urlRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
