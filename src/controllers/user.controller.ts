import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../error/ApiError';
import prisma from '../index';
import userService from '../services/user.service';
import jwt from 'jsonwebtoken';
import process from 'process';
import tokenService from '../services/token.service';
import { UserDto } from '../dtos/user.dto';


class UserController {

	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body
			if (!(username && password)) {
				return next(ApiError.badRequest(''))
			}
			const userData = await userService.registration(username, password)

			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 24 * 1000,
				secure: true,
				httpOnly: true
			});
			const toSend = {
				user: userData.user,
				accessToken: userData.accessToken
			}
			res.json(toSend)
		} catch (e) {
			next(e)
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const userData = await userService.login(username, password)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				secure: true,
				httpOnly: true
			})
			const data = tokenService.validateAccessToken(userData.accessToken)
			const toSend = {
				user: data,
				accessToken: userData.accessToken
			}
			return res.json(toSend)
		} catch (e) {
			next(e)
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			const token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch (e) {
			next(e)
		}
	}


	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				secure: true,
				httpOnly: true
			})
			res.json(userData)
		} catch (e) {
			next(e)
		}
	}

	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = Number(req.params.id)
			const userData = userService.getUser(userId)
			res.json(userData)
		} catch (e) {
			next(e)
		}
	}


	async deleteOne(req: Request, res: Response) {

	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			await prisma.user.deleteMany()
			res.json(true)
		} catch (e) {
			next(e)
		}
	}
}

export default new UserController()
