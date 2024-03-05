import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../error/ApiError';
import prisma from '../index';


class TagController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			return res.status(200).json(true)
		} catch (e) {
			next(e)
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const tags = await prisma.tag.findMany()
			if (!tags) {
				return res.json(false)
			}
			res.json(tags)
		} catch (e) {
			next(e)
		}
	}

	async getOne(req: Request, res: Response, next: NextFunction) {
		try {
			const response = false
			res.json(response)

		} catch (e) {
			next(e)
		}
	}

	async delete(req: Request, res: Response) {

	}
}

export default new TagController()
