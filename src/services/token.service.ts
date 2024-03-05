import jwt from 'jsonwebtoken';
import process from 'process';
import prisma from '../index'
import { user } from '@prisma/client';

class TokenService {
	generateToken(payload: any) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' })
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
		return {
			accessToken,
			refreshToken
		}
	}

	async saveToken(userId: number, refreshToken: string) {
		const tokenData = await prisma.token.findUnique({
			where: {
				user_id: userId
			}
		});
		if (tokenData) {
			const token = await prisma.token.update({
				where: {
					user_id: userId
				},
				data: {
					refresh_token: refreshToken
				}
			})
			return token
		}
		const token = await prisma.token.create({
			data: {
				user_id: userId,
				refresh_token: refreshToken
			}
		})
		return token;
	}

	async removeToken(refreshToken: string) {
		try {
			const token = await prisma.token.delete({
				where: {
					refresh_token: refreshToken
				}
			})
			return token
		}catch (e) {
			return null
		}

	}

	async findToken(refreshToken: string) {
		const token = await prisma.token.findUnique({
			where: {
				refresh_token: refreshToken
			}
		})
		return token;
	}
	validateAccessToken(accessToken: string) {
		try{
			return <Exclude<user, 'password'>>jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
		} catch (e) {
			return null

		}
	}
	validateRefreshToken(refreshToken: string) {
		try{
			return <Exclude<user, 'password'>>jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
		} catch (e) {
			return null
		}
	}
}

export default new TokenService()
