import prisma from '../index'
import { ApiError } from '../error/ApiError';
import bcrypt from 'bcrypt';
import { UserDto } from '../dtos/user.dto';
import tokenService from './token.service';
import { logger } from '../logger/logger';

class UserService {
	async registration(username: string, password: string) {
		const candidate = await prisma.user.findUnique({
			where: {
				username
			}
		})

		if (candidate) {
			throw ApiError.badRequest('Пользователь с таким логином существует')
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({
			data: {
				username,
				password: hashPassword
			}
		})
		const userDto = new UserDto(user)
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async login(username: string, password: string) {
		if (!(username && password)) {
			throw ApiError.badRequest('Имя пользователя или пароль не были переданы')
		}

		const user = await prisma.user.findUnique({
			where: {
				username
			}
		})
		if (!user) {
			throw ApiError.badRequest('Пользователь с таким логином не зарегистрирован')
		}

		const isPassEqual = await bcrypt.compare(password, user.password);
		if (!isPassEqual) {
			throw ApiError.badRequest('Неверный логин/пароль');
		}
		const userDto = new UserDto({ ...user });
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async logout(refreshToken: string) {
		try {
			const token = await tokenService.removeToken(refreshToken)
			return token
		}catch (e){
			logger.error(e)
			throw e
		}
	}

	async refresh(refreshToken: string) {
		if (!refreshToken) {
			throw ApiError.unAuthorized('Токен не передан');
		}
		const userData = tokenService.validateRefreshToken(refreshToken)
		const tokenFromDatabase = await tokenService.findToken(refreshToken);
		if (!userData || !tokenFromDatabase) {
			throw ApiError.unAuthorized('Токена нет в базе данных');
		}
		const user = await prisma.user.findUnique({
			where: {
				id: userData.id
			}
		})
		if (!user) {
			throw ApiError.unAuthorized('Пользователь не найден');
		}

		const userDto = new UserDto({ ...user! });
		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async getUser(userId: number) {
		if (!userId) {
			throw ApiError.badRequest('Пользователя не существует')
		}

		const user = await prisma.user.findUnique({
			where: {
				id: userId
			}
		});
		if (!user) {
			throw ApiError.badRequest('Пользователя не существует')
		}
		const userData = new UserDto({ ...user })
		return userData
	}
}

export default new UserService()
