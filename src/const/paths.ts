import path from 'path';
import process from 'process';

export const STATIC_PATH = path.resolve(process.cwd(), process.env.STATIC_DIRNAME, process.env.IMAGES_DIRNAME + '/')
