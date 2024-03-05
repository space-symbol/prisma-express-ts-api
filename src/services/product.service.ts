import { ApiError } from '../error/ApiError';
import prisma from '../index'
import { product } from '@prisma/client';
import * as fs from 'fs';
import { STATIC_PATH } from '../const/paths';
import { logger } from '../logger/logger';

export interface GetProductsQueryParams {
	tags?: string[]
	services?: string[]
	sort?: string
	sortBy?: string
	limit?: number
	offset?: number
}

type ProductBodyArrays = keyof Pick<product, 'tags'>

type ProductBodyFieldsToBeArray = Array<Required<ProductBodyArrays>>

export interface UpdateProductBody<T> extends Partial<Omit<product, 'id' | 'photos'>> {
	size: T;
	age: T;
	height: T;
	weight: T;
	photos: {
		deleted: string[],
		left: string[]
	}
}

export class ProductService {
	static shouldBeArray: ProductBodyFieldsToBeArray = ['tags' ]

	static async createProduct(productData: product) {

	}

	static async getOne(productId: number) {
		const product = await prisma.product.findUnique({
			where: {
				id: productId
			},
		})
		if (!product) {
			throw ApiError.badRequest('Модель не найдена')
		}
		return product
	}

	static async getByQueryParams(params: GetProductsQueryParams) {
		const {
			tags,
			services,
			sort,
			limit,
			offset,
			sortBy,
		} = params

		const query = {
			where: {},
			orderBy: {},
		}

		if (services) {
			query.where = {
				...query.where,
				services: {
					hasSome: services
				}
			}
		}
		if (tags) {
			query.where = {
				...query.where,
				tags: {
					hasSome: tags
				}
			}
		}
		if (sort && sortBy) {
			query.orderBy = {
				price: sort
			}
		}

		if (limit) {
			query['take'] = limit
		}

		if (offset) {
			query['skip'] = offset
		}

		const products = await prisma.product.findMany(query)

		if (!products) {
			throw ApiError.badRequest('Модели с такими параметрами не найдены')
		}
		const totalProducts = await prisma.product.count();

		return {
			products,
			totalProducts
		}
	}

	static async deleteOne(productId: number) {
		if (!productId) {
			throw ApiError.badRequest('productId не передан')
		}
		const deletedProduct: product = (await prisma.$queryRaw<product[]>`
			delete from product where id = ${productId} returning *
		`)[0]
		if (!deletedProduct) {
			throw ApiError.badRequest(`Модель не существует/уже удалена`)
		}
		deletedProduct.photos.map(photo => {
			fs.unlink(STATIC_PATH + `/${photo}`, (err) => {
				if (err) {
					logger.error(err)
				}
			})
		})
		return deletedProduct
	}

	static async deleteAll() {
		const products: product[] = await prisma.$queryRaw`truncate product restart identity cascade `
		return products
	}

	static async updateOne(productId: number, data: UpdateProductBody<string>, files: string[]) {
		const formattedData = {};
		Object.keys(data).forEach((key, index) => {
			if (this.shouldBeArray.includes(key as ProductBodyFieldsToBeArray[0])) {
				formattedData[key] = data[key]
			} else if (key === 'photos') {
				const photos = data[key].left
				if (files.length) {
					photos.push(...files)
				}
				formattedData['photos'] = photos
			} else {
				formattedData[key] = data[key];
			}
		})
		if (!formattedData['photos'] && files.length) {
			formattedData['photos'] = files
		}
		const updateProducts = await prisma.product.update({
			data: { ...formattedData },
			where: {
				id: productId
			}
		})
		data.photos.deleted.forEach(photo => {
			fs.unlink(STATIC_PATH + `/${photo}`, (err) => {
				if (err) {
					logger.error(err)
				}
			})
		})
		return updateProducts
	}
}

export default ProductService
