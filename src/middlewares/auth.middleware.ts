import {NextFunction, Request, Response} from 'express'
import { ApiError } from '../error/ApiError';
import userService from '../services/user.service';
import tokenService from '../services/token.service';
import { logger } from '../logger/logger';
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

		try {
			const auth = req.headers.authorization;
			if (!auth) {
				return next(ApiError.unAuthorized('Не авторизован'));
			}
			const token = auth.split(' ')[1];
			if (!token) {
				return next(ApiError.unAuthorized('Не авторизован'));
			}
			const userData = tokenService.validateAccessToken(token)
			if (!userData) {
				return next(ApiError.unAuthorized('Не авторизован'));
			}
			req.body.user = userData
			next();
		} catch (error) {
			return next(ApiError.unAuthorized('Не авторизован', error));
		}
};
