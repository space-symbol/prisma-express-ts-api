import { Router } from 'express';
import ProductController from '@controllers/product.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { downloadImageMiddleware } from '@middlewares/download-image.middleware';
import { checkRoleMiddleware } from '@middlewares/check-role.middleware';
import { Role } from '@prisma/client';


const productRouter = Router()
productRouter.post('/', authMiddleware, checkRoleMiddleware(Role.ADMIN), downloadImageMiddleware.array('photos'), ProductController.create)
productRouter.get('/:id?', ProductController.get)
productRouter.get('/:id/recommendations', ProductController.get)
productRouter.patch('/:id', authMiddleware, checkRoleMiddleware(Role.ADMIN), downloadImageMiddleware.array('newPhotos'), ProductController.update)
productRouter.delete('/:id?', authMiddleware, checkRoleMiddleware(Role.ADMIN), ProductController.delete)
export default productRouter
