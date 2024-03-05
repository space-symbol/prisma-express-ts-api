import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger/logger';
import { ApiError } from '../error/ApiError';

export function errorMiddleware(err, req: Request, res: Response, next: NextFunction) {
	logger.error(err)
	if(err instanceof ApiError){
		return res.status(err.status).json({message: err.message, errors: err.errors})
	}
	return res.status(500).json({message: "Непредвиденная ошибка"})
}
