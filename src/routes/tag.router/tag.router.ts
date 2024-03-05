import { Router } from 'express';
import TagController from '@controllers/tag.controller';

const tagRouter = Router()


tagRouter.post('/', TagController.create)
tagRouter.get('/:id?', TagController.get)
tagRouter.delete('/:id?', TagController.delete)
export default tagRouter
