import { Router } from 'express';
import { TranslationController } from '../controllers/translation.controller';

const router = Router();

router.get('/', TranslationController.getAll);
router.get('/:id', TranslationController.getById);
router.post('/', TranslationController.create);
router.put('/:id', TranslationController.update);
router.delete('/:id', TranslationController.delete);

export default router;
