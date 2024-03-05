import path from 'path';
import process from 'process';
import multer from 'multer';
import { STATIC_PATH } from '../const/paths';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, STATIC_PATH)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, 'image' + '-' + uniqueSuffix + '.png')
	}
})
export const downloadImageMiddleware = multer({storage})
