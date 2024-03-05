import express, {Router} from 'express'
import userRouter from '@routes/user.router/user.router';
import tagRouter from '@routes/tag.router/tag.router';
import productRouter from '@routes/product.router/product.router';
import { STATIC_PATH } from '../const/paths';

const router = Router()
router.use('/static', express.static(STATIC_PATH))
router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/tag', tagRouter)
export default router
