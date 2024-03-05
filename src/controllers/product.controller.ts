import { NextFunction, Request, Response } from 'express'
import { RequestBody, RequestParams } from '../../global';
import prisma from '../index';
import productService, { UpdateProductBody } from '../services/product.service';
import { Prisma } from '@prisma/client'
import { ApiError } from '../error/ApiError';
import { logger } from '../logger/logger';

interface ModeCreateBody {
	product: string;
	tariffs: string;
	services: string;
	tags: string;
}
interface ProductUpdateBody {
	changes: string
}
interface ProductGetQuery {
	limit?: string;
	offset?: string;
	sort?: Prisma.SortOrder | undefined;
	tags?: string;
	services?: string;
	sortBy?: string;
}

class ProductController {
	async create(req: RequestBody<ModeCreateBody>, res: Response, next: NextFunction) {
		try {
			const productData = JSON.parse(req.body.product)
			const photos = req.files
			const photosPaths: string[] = []
			if (photos && photos.length) {
				for (let i = 0; i < (photos.length as number); i++) {
					photosPaths.push(photos[i].filename)
				}
			}
			productData['photos'] = photosPaths

			const newProduct = await prisma.product.create({
				data: productData
			})

			return res.json(newProduct)
		} catch (e) {
			next(e)
		}
	}

	async get(req: Request<{ id?: string }, {}, {}, ProductGetQuery>, res: Response, next: NextFunction) {
		try {
			const productId = Number(req.params.id) || undefined
			if (productId) {
				const product = await productService.getOne(productId)
				return res.json(product)
			} else {
				const tags = req.query.tags ? req.query.tags.split(',') : undefined
				const services = req.query.services ? req.query.services.split(',') : undefined
				const sort = req.query.sort
				const sortBy = req.query.sortBy ? req.query.sortBy : 'tariff_price';
				const limit = req.query.limit ? Number.parseInt(req.query.limit) : 10
				const offset = req.query.offset ? Number.parseInt(req.query.offset) : 0

				const products = await productService.getByQueryParams({ tags, services, sort, sortBy, limit, offset })
				return res.json(products)
			}
		} catch (e) {
			next(e)
		}
	}

	async delete(req: RequestParams<{ id?: string }>, res: Response, next: NextFunction) {
		try {
			const productId = Number(req.params.id)
			if (productId) {
				const product = await productService.deleteOne(productId)
				return res.json(product)
			} else {
				// const products = await productService.deleteAll()
				// return res.json(products)
			}
		} catch (e) {
			next(e)
		}
	}

	async update(req: Request<{ id: string }, {}, ProductUpdateBody>, res: Response, next: NextFunction) {
		try {
			const productId = Number(req.params.id)
			if (!productId) {
				return next(ApiError.badRequest('Id модели не указан'))
			}
			const data: UpdateProductBody<string> = JSON.parse(req.body.changes);
			const files: string[] = []
			if (req.files && req.files.length) {
				for (let i = 0; i < (req.files.length as number); i++) {
					files.push(req.files[i].filename)
				}
			}
			console.log(data)
			const updateProduct = await productService.updateOne(productId, data, files)
			return res.json(updateProduct)
		} catch (e) {
			next(e)
		}
	}
}

export default new ProductController()

