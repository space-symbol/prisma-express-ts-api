import 'module-alias/register';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors'
import { morganMiddleware } from '@middlewares/morgan.middleware';
import { errorMiddleware } from '@middlewares/error.middleware';
import { logger } from './logger/logger';
import router from './routes';
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client';
import * as process from 'process';
import path from 'path';

dotenv.config()
const app: Express = express()
const port = process.env.PORT
const whitelist = [process.env.CLIENT_URL]
const corsConfig: CorsOptions  = {
	credentials: true,
	origin: function (origin, callback) {
		if (!origin || whitelist.indexOf(origin!) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}
app.use(cors(corsConfig))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router);
app.use(morganMiddleware);
app.use(errorMiddleware);

export default new PrismaClient({
	log: [
		{
			emit: 'stdout',
			level: 'query',
		},
		{
			emit: 'stdout',
			level: 'error',
		},
		{
			emit: 'stdout',
			level: 'info',
		},
		{
			emit: 'stdout',
			level: 'warn',
		},
	],
})


async function index() {
	try {
		app.listen(port, () => {
			logger.info(`[server]: Server is running at http://localhost:${port}`);
		});
	} catch (e) {
		logger.error(e)
	}
}

index().catch(e => {
	logger.error(e)
})
