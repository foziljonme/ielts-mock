import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const uploadConfig: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/audios',
    filename: (
      _req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ): void => {
      const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },

  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ): void => {
    const isAudio: boolean = file.mimetype.startsWith('audio/');

    if (!isAudio) {
      return cb(new BadRequestException('Only audio files are allowed'), false);
    }

    cb(null, true);
  },
};
