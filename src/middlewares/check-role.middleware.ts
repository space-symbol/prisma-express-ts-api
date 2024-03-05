import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../error/ApiError';
import userService from '../services/user.service';
import tokenService from '../services/token.service';
import { logger } from '../logger/logger';
import { Role } from '@prisma/client';

export const checkRoleMiddleware = (role: Role) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (req.method === 'OPTIONS') {
				next()
			}
			const user = req.body.user
			if (user.role !== role) {
				return next(ApiError.forbidden('Нет прав'))
			}
			next();
		} catch (e) {
			next(e)
		}
	}
};
