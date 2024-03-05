import { Request } from 'express'

type RequestBody<T> = Request<{}, {}, T>;
type RequestParams<T> = Request<T>;
type RequestQuery<T> = Request<{}, {}, {}, T>;

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			JWT_ACCESS_SECRET: string;
			JWT_REFRESH_SECRET: string;
			NODE_ENV: 'development' | 'production';
			PORT: string;
			CLIENT_URL: string;
			STATIC_DIRNAME: string;
			IMAGES_DIRNAME: string;
		}
	}
}
