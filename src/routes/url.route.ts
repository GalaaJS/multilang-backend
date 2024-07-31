import { Router } from 'express';
import { UrlController } from '../controllers/url.controller';

const router = Router();

router.get('/', UrlController.getAll);
router.get('/:id', UrlController.getById);
router.post('/', UrlController.create);
router.put('/:id', UrlController.update);
router.delete('/:id', UrlController.delete);

export default router;
